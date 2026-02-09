import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTagById } from '../services/api';
import { toast } from 'react-toastify';

const TagDetails = () => {
  const { id } = useParams();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await getTagById(id);
        setTag(response.data.data);
      } catch (error) {
        console.error('Fetch tag error:', error);

        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }

        toast.error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Failed to fetch tag details'
        );
        } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!tag) return <p className="p-6">Tag not found</p>;

    return (
        <div className="space-y-8">

            {/* HERO HEADER */}
            <div
            style={{ background: 'linear-gradient(90deg, #2f1e14, #814c27)' }}
            className="
                rounded-xl
                px-10 py-8
                text-white
                shadow-lg
            "
            >
            <h1 className="text-3xl font-bold">
                {tag.name}
            </h1>

            <p className="text-sm text-white/80 mt-1">
                Tag configuration & retry logic
            </p>
            </div>

            {/* DETAILS GRID */}
            <div className="
            bg-white
            rounded-xl
            shadow-md
            p-10
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
            gap-8
            ">

            {/* STATUS */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                Status
                </p>

                {tag.active ? (
                <span className="inline-block mt-2 px-4 py-1.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                    Active
                </span>
                ) : (
                <span className="inline-block mt-2 px-4 py-1.5 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
                    Inactive
                </span>
                )}
            </div>

            {/* MAX ATTEMPTS */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                Max Attempts
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                {tag.maxAttempts}
                </p>
            </div>

            {/* INTERVAL */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                Interval Hours
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                {tag.intervalHours}
                </p>
            </div>

            {/* CONTACT WINDOW */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                Contact Window
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                {tag.contactWindow?.start} – {tag.contactWindow?.end}
                </p>
            </div>

            </div>

        </div>
        );

};

export default TagDetails;