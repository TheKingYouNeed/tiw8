import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppToolbar from './components/AppToolbar';
import EventPanel from './components/EventPanel';
import EventsList from './components/EventsList';
import { isMobile } from 'react-device-detect';
import { setMobile, setEvents } from './store/slices/eventsSlice';
import { setNavigate } from './store/middleware/socketMiddleware';
import { io } from 'socket.io-client';

// Create a wrapper component to access the navigate function
const AppContent = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set the navigate function for the socket middleware
    setNavigate(navigate);
    
    // Check if fullscreen is supported and add a button to toggle it
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Connect to the server using the current hostname (works on both localhost and network)
    const serverUrl = `http://${window.location.hostname}:3000`;
    console.log('Connecting to server at:', serverUrl);
    const socket = io(serverUrl);
    socket.on('events', (events) => {
      store.dispatch(setEvents(events));
    });
    
    // Set mobile status
    store.dispatch(setMobile(isMobile));
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [navigate]);
  
  const handleFullscreenChange = () => {
    // You could dispatch an action here to update the state if needed
    console.log('Fullscreen changed:', !!document.fullscreenElement);
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <AppToolbar />
      <main className="container mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsList />} />
          {/* Mode participant */}
          <Route path="/participant/event/:eventId" element={<EventPanel isAdmin={false} />} />
          <Route path="/participant/event/:eventId/question/:questionId" element={<EventPanel isAdmin={false} />} />
          <Route path="/event/:eventId" element={<EventPanel isAdmin={false} />} />
          <Route path="/event/:eventId/question/:questionId" element={<EventPanel isAdmin={false} />} />
          {/* Mode administrateur */}
          <Route path="/admin/event/:eventId" element={<EventPanel isAdmin={true} />} />
          <Route path="/admin/event/:eventId/question/:questionId" element={<EventPanel isAdmin={true} />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>TIW8 - TP2 Q&A Application</p>
          {isMobile && (
            <button 
              onClick={toggleFullscreen}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Toggle Fullscreen
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
