import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import SupplierList from './pages/SupplierList';
import SupplierDetail from './pages/SupplierDetail';
import ComplianceUpload from './pages/ComplianceUpload';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<SupplierList />} />
              <Route path="/suppliers/:id" element={<SupplierDetail />} />
              <Route path="/upload-compliance" element={<ComplianceUpload />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;