import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventRequests from './pages/EventRequests';
import ApprovalDashboard from './pages/ApprovalDashboard';
import VenueOccupancy from './pages/VenueOccupancy';
import ResourceManagement from './pages/ResourceManagement';
import AuditLogs from './pages/AuditLogs';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AnimatePresence, motion } from 'framer-motion';

const AppContent = () => {
  const { user, loading, toasts } = useApp();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading && !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-deep">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-deep relative">
      {/* Toast Overlay */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-6 py-4 rounded-2xl glass border-primary/20 backdrop-blur-xl shadow-2xl flex items-center gap-4 pointer-events-auto min-w-[300px] border-l-4 ${toast.type === 'success' ? 'border-l-success' :
                toast.type === 'error' ? 'border-l-danger' : 'border-l-primary'
                }`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-success' :
                toast.type === 'error' ? 'bg-danger' : 'bg-primary'
                }`} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">{toast.type}</p>
                <p className="text-sm font-bold">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mesh-container">
        <div className="mesh-orb mesh-orb-1"></div>
        <div className="mesh-orb mesh-orb-2"></div>
        <div className="mesh-orb mesh-orb-3"></div>
        <motion.div
          className="fixed w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-[-1]"
          animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
          transition={{ type: 'spring', damping: 30, stiffness: 50, mass: 0.8 }}
        />
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/requests" element={<PageWrapper><EventRequests /></PageWrapper>} />
              <Route path="/approvals" element={<PageWrapper><ApprovalDashboard /></PageWrapper>} />
              <Route path="/venues" element={<PageWrapper><VenueOccupancy /></PageWrapper>} />
              <Route path="/resources" element={<PageWrapper><ResourceManagement /></PageWrapper>} />
              <Route path="/audit" element={<PageWrapper><AuditLogs /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
