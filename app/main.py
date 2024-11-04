from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import openai

from . import models, schemas, database
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Supplier Compliance Monitor API",
    description="API for monitoring supplier compliance and generating insights",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/suppliers", response_model=List[schemas.Supplier])
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(models.Supplier).all()
    return suppliers

@app.post("/suppliers", response_model=schemas.Supplier)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = models.Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.get("/suppliers/{supplier_id}", response_model=schemas.SupplierDetail)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@app.post("/suppliers/check-compliance")
async def check_compliance(
    compliance_data: schemas.ComplianceCheck,
    db: Session = Depends(get_db)
):
    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == compliance_data.supplier_id
    ).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # Create compliance record
    compliance_record = models.ComplianceRecord(
        supplier_id=compliance_data.supplier_id,
        metric=compliance_data.metric,
        result=compliance_data.result,
        status="compliant" if compliance_data.is_compliant else "non-compliant",
        date_recorded=datetime.utcnow()
    )
    db.add(compliance_record)

    # Update supplier compliance score
    compliance_history = db.query(models.ComplianceRecord).filter(
        models.ComplianceRecord.supplier_id == supplier.id
    ).all()
    
    total_records = len(compliance_history) + 1
    compliant_records = sum(1 for record in compliance_history if record.status == "compliant")
    if compliance_data.is_compliant:
        compliant_records += 1
    
    supplier.compliance_score = int((compliant_records / total_records) * 100)
    supplier.last_audit = datetime.utcnow()
    
    db.commit()
    
    # Generate AI analysis
    analysis_prompt = f"""
    Analyze the following supplier compliance data:
    Supplier: {supplier.name}
    Metric: {compliance_data.metric}
    Result: {compliance_data.result}
    Is Compliant: {compliance_data.is_compliant}
    Overall Compliance Score: {supplier.compliance_score}%
    
    Please provide:
    1. A brief analysis of the compliance issue
    2. Potential root causes
    3. Recommendations for improvement
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": analysis_prompt}]
        )
        ai_analysis = response.choices[0].message.content
    except Exception as e:
        ai_analysis = "AI analysis currently unavailable"
    
    return {
        "compliance_record": compliance_record,
        "updated_score": supplier.compliance_score,
        "ai_analysis": ai_analysis
    }

@app.get("/suppliers/insights/{supplier_id}")
async def get_supplier_insights(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    compliance_records = db.query(models.ComplianceRecord).filter(
        models.ComplianceRecord.supplier_id == supplier_id
    ).all()
    
    insights_prompt = f"""
    Based on the following supplier data:
    Supplier: {supplier.name}
    Current Compliance Score: {supplier.compliance_score}%
    Contract Terms: {supplier.contract_terms}
    Compliance History: {[{
        'metric': record.metric,
        'result': record.result,
        'status': record.status,
        'date': record.date_recorded.strftime('%Y-%m-%d')
    } for record in compliance_records]}
    
    Please provide:
    1. Key patterns in compliance/non-compliance
    2. Specific recommendations for improving compliance
    3. Suggested contract term adjustments
    4. Risk assessment and mitigation strategies
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": insights_prompt}]
        )
        insights = response.choices[0].message.content
    except Exception as e:
        insights = "AI insights currently unavailable"
    
    return {"insights": insights}