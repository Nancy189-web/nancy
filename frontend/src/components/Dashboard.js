import React from 'react';
import StudentDashboard from './StudentDashboard';
import LecturerDashboard from './LecturerDashboard';
import PLDashboard from './PLDashboard';
import PRLDashboard from './PRLDashboard';

export default function Dashboard(){
  const role = localStorage.getItem('role');
  switch(role){
    case 'student': return <StudentDashboard/>;
    case 'lecturer': return <LecturerDashboard/>;
    case 'prl': return <PRLDashboard/>;
    case 'pl': return <PLDashboard/>;
    default: return <div>Please login</div>;
  }
}
