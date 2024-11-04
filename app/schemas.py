from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class SupplierBase(BaseModel):
    name: str
    country: str
    contract_terms: Dict[str, Any]

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    id: int
    compliance_score: int
    last_audit: Optional[datetime]

    class Config:
        from_attributes = True

class ComplianceRecord(BaseModel):
    id: int
    supplier_id: int
    metric: str
    result: float
    status: str
    date_recorded: datetime

    class Config:
        from_attributes = True

class SupplierDetail(Supplier):
    compliance_records: list[ComplianceRecord] = []

class ComplianceCheck(BaseModel):
    supplier_id: int
    metric: str
    result: float
    is_compliant: bool