import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getLeads,
  startCall,
  getLeadCallSessions,
  endCall,
  resetAttempts,
  getAgents,
} from '../services/api'
import { toast } from 'react-toastify'

const Calls = () => {
  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [callSessions, setCallSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState([])
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [callingLeadId, setCallingLeadId] = useState(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resettingLead, setResettingLead] = useState(null)
  const [showEndCallModal, setShowEndCallModal] = useState(false)
  const [endingSession, setEndingSession] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {

      const response = await getLeads()
      setLeads(response.data.data || [])
    } catch (error) {
      console.error('Fetch leads error:', error)

      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to fetch leads'
      )
    }
  }


  // const handleStartCall = async (leadId) => {
  //   setLoading(true)
  //   try {
  //     await startCall(leadId)

  //     if (selectedLead === leadId) {
  //       fetchCallSessions(leadId)
  //     }

  //     alert('Call started successfully!')
  //   } catch (ex) {
  //     console.log(ex)
  //     setError(ex?.response?.data?.error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchCallSessions = async (leadId) => {
    setLoading(true)
    try {
      const response = await getLeadCallSessions(leadId)
      setCallSessions(response.data.data || [])
      setSelectedLead(leadId)
    } catch (error) {
        console.error('Fetch call sessions error:', error)

        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }

        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to fetch call sessions'
        )
      } finally {
      setLoading(false)
    }
  }

  const confirmEndCall = async () => {
    try {
      await endCall(endingSession._id)

      toast.success('Call ended successfully')

      if (selectedLead) {
        fetchCallSessions(selectedLead)
      }
    } catch (error) {
      console.error('End call error:', error)

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to end call'
      )
    } finally {
      setShowEndCallModal(false)
      setEndingSession(null)
    }
  }

  const confirmResetAttempts = async () => {
    try {
      await resetAttempts(resettingLead._id)

      toast.success('Attempts reset successfully')

      await fetchLeads()

      if (selectedLead) {
        fetchCallSessions(selectedLead)
      }
    } catch (error) {
      console.error('Reset attempts error:', error)

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to reset attempts'
      )
    } finally {
      setShowResetModal(false)
      setResettingLead(null)
    }
  }

  const getLeadName = (leadId) => {
    const lead = leads.find((l) => l._id === leadId)
    return lead ? lead.name : 'Unknown'
  }

  const fetchAgents = async () => {
    try {
      const res = await getAgents()
      setAgents(res.data.data || [])
    } catch (error) {
        console.error('Fetch agents error:', error)

        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }

        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to fetch agents'
        )
      }
  }

  const handleAgentCall = async (agentId) => {
    setLoading(true)

    try {
      await startCall(callingLeadId, {
        agentId,
      })

      toast.success('Call started successfully')
      setShowAgentModal(false)
    } catch (error) {
      console.error('Start agent call error:', error)

      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to start call'

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className='flex justify-between items-center mb-10'>
        <div>
          <h1 className='text-3xl font-bold text-[#2f1e14]'>Calls</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Start outbound calls & monitor sessions
          </p>
        </div>
      </div>

      {/* ---------------- LEADS TABLE ---------------- */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-12'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white'>
              {['Name', 'Phone', 'Email', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className='px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-100'>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className='hover:bg-[#f9f6f3] transition'
              >
                <td className='px-6 py-4 font-medium'>{lead.name}</td>

                <td className='px-6 py-4 text-sm'>{lead.phone}</td>

                <td className='px-6 py-4 text-sm'>{lead.email}</td>

                <td className='px-6 py-4'>
                  <span className='px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold'>
                    {lead.status || 'new'}
                  </span>
                </td>

                <td className='px-6 py-4'>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => {
                        setCallingLeadId(lead._id)
                        fetchAgents()
                        setShowAgentModal(true)
                      }}
                      disabled={loading}
                      className='px-3 py-1.5 rounded-md text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100'
                    >
                      Start Call
                    </button>

                    <button
                      onClick={() => fetchCallSessions(lead._id)}
                      className='px-3 py-1.5 rounded-md text-xs font-semibold bg-[#f3ebe3] text-[#814c27] hover:bg-[#e8dccf]'
                    >
                      View Sessions
                    </button>

                    <button
                      onClick={() => {
                        setResettingLead(lead)
                        setShowResetModal(true)
                      }}
                      className='px-3 py-1.5 rounded-md text-xs font-semibold bg-[#f3ebe3] text-[#814c27] hover:bg-[#e8dccf]'
                    >
                      Reset Attempts
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!leads.length && (
          <div className='p-6 text-gray-500'>No leads found.</div>
        )}
      </div>

      {/* ---------------- CALL SESSIONS TABLE ---------------- */}
      {selectedLead && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='px-6 py-4 border-b font-semibold text-[#2f1e14]'>
            Call Sessions for {getLeadName(selectedLead)}
          </div>

          <table className='w-full'>
            <thead>
              <tr className='bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white'>
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
                    className='px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {callSessions.map((session) => (
                <tr
                  key={session._id}
                  className='hover:bg-[#f9f6f3]'
                >
                  <td className='px-6 py-4 text-xs font-mono'>{session._id}</td>

                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold'>
                      {session.status}
                    </span>
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    {new Date(session.createdAt).toLocaleString()}
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    {session.endedAt
                      ? new Date(session.endedAt).toLocaleString()
                      : '—'}
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    {session.duration || '—'}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex gap-3'>
                      <Link
                        to={`/calls/session/${session._id}`}
                        className='px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100'
                      >
                        View
                      </Link>

                      {session.status === 'active' && (
                        <button
                          onClick={() => {
                            setEndingSession(session)
                            setShowEndCallModal(true)
                          }}
                          className='px-3 py-1.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100'
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
            <div className='p-6 text-gray-500'>No call sessions found.</div>
          )}
        </div>
      )}

      {showAgentModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-lg p-6'>
            <h3 className='text-xl font-bold mb-6 text-[#2f1e14]'>
              Select Agent to Call
            </h3>

            <div className='space-y-3 max-h-[400px] overflow-y-auto'>
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className='flex justify-between items-center border rounded-lg px-4 py-3'
                >
                  <div>
                    <div className='font-semibold'>{agent.agentName}</div>
                    <div className='text-sm text-gray-500'>
                      {agent.phoneNumber}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAgentCall(agent._id)}
                    disabled={loading || !agent.isActive}
                    className='px-4 py-2 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                  >
                    Call
                  </button>
                </div>
              ))}

              {!agents.length && (
                <div className='text-gray-500 text-sm'>No agents found.</div>
              )}
            </div>

            <div className='flex justify-end pt-6'>
              <button
                onClick={() => setShowAgentModal(false)}
                className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && resettingLead && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-6'>

            <h3 className='text-xl font-bold text-[#2f1e14] mb-3'>
              Reset Attempts
            </h3>

            <p className='text-sm text-gray-600 mb-6'>
              Are you sure you want to reset attempts for
              <span className='font-semibold text-gray-900'>
                {' '}“{resettingLead.name}”
              </span>
              ?
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setShowResetModal(false)
                  setResettingLead(null)
                }}
                className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200'
              >
                Cancel
              </button>

              <button
                onClick={confirmResetAttempts}
                className='px-5 py-2 rounded-lg bg-[#814c27] text-white hover:bg-[#9b5b38]'
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndCallModal && endingSession && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-6'>

            <h3 className='text-xl font-bold text-[#2f1e14] mb-3'>
              End Call
            </h3>

            <p className='text-sm text-gray-600 mb-6'>
              End this active call session?
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setShowEndCallModal(false)
                  setEndingSession(null)
                }}
                className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200'
              >
                Cancel
              </button>

              <button
                onClick={confirmEndCall}
                className='px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700'
              >
                End Call
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Calls
