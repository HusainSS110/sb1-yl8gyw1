import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Supplier {
  id: number;
  name: string;
  country: string;
  contract_terms: Record<string, any>;
  compliance_score: number;
  last_audit: string;
}

export interface ComplianceRecord {
  id: number;
  supplier_id: number;
  metric: string;
  result: number;
  status: string;
  date_recorded: string;
}

export interface SupplierDetail extends Supplier {
  compliance_records: ComplianceRecord[];
}

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${API_URL}/suppliers`);
  return response.data;
};

export const fetchSupplierDetail = async (id: number): Promise<SupplierDetail> => {
  const response = await axios.get(`${API_URL}/suppliers/${id}`);
  return response.data;
};

export interface ComplianceData {
  supplier_id: number;
  metric: string;
  result: number;
  is_compliant: boolean;
}

export const uploadCompliance = async (data: ComplianceData) => {
  const response = await axios.post(`${API_URL}/suppliers/check-compliance`, data);
  return response.data;
};