import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { fetchSupplierDetail } from '../api/suppliers';
import ComplianceChart from '../components/ComplianceChart';
import { format } from 'date-fns';

function SupplierDetail() {
  const { id } = useParams();
  const { data: supplier, isLoading, error } = useQuery(
    ['supplier', id],
    () => fetchSupplierDetail(Number(id))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error loading supplier details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
            <p className="text-gray-500">{supplier.country}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Compliance Score</div>
            <div className={`text-2xl font-bold ${
              supplier.compliance_score >= 90 ? 'text-green-600' :
              supplier.compliance_score >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {supplier.compliance_score}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Compliance History</h2>
          <ComplianceChart records={supplier.compliance_records} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Records</h2>
          <div className="space-y-4">
            {supplier.compliance_records.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                {record.status === 'compliant' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{record.metric}</div>
                  <div className="text-sm text-gray-500">
                    Result: {record.result}
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(record.date_recorded), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Contract Terms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(supplier.contract_terms).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">{key}</div>
              <div className="font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SupplierDetail;