import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionsByTag } from '../services/api';
import { toast } from 'react-toastify';

const QuestionsByTag = () => {
  const { tagId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestionsByTag(tagId);
        setQuestions(response.data.data || []);
      } catch (error) {
        console.error('Fetch questions by tag error:', error);

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
          'Failed to fetch questions'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [tagId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Questions by Tag</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.map((question) => (
                <tr key={question._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{question.text}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{question.answerType}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{question.required ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{question.active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{question.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QuestionsByTag;