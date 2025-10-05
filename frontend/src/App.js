import React from 'react';
import {BrowserRouter,Routes,Route,Link,useNavigate} from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LecturerForm from './components/LecturerForm';
import ReportsList from './components/ReportsList';
import StudentDashboard from './components/StudentDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import PLDashboard from './components/PLDashboard';
import PRLDashboard from './components/PRLDashboard';

function AppContent(){
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const getDashboard=()=>{
    switch(role){
      case 'student': return <StudentDashboard/>;
      case 'lecturer': return <LecturerDashboard/>;
      case 'prl': return <PRLDashboard/>;
      case 'pl': return <PLDashboard/>;
      default: return <Dashboard/>;
    }
  };
  return(
    <div>
      {token && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/dashboard">
              <i className="bi bi-bar-chart-line-fill me-2"></i>
              LUCT Faculty Reporting
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                {role === 'lecturer' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/lecturer">Submit Report</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/reports">Reports</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <span className="navbar-text me-3">
                    Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); navigate('/'); }}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
      <div className="container-fluid py-4">
        <Routes>
          <Route path="/dashboard" element={getDashboard()}/>
          <Route path="/lecturer" element={<LecturerForm/>}/>
          <Route path="/reports" element={<ReportsList/>}/>
          <Route path="/" element={<Login/>}/>
        </Routes>
      </div>
    </div>
  );
}

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <AppContent/>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
