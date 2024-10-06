import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// styles
import './App.css';

// pages & components
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Project from './pages/project/Project'

// components
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import AllUsers from './components/AllUsers';
import CompletedProjects from './pages/completed/CompletedProjects';

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route index element={user ? <Dashboard /> : <Navigate to="/login" replace={true} />} />
              <Route path='create' element={user ? <Create /> : <Navigate to="/login" replace={true} />} />
              <Route path='projects/completed' element={user ? <CompletedProjects /> : <Navigate to="/login" replace={true} />} />
              <Route path='projects/:id' element={user ? <Project /> : <Navigate to="/login" replace={true} />} />
              <Route path="login" element={!user ? <Login /> : <Navigate to="/" replace={true} />} />
              <Route path="signup" element={!user ? <Signup /> : <Navigate to="/" replace={true} />} />
            </Routes>
          </div>
          {user && <AllUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
