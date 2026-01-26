import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLeadById } from '../services/api';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await getLeadById(id);
        setLead(response.data.data);
      } catch (_) { // eslint-disable-line no-unused-vars
        setError('Failed to fetch lead details');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!lead) return <p className="p-6">Lead not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lead Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Status:</strong> {lead.status}</p>
        <p><strong>Tag ID:</strong> {lead.tagId}</p>
      </div>
    </div>
  );
};

export default LeadDetails;