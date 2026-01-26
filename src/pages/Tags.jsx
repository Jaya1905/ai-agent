import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTags, createTag, updateTag, deleteTag } from '../services/api';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTag, setDeletingTag] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    active: true,
    maxAttempts: 3,
    intervalHours: 24,
    contactWindow: { start: '09:00', end: '17:00' },
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data.data || []);
    } catch (_) {
      setError('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // CREATE / UPDATE
  // ----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await updateTag(editingTag._id, formData);
      } else {
        await createTag(formData);
      }

      fetchTags();
      resetForm();
    } catch (_) {
      setError('Failed to save tag');
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      active: tag.active,
      maxAttempts: tag.maxAttempts,
      intervalHours: tag.intervalHours,
      contactWindow: tag.contactWindow,
    });
    setShowForm(true);
  };

  // ----------------------
  // DELETE FLOW
  // ----------------------

  const handleDelete = (tag) => {
    setDeletingTag(tag);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTag(deletingTag._id);
      fetchTags();
    } catch (_) {
      setError('Failed to delete tag');
    } finally {
      setShowDeleteModal(false);
      setDeletingTag(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      active: true,
      maxAttempts: 3,
      intervalHours: 24,
      contactWindow: { start: '09:00', end: '17:00' },
    });

    setEditingTag(null);
    setShowForm(false);
  };

  return (
    <div>

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#2f1e14]">
            Tags
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage lead segmentation & retry logic
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(90deg, #814c27, #9b5b38)',
          }}
          className="
            flex items-center gap-2
            text-white
            px-6 py-2.5
            rounded-lg
            shadow-md
            hover:shadow-lg
            transition
            font-semibold
          "
        >
          + Add New Tag
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <table className="w-full">

            <thead>
              <tr
                style={{
                  background: 'linear-gradient(90deg, #2f1e14, #814c27)',
                }}
                className="text-white"
              >
                {[
                  'Name',
                  'Status',
                  'Max Attempts',
                  'Interval (hrs)',
                  'Contact Window',
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
              {tags.map((tag) => (
                <tr
                  key={tag._id}
                  className="hover:bg-[#f9f6f3] transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {tag.name}
                  </td>

                  <td className="px-6 py-4">
                    {tag.active ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {tag.maxAttempts}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {tag.intervalHours}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {tag.contactWindow?.start} – {tag.contactWindow?.end}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">

                      <Link
                        to={`/tags/${tag._id}`}
                        className="
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-[#f3ebe3]
                          text-[#814c27]
                          hover:bg-[#e8dccf]
                          transition
                        "
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleEdit(tag)}
                        className="
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-blue-50
                          text-blue-700
                          hover:bg-blue-100
                          transition
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(tag)}
                        className="
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-red-50
                          text-red-700
                          hover:bg-red-100
                          transition
                        "
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h3 className="text-xl font-bold mb-6 text-[#2f1e14]">
              {editingTag ? 'Edit Tag' : 'Add New Tag'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-[#814c27]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
                <span className="text-sm">Active</span>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm">Max Attempts</label>
                  <input
                    type="number"
                    value={formData.maxAttempts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAttempts: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm">Interval Hours</label>
                  <input
                    type="number"
                    value={formData.intervalHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        intervalHours: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm">Start</label>
                  <input
                    type="time"
                    value={formData.contactWindow.start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactWindow: {
                          ...formData.contactWindow,
                          start: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm">End</label>
                  <input
                    type="time"
                    value={formData.contactWindow.end}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactWindow: {
                          ...formData.contactWindow,
                          end: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#814c27] text-white hover:bg-[#9b5b38]"
                >
                  {editingTag ? 'Update' : 'Create'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingTag && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h3 className="text-xl font-bold text-[#2f1e14] mb-3">
              Delete Tag
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete
              <span className="font-semibold text-gray-900">
                {' '}“{deletingTag.name}”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingTag(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Tags;
