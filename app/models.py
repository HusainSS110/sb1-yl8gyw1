from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String)
    contract_terms = Column(JSON)
    compliance_score = Column(Integer, default=100)
    last_audit = Column(DateTime)
    
    compliance_records = relationship("ComplianceRecord", back_populates="supplier")

class ComplianceRecord(Base):
    __tablename__ = "compliance_records"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    metric = Column(String)
    result = Column(Float)
    status = Column(String)
    date_recorded = Column(DateTime)
    
    supplier = relationship("Supplier", back_populates="compliance_records")