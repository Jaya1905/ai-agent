import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCallSession } from '../services/api';

const CallSessionDetails = () => {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getCallSession(id);
        setSession(response.data.data);
      } catch (_) {
        setError('Failed to fetch call session details');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (loading)
    return <p className="p-6 text-gray-500">Loading...</p>;

  if (error)
    return <p className="p-6 text-red-500">{error}</p>;

  if (!session)
    return <p className="p-6">Session not found</p>;

  const statusColor =
    session.status === 'active'
      ? 'bg-green-100 text-green-700'
      : session.status === 'completed'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2f1e14]">
            Call Session Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Session ID: {id}
          </p>
        </div>

        <Link
          to="/calls"
          className="
            px-5 py-2 rounded-lg
            bg-[#814c27]
            text-white
            hover:bg-[#9b5b38]
            shadow
            transition
            font-semibold
          "
        >
          ← Back to Calls
        </Link>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl">

        <div className="grid grid-cols-2 gap-6">

          {/* Lead */}
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              Lead ID
            </p>
            <p className="font-medium text-gray-900 mt-1">
              {session.leadId}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              Status
            </p>
            <span
              className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
            >
              {session.status}
            </span>
          </div>

          {/* Started */}
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              Started At
            </p>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(session.startedAt).toLocaleString()}
            </p>
          </div>

          {/* Ended */}
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              Ended At
            </p>
            <p className="font-medium text-gray-900 mt-1">
              {session.endedAt
                ? new Date(session.endedAt).toLocaleString()
                : '—'}
            </p>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              Duration
            </p>
            <p className="font-medium text-gray-900 mt-1">
              {session.duration || '—'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CallSessionDetails;
