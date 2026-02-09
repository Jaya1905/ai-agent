import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestionById } from '../services/api';
import { toast } from 'react-toastify';

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionById(id);
        setQuestion(response.data.data);
      } catch (error) {
          console.error('Fetch question error:', error);

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
            'Failed to fetch question details'
          );
        } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (!question) return <p className="p-8">Question not found</p>;

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2f1e14]">
            Question Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View full configuration for this AI flow question
          </p>
        </div>

        <Link
          to="/questions"
          className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium"
        >
          ← Back to Questions
        </Link>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl shadow-lg p-8">

        {/* QUESTION TEXT */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-600 uppercase tracking-wide">
            Question Text
          </h3>

          <div className="mt-3 p-5 rounded-lg bg-[#f9f6f3] border border-[#e7ded6] text-lg font-medium">
            {question.text}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Answer Type */}
          <InfoCard label="Answer Type" value={question.answerType} />

          {/* Order */}
          <InfoCard label="Order" value={question.order} />

          {/* Tag */}
          <InfoCard
            label="Tag"
            value={
              typeof question.tagId === 'object'
                ? question.tagId.name
                : question.tagId
            }
          />

          {/* Required */}
          <StatusCard
            label="Required"
            active={question.required}
          />

          {/* Active */}
          <StatusCard
            label="Active"
            active={question.active}
          />

        </div>
      </div>

    </div>
  );
};

/* -------------------------
   Small UI Helpers
-------------------------- */

const InfoCard = ({ label, value }) => (
  <div className="rounded-lg border p-5 bg-white">
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
      {label}
    </p>
    <p className="font-semibold text-gray-900">
      {value}
    </p>
  </div>
);

const StatusCard = ({ label, active }) => (
  <div className="rounded-lg border p-5 bg-white">
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
      {label}
    </p>

    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        active
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {active ? 'Yes' : 'No'}
    </span>
  </div>
);

export default QuestionDetails;
