import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Tags from './pages/Tags';
import TagDetails from './pages/TagDetails';
import Questions from './pages/Questions';
import QuestionDetails from './pages/QuestionDetails';
import QuestionsByTag from './pages/QuestionsByTag';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Calls from './pages/Calls';
import CallSessionDetails from './pages/CallSessionDetails';
import WebhookEvents from './pages/WebhookEvents';
import ResponsesLog from './pages/ResponsesLog';
import Agents from './pages/Agents';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tags" element={<Tags />} />
          <Route path='/agents' element={<Agents />} />
          <Route path="/tags/:id" element={<TagDetails />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/questions/by-tag/:tagId" element={<QuestionsByTag />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/calls/session/:id" element={<CallSessionDetails />} />
          <Route path="/webhooks" element={<WebhookEvents />} />
          <Route path="/responses" element={<ResponsesLog />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
