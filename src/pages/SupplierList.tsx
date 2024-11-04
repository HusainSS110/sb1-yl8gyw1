import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { fetchSuppliers } from '../api/suppliers';
import { formatDistanceToNow } from 'date-fns';

function SupplierList() {
  const { data: suppliers, isLoading, error } = useQuery('suppliers', fetchSuppliers);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error loading suppliers</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 gap-4 sm:gap-0">
          {suppliers?.map((supplier) => (
            <Link
              key={supplier.id}
              to={`/suppliers/${supplier.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  supplier.compliance_score >= 90 ? 'bg-green-100' :
                  supplier.compliance_score >= 70 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {supplier.compliance_score >= 90 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{supplier.name}</h2>
                  <p className="text-sm text-gray-500">{supplier.country}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    Compliance Score
                  </div>
                  <div className={`text-lg font-bold ${
                    supplier.compliance_score >= 90 ? 'text-green-600' :
                    supplier.compliance_score >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {supplier.compliance_score}%
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SupplierList;