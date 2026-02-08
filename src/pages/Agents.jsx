import { useEffect, useState } from 'react'
import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../services/api'

const Agents = () => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAgent, setDeletingAgent] = useState(null)

  const [formData, setFormData] = useState({
    agentName: '',
    phoneNumber: '',
    code: '',
    phoneNumberId: '',
    agentId: '',
    isActive: true,
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await getAgents()
      setAgents(res.data.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (editingAgent) {
        await updateAgent(editingAgent._id, formData)
      } else {
        await createAgent(formData)
      }

      await fetchAgents()
      resetForm()
    } catch (error) {
      console.error(`error = `, error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      setError(error.response?.data?.error)
    }
  }

  const handleEdit = (agent) => {
    setEditingAgent(agent)

    setFormData({
      agentName: agent.agentName || '',
      phoneNumber: agent.phoneNumber || '',
      code: agent.code || '',
      phoneNumberId: agent.phoneNumberId || '',
      agentId: agent.agentId || '',
      isActive: agent.isActive ?? true,
    })

    setShowForm(true)
  }

  const handleDeleteClick = (agent) => {
    setDeletingAgent(agent)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteAgent(deletingAgent._id)
      await fetchAgents()
    } catch (err) {
      console.error(err)
      setError('Failed to delete agent')
    } finally {
      setShowDeleteModal(false)
      setDeletingAgent(null)
    }
  }

  const resetForm = () => {
    setFormData({
      agentName: '',
      phoneNumber: '',
      code: '',
      phoneNumberId: '',
      agentId: '',
      isActive: true,
    })

    setEditingAgent(null)
    setShowForm(false)
  }

  return (
    <div>
      {/* HEADER */}
      <div className='flex justify-between items-center mb-10'>
        <div>
          <h1 className='text-3xl font-bold text-[#2f1e14]'>Agents</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage AI calling agents & phone mappings
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className='
            bg-[#814c27]
            hover:bg-[#9b5b38]
            text-white
            px-6 py-2.5
            rounded-lg
            shadow-md
            font-semibold
          '
        >
          + Add Agent
        </button>
      </div>

      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        {loading ? (
          <div className='p-6 text-gray-500'>Loading...</div>
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white'>
                {['Agent Name', 'Phone', 'Status', 'Created', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className='px-6 py-4 text-left text-xs uppercase font-semibold'
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {agents.map((agent) => (
                <tr
                  key={agent._id}
                  className='hover:bg-[#f9f6f3] transition'
                >
                  <td className='px-6 py-4 font-medium'>{agent.agentName}</td>

                  <td className='px-6 py-4'>{agent.phoneNumber}</td>

                  <td className='px-6 py-4'>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        agent.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    <div className='flex items-center gap-3'>
                      <button
                        onClick={() => handleEdit(agent)}
                        className='
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-blue-50
                          text-blue-700
                          hover:bg-blue-100
                        '
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(agent)}
                        className='
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-red-50
                          text-red-700
                          hover:bg-red-100
                        '
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

      {/* MODAL */}
      {showForm && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-6'>
            <h3 className='text-xl font-bold mb-6 text-[#2f1e14]'>
              {editingAgent ? 'Edit Agent' : 'Add Agent'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              {[
                { label: 'Agent Name', key: 'agentName' },
                { label: 'Phone Number', key: 'phoneNumber' },
                { label: 'Code', key: 'code' },
                { label: 'PhoneNumberId', key: 'phoneNumberId' },
                { label: 'AgentId', key: 'agentId' },
              ].map((field) => (
                <div key={field.key}>
                  <label className='text-sm font-medium'>{field.label}</label>

                  <input
                    type='text'
                    value={formData[field.key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: e.target.value,
                      })
                    }
                    className='mt-1 w-full rounded-lg border px-3 py-2'
                    required
                  />
                </div>
              ))}

              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.checked,
                    })
                  }
                />
                <span className='text-sm font-medium'>Active Agent</span>
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={resetForm}
                  className='px-4 py-2 rounded-lg bg-gray-100'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  className='px-5 py-2 rounded-lg bg-[#814c27] text-white'
                >
                  {editingAgent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingAgent && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-6'>
            <h3 className='text-xl font-bold text-[#2f1e14] mb-3'>
              Delete Agent
            </h3>

            <p className='text-sm text-gray-600 mb-6'>
              Are you sure you want to delete
              <span className='font-semibold text-gray-900'>
                {' '}
                “{deletingAgent.agentName}”
              </span>
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingAgent(null)
                }}
                className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200'
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className='px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agents
