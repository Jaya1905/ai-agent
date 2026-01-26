import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getLeads,
  startCall,
  getLeadCallSessions,
  endCall,
} from '../services/api';

const Calls = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [callSessions, setCallSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      setLeads(response.data.data || []);
    } catch (_) {
      setError('Failed to fetch leads');
    }
  };

  const handleStartCall = async (leadId) => {
    setLoading(true);
    try {
      await startCall(leadId);

      if (selectedLead === leadId) {
        fetchCallSessions(leadId);
      }

      alert('Call started successfully!');
    } catch (_) {
      setError('Failed to start call');
    } finally {
      setLoading(false);
    }
  };

  const fetchCallSessions = async (leadId) => {
    setLoading(true);
    try {
      const response = await getLeadCallSessions(leadId);
      setCallSessions(response.data.data || []);
      setSelectedLead(leadId);
    } catch (_) {
      setError('Failed to fetch call sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async (sessionId) => {
    if (!window.confirm('End this call?')) return;

    try {
      await endCall(sessionId);

      if (selectedLead) {
        fetchCallSessions(selectedLead);
      }
    } catch (_) {
      setError('Failed to end call');
    }
  };

  const getLeadName = (leadId) => {
    const lead = leads.find((l) => l._id === leadId);
    return lead ? lead.name : 'Unknown';
  };

  return (
    <div>

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#2f1e14]">
            Calls
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Start outbound calls & monitor sessions
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ---------------- LEADS TABLE ---------------- */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">

        <table className="w-full">

          <thead>
            <tr className="bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white">
              {[
                'Name',
                'Phone',
                'Email',
                'Status',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-[#f9f6f3] transition"
              >
                <td className="px-6 py-4 font-medium">
                  {lead.name}
                </td>

                <td className="px-6 py-4 text-sm">
                  {lead.phone}
                </td>

                <td className="px-6 py-4 text-sm">
                  {lead.email}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {lead.status || 'new'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">

                    <button
                      onClick={() => handleStartCall(lead._id)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      Start Call
                    </button>

                    <button
                      onClick={() => fetchCallSessions(lead._id)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#f3ebe3] text-[#814c27] hover:bg-[#e8dccf]"
                    >
                      View Sessions
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {!leads.length && (
          <div className="p-6 text-gray-500">
            No leads found.
          </div>
        )}
      </div>

      {/* ---------------- CALL SESSIONS TABLE ---------------- */}
      {selectedLead && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="px-6 py-4 border-b font-semibold text-[#2f1e14]">
            Call Sessions for {getLeadName(selectedLead)}
          </div>

          <table className="w-full">

            <thead>
              <tr className="bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white">
                {[
                  'Session ID',
                  'Status',
                  'Started',
                  'Ended',
                  'Duration',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {callSessions.map((session) => (
                <tr
                  key={session._id}
                  className="hover:bg-[#f9f6f3]"
                >
                  <td className="px-6 py-4 text-xs font-mono">
                    {session._id}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                      {session.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(session.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {session.endedAt
                      ? new Date(session.endedAt).toLocaleString()
                      : '—'}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {session.duration || '—'}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex gap-3">

                      <Link
                        to={`/calls/session/${session._id}`}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        View
                      </Link>

                      {session.status === 'active' && (
                        <button
                          onClick={() => handleEndCall(session._id)}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          End Call
                        </button>
                      )}

                    </div>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {!callSessions.length && (
            <div className="p-6 text-gray-500">
              No call sessions found.
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Calls;
