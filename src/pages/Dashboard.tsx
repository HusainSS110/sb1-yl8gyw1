import { useQuery } from 'react-query';
import { BarChart3, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { fetchSuppliers } from '../api/suppliers';
import ComplianceTrends from '../components/ComplianceTrends';

function Dashboard() {
  const { data: suppliers, isLoading } = useQuery('suppliers', fetchSuppliers);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const averageCompliance = suppliers
    ? suppliers.reduce((acc, s) => acc + s.compliance_score, 0) / suppliers.length
    : 0;

  const lowComplianceSuppliers = suppliers
    ? suppliers.filter(s => s.compliance_score < 70)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Compliance</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageCompliance.toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers?.length || 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Compliance</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowComplianceSuppliers.length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Compliance Trends</h2>
        <ComplianceTrends suppliers={suppliers || []} />
      </div>

      {lowComplianceSuppliers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Compliance Alerts</h2>
          <div className="space-y-4">
            {lowComplianceSuppliers.map(supplier => (
              <div key={supplier.id} className="flex items-center space-x-3 p-4 bg-red-50 rounded-md">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-700">{supplier.name}</p>
                  <p className="text-sm text-red-600">
                    Low compliance score: {supplier.compliance_score}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;