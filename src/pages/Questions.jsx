import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTags,
} from '../services/api';
import { toast } from 'react-toastify';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [showTranslationsModal, setShowTranslationsModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)


  const [formData, setFormData] = useState({
    question: {
      english: '',
      mandarin: '',
      spanish: '',
      cantonese: '',
      latin: '',
    },
    answerType: 'yes/no',
    required: true,
    active: true,
    tagId: '',
    order: 1,
  });

  useEffect(() => {
    const loadAll = async () => {
      try {
        setError(null);
        setLoading(true);

        const [qRes, tRes] = await Promise.all([
          getQuestions(),
          getTags(),
        ]);

        setQuestions(qRes.data.data || []);
        setTags(tRes.data.data || []);
      } catch (error) {
        console.error('Load questions/tags error:', error);

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
          'Failed to load data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // -------------------------
  // Helpers
  // -------------------------

  const getTagName = (tagValue) => {
    if (!tagValue) return 'Unknown';

    if (typeof tagValue === 'object') {
      return tagValue.name || 'Unknown';
    }

    const tag = tags.find((t) => t._id === tagValue);
    return tag ? tag.name : 'Unknown';
  };

  // -------------------------
  // CREATE / UPDATE
  // -------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, formData);
      } else {
        await createQuestion(formData);
      }

      const refreshed = await getQuestions();
      setQuestions(refreshed.data.data || []);

      setError(null);
      toast.success(
        editingQuestion
          ? 'Question updated successfully'
          : 'Question created successfully'
      );

      resetForm();
    } catch (error) {
      console.error('Save question error:', error);

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
        'Failed to save question'
      );
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);

    setFormData({
      question: {
        english: question.question?.english || '',
        mandarin: question.question?.mandarin || '',
        spanish: question.question?.spanish || '',
        cantonese: question.question?.cantonese || '',
        latin: question.question?.latin || '',
      },
      answerType: question.answerType,
      required: question.required,
      active: question.active,
      tagId:
        typeof question.tagId === 'object'
          ? question.tagId._id
          : question.tagId,
      order: question.order,
    });

    setShowForm(true);
  };

  // -------------------------
  // DELETE FLOW
  // -------------------------

  const handleDeleteClick = (question) => {
    setDeletingQuestion(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteQuestion(deletingQuestion._id);

      const refreshed = await getQuestions();
      setQuestions(refreshed.data.data || []);
      
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Delete question error:', error);

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
        'Failed to delete question'
      );

    }finally {
      setShowDeleteModal(false);
      setDeletingQuestion(null);
    }
  };

  const resetForm = () => {
    setFormData({
        question: {
        english: '',
        mandarin: '',
        spanish: '',
        cantonese: '',
        latin: '',
      },
      answerType: 'yes/no',
      required: true,
      active: true,
      tagId: '',
      order: 1,
    });

    setEditingQuestion(null);
    setShowForm(false);
  };

  // -------------------------
  // Render
  // -------------------------

  return (
    <div>

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#2f1e14]">
            Questions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure AI flow & lead qualification logic
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="
            flex items-center gap-2
            bg-[#814c27]
            hover:bg-[#9b5b38]
            text-white
            px-6 py-2.5
            rounded-lg
            shadow-md
            transition
            font-semibold
          "
        >
          + Add Question
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <table className="w-full">

            <thead>
              <tr className="bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white">
                {[
                  'Text',
                  'Answer Type',
                  'Tag',
                  'Order',
                  'Required',
                  'Active',
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
              {questions.map((question) => (
                <tr
                  key={question._id}
                  className="hover:bg-[#f9f6f3] transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {question.question?.english || '-'}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {question.answerType}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {getTagName(question.tagId)}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {question.order}
                  </td>

                  <td className="px-6 py-4">
                    {question.required ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
                        No
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {question.active ? (
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
                    <div className="flex items-center gap-3">

                      <Link
                        to={`/questions/${question._id}`}
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
                        onClick={() => {
                          setSelectedQuestion(question)
                          setShowTranslationsModal(true)
                        }}
                        className="
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-purple-50
                          text-purple-700
                          hover:bg-purple-100
                        "
                      >
                        Translations
                      </button>

                      <button
                        onClick={() => handleEdit(question)}
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
                        onClick={() => handleDeleteClick(question)}
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

          <div className="bg-white
            rounded-xl
            shadow-xl
            w-full
            max-w-4xl
            max-h-[90vh]
            overflow-hidden
            flex
            flex-col">

            <h3 className="text-xl font-bold mb-6 px-6 pt-6 text-[#2f1e14]">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>

            <form onSubmit={handleSubmit} id="question-form" className="flex-1 overflow-y-auto px-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Question (English)
                  </label>

                  <textarea
                    rows="2"
                    value={formData.question.english}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question: {
                          ...formData.question,
                          english: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {[
                    { key: 'mandarin', label: 'Mandarin' },
                    { key: 'spanish', label: 'Spanish' },
                    { key: 'cantonese', label: 'Cantonese' },
                    { key: 'latin', label: 'Latin' },
                  ].map((lang) => (
                    <div key={lang.key}>
                      <label className="text-sm font-medium">
                        Question ({lang.label})
                      </label>

                      <textarea
                        rows="2"
                        value={formData.question[lang.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            question: {
                              ...formData.question,
                              [lang.key]: e.target.value,
                            },
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Answer Type</label>
                    <select
                      value={formData.answerType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          answerType: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="yes/no">Yes / No</option>
                      <option value="text">Text</option>
                      <option value="numeric">Numeric</option>
                      <option value="scale">Scale</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tag</label>
                    <select
                      value={formData.tagId}
                      onChange={(e) =>
                        setFormData({ ...formData, tagId: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      required
                    >
                      <option value="">Select Tag</option>
                      {tags.map((tag) => (
                        <option key={tag._id} value={tag._id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
              </div>         

              <div>
                <label className="text-sm font-medium">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value, 10),
                    })
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        required: e.target.checked,
                      })
                    }
                  />
                  Required
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: e.target.checked,
                      })
                    }
                  />
                  Active
                </label>
              </div>           

            </form>
            <div className="border-t bg-white px-6 py-4 flex justify-end gap-3">

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
                  {editingQuestion ? 'Update' : 'Create'}
                </button>

            </div>
          </div>
        </div>
      )}

      {/* TRANSLATIONS MODAL */}
      {showTranslationsModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#2f1e14]">
                Question Translations
              </h3>

              <button
                onClick={() => {
                  setShowTranslationsModal(false)
                  setSelectedQuestion(null)
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">

              {[
                { key: 'english', label: 'English' },
                { key: 'mandarin', label: 'Mandarin' },
                { key: 'spanish', label: 'Spanish' },
                { key: 'cantonese', label: 'Cantonese' },
                { key: 'latin', label: 'Latin' },
              ].map((lang) => (
                <div key={lang.key}>
                  <p className="text-sm font-semibold text-gray-600">
                    {lang.label}
                  </p>

                  <div className="mt-1 rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                    {selectedQuestion.question?.[lang.key] || '—'}
                  </div>
                </div>
              ))}

            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowTranslationsModal(false)
                  setSelectedQuestion(null)
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h3 className="text-xl font-bold text-[#2f1e14] mb-3">
              Delete Question
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete
              <span className="font-semibold text-gray-900">
                {' '}“{deletingQuestion.question?.english?.slice(0,60)}...”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingQuestion(null);
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

export default Questions;
