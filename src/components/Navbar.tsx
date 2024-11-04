import { Link } from 'react-router-dom';
import { BarChart3, Users, Upload, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-lg">Supplier Monitor</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/upload-compliance" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}