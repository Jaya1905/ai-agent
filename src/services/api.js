import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Health Check
export const getHealth = () => api.get('/api/health')

// Tags
export const getTags = (params) => api.get('/api/tags', { params })
export const getTagById = (id) => api.get(`/api/tags/${id}`)
export const createTag = (data) => api.post('/api/tags', data)
export const updateTag = (id, data) => api.put(`/api/tags/${id}`, data)
export const deleteTag = (id) => api.delete(`/api/tags/${id}`)

// Questions
export const getQuestions = (params) => api.get('/api/questions', { params })
export const getQuestionsByTag = (tagId) =>
  api.get(`/api/questions/by-tag/${tagId}`)
export const getQuestionById = (id) => api.get(`/api/questions/${id}`)
export const createQuestion = (data) => api.post('/api/questions', data)
export const updateQuestion = (id, data) =>
  api.put(`/api/questions/${id}`, data)
export const deleteQuestion = (id) => api.delete(`/api/questions/${id}`)

// Leads
export const getLeads = (params) => api.get('/api/leads', { params })
export const getLeadById = (id) => api.get(`/api/leads/${id}`)
export const createLead = (data) => api.post('/api/leads', data)
export const updateLead = (id, data) => api.put(`/api/leads/${id}`, data)
export const deleteLead = (id) => api.delete(`/api/leads/${id}`)

//Zoho import
export const importZohoLeads = (data) =>  api.post('/api/leads/import-zoho', data);

// Calls
export const startCall = (leadId) => api.post(`/api/calls/start/${leadId}`)
export const getCallSession = (sessionId) =>
  api.get(`/api/calls/session/${sessionId}`)
export const getLeadCallSessions = (leadId, params) =>
  api.get(`/api/calls/lead/${leadId}`, { params })
export const endCall = (sessionId) => api.post(`/api/calls/end/${sessionId}`)
export const resetAttempts = (leadId) =>
  api.patch(`/api/leads/${leadId}/reset-attempts`)

// Agents
export const getAgents = (params) => api.get('/api/agents', { params })
export const createAgent = (data) => api.post('/api/agents', data)
export const updateAgent = (id, data) => api.put(`/api/agents/${id}`, data)
export const deleteAgent = (id) => api.delete(`/api/agents/${id}`)




export default api
