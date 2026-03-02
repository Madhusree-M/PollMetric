import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import PollView from "./pages/PollView";
import ReportView from "./pages/ReportView";
import PendingPolls from "./pages/PendingPolls";
import RespondedPolls from "./pages/RespondedPolls";
import { useTheme } from './context/ThemeContext';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-[#f8fafc]' : 'bg-[#030712]'}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={theme === 'light' ? 'light' : 'dark'}
      />
      <BrowserRouter>
        <Navbar />
        <main style={{ paddingTop: '100px', paddingBottom: '40px' }} className="px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/pending" element={<PendingPolls />} />
            <Route path="/responded" element={<RespondedPolls />} />
            <Route path="/poll/:id" element={<PollView />} />
            <Route path="/report/:id" element={<ReportView />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App
