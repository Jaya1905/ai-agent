import { useState, useEffect } from 'react'
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getTags,
  importZohoLeads,
} from '../services/api'
import { toast } from 'react-toastify'


const Leads = () => {
  const [leads, setLeads] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [showZohoImport, setShowZohoImport] = useState(false)
  const [zohoLoading, setZohoLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingLead, setDeletingLead] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tagId: '',
  })

  useEffect(() => {
    fetchLeads()
    fetchTags()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }


  const fetchTags = async () => {
    try {
      const response = await getTags()
      setTags(response.data.data || [])
    } catch (error) {
      console.error('Fetch tags error:', error)

      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    }
  }

  const handleZohoImport = async () => {
    if (!formData.tagId) return

    try {
      setZohoLoading(true)

      await importZohoLeads({
        tagId: formData.tagId,
      })

      await fetchLeads()

      setShowZohoImport(false)

      setFormData((prev) => ({
        ...prev,
        tagId: '',
      }))
    } catch (error) {
        console.error('Zoho import error:', error)

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
            'Failed to import leads from Zoho'
        )
      } finally {
      setZohoLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingLead) {
        await updateLead(editingLead._id, formData)
      } else {
        await createLead(formData)
      }

      fetchLeads()
      toast.success(
        editingLead
          ? 'Lead updated successfully'
          : 'Lead created successfully'
      )

      resetForm()
    } catch (error) {
        console.error('Save lead error:', error)

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
            'Failed to save lead'
        )
      }
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)

    setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      tagId: typeof lead.tagId === 'object' ? lead.tagId._id : lead.tagId || '',
    })

    setShowForm(true)
  }

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this lead?')) return

  //   try {
  //     await deleteLead(id)
  //     fetchLeads()
  //     toast.success('Lead deleted successfully')
  //   } catch (error) {
  //       console.error('Delete lead error:', error)

  //       if (error.response) {
  //         console.log(error.response.data)
  //         console.log(error.response.status)
  //       } else if (error.request) {
  //         console.log(error.request)
  //       } else {
  //         console.log('Error', error.message)
  //       }

  //       toast.error(
  //         error.response?.data?.error ||
  //           error.response?.data?.message ||
  //           'Failed to delete lead'
  //       )
  //     }
  // }

  const handleDeleteClick = (lead) => {
    setDeletingLead(lead)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteLead(deletingLead._id)

      await fetchLeads()

      toast.success('Lead deleted successfully')
    } catch (error) {
      console.error('Delete lead error:', error)

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to delete lead'
      )
    } finally {
      setShowDeleteModal(false)
      setDeletingLead(null)
    }
  }



  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      tagId: '',
    })

    setEditingLead(null)
    setShowForm(false)
  }

  const getTagName = (tagValue) => {
    if (!tagValue) return 'Unknown'

    if (typeof tagValue === 'object') {
      return tagValue.name || 'Unknown'
    }

    const tag = tags.find((t) => t._id === tagValue)
    return tag ? tag.name : 'Unknown'
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className='flex justify-between items-center mb-10'>
        <div>
          <h1 className='text-3xl font-bold text-[#2f1e14]'>Leads</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage captured prospects & qualification status
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {/* Add Lead */}
          <button
            onClick={() => setShowForm(true)}
            className='
            flex items-center gap-2
            bg-[#814c27]
            hover:bg-[#9b5b38]
            text-white
            px-6 py-2.5
            rounded-lg
            shadow-md
            transition
            font-semibold
          '
          >
            + Add Lead
          </button>

          <button
            onClick={() => setShowZohoImport(true)}
            className='
            flex items-center gap-2
            bg-green-600
            hover:bg-green-700
            text-white
            px-6 py-2.5
            rounded-lg
            shadow-md
            transition
            font-semibold
          '
          >
            Import From Zoho
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        {loading ? (
          <div className='p-6 text-gray-500'>Loading...</div>
        ) : (
          <table className='w-full'>
            {/* HEADER */}
            <thead>
              <tr className='bg-gradient-to-r from-[#2f1e14] to-[#814c27] text-white'>
                {[
                  'Name',
                  'Phone',
                  'Email',
                  'Tag',
                  'Status',
                  'Created',
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

            {/* BODY */}
            <tbody className='divide-y divide-gray-100'>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className='hover:bg-[#f9f6f3] transition'
                >
                  <td className='px-6 py-4 font-medium'>{lead.name}</td>

                  <td className='px-6 py-4 text-sm'>{lead.phone}</td>

                  <td className='px-6 py-4 text-sm'>{lead.email}</td>

                  <td className='px-6 py-4 text-sm'>
                    {getTagName(lead.tagId)}
                  </td>

                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-semibold'>
                      {lead.status || 'new'}
                    </span>
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    <div className='flex items-center gap-3'>
                      <button
                        onClick={() => handleEdit(lead)}
                        className='
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-blue-50
                          text-blue-700
                          hover:bg-blue-100
                          transition
                        '
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(lead)}
                        className='
                          px-3 py-1.5
                          rounded-md
                          text-xs
                          font-semibold
                          bg-red-50
                          text-red-700
                          hover:bg-red-100
                          transition
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
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <div>
                <label className='text-sm font-medium'>Name</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border px-3 py-2'
                  required
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Phone</label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border px-3 py-2'
                  required
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Email</label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border px-3 py-2'
                  required
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Tag</label>
                <select
                  value={formData.tagId}
                  onChange={(e) =>
                    setFormData({ ...formData, tagId: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border px-3 py-2'
                  required
                >
                  <option value=''>Select Tag</option>
                  {tags.map((tag) => (
                    <option
                      key={tag._id}
                      value={tag._id}
                    >
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={resetForm}
                  className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  className='px-5 py-2 rounded-lg bg-[#814c27] text-white hover:bg-[#9b5b38]'
                >
                  {editingLead ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showZohoImport && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-6'>
            <h3 className='text-xl font-bold mb-6 text-[#2f1e14]'>
              Import Leads From Zoho
            </h3>

            <div className='mb-6'>
              <label className='text-sm font-medium'>Tag</label>

              <select
                value={formData.tagId}
                onChange={(e) =>
                  setFormData({ ...formData, tagId: e.target.value })
                }
                className='mt-1 w-full rounded-lg border px-3 py-2'
                required
              >
                <option value=''>Select Tag</option>
                {tags.map((tag) => (
                  <option
                    key={tag._id}
                    value={tag._id}
                  >
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowZohoImport(false)}
                className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200'
              >
                Cancel
              </button>

              <button
                onClick={handleZohoImport}
                disabled={zohoLoading || !formData.tagId}
                className='px-5 py-2 rounded-lg bg-[#814c27] text-white hover:bg-[#9b5b38] disabled:opacity-60'
              >
                {zohoLoading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h3 className="text-xl font-bold text-[#2f1e14] mb-3">
              Delete Lead
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete
              <span className="font-semibold text-gray-900">
                {' '}“{deletingLead.name}”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingLead(null)
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
  )
}

export default Leads
