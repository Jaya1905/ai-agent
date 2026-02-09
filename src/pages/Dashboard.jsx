import { useState, useEffect } from 'react';
import { getHealth } from '../services/api';
import { toast } from 'react-toastify';
import {
  FaHeartbeat,
  FaTags,
  FaQuestionCircle,
  FaUsers,
} from 'react-icons/fa';

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getHealth();
        setHealth(response.data);
      } catch (error) {
        console.error('Fetch health error:', error);

        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to fetch health status'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="space-y-10">

      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-bold text-[#2f1e14] tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          System health and AI agent performance snapshot
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* API Health */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-[#814c27] p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">API Health</h3>

            <div className="w-10 h-10 rounded-lg bg-[#f3e6da] flex items-center justify-center text-[#814c27]">
              <FaHeartbeat />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <p className="text-green-600 font-semibold flex items-center gap-2">
                ✅ {health?.message || 'Healthy'}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-[#5c3f2a] p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Total Tags</h3>

            <div className="w-10 h-10 rounded-lg bg-[#f3e6da] flex items-center justify-center text-[#814c27]">
              <FaTags />
            </div>
          </div>

          <p className="mt-6 text-3xl font-bold text-[#2f1e14]">--</p>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-[#5c3f2a] p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Total Questions</h3>

            <div className="w-10 h-10 rounded-lg bg-[#f3e6da] flex items-center justify-center text-[#814c27]">
              <FaQuestionCircle />
            </div>
          </div>

          <p className="mt-6 text-3xl font-bold text-[#2f1e14]">--</p>
        </div>

        {/* Leads */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-[#5c3f2a] p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Total Leads</h3>

            <div className="w-10 h-10 rounded-lg bg-[#f3e6da] flex items-center justify-center text-[#814c27]">
              <FaUsers />
            </div>
          </div>

          <p className="mt-6 text-3xl font-bold text-[#2f1e14]">--</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
