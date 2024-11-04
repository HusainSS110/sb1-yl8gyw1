import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Upload, CheckCircle } from 'lucide-react';
import { fetchSuppliers, uploadCompliance } from '../api/suppliers';

function ComplianceUpload() {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [metric, setMetric] = useState('');
  const [result, setResult] = useState('');
  const [isCompliant, setIsCompliant] = useState(true);

  const { data: suppliers } = useQuery('suppliers', fetchSuppliers);

  const mutation = useMutation(uploadCompliance, {
    onSuccess: () => {
      setSelectedSupplier('');
      setMetric('');
      setResult('');
      setIsCompliant(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      supplier_id: Number(selectedSupplier),
      metric,
      result: Number(result),
      is_compliant: isCompliant,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Upload className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Upload Compliance Data</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a supplier</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Metric
            </label>
            <input
              type="text"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Result
            </label>
            <input
              type="number"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isCompliant}
                onChange={(e) => setIsCompliant(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Is Compliant</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {mutation.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Upload Compliance Data'
            )}
          </button>
        </form>

        {mutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 rounded-md flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-700">Compliance data uploaded successfully!</p>
          </div>
        )}

        {mutation.isError && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-red-700">Error uploading compliance data</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplianceUpload;