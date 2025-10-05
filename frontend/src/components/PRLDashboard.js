import React,{useState,useEffect} from 'react';
import ReportsList from './ReportsList';
import StudentMonitoring from './StudentMonitoring';
import Rating from './Rating';
import { API_BASE } from '../config';

export default function PRLDashboard(){
 const [courses,setCourses]=useState([]);
 const [reports,setReports]=useState([]);
 const [q,setQ]=useState('');
 const [feedbacks,setFeedbacks]=useState({});
 const [classes,setClasses]=useState([]);
 async function loadCourses(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/courses?q=`+encodeURIComponent(q),{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setCourses(await res.json());}
 }
 async function loadReports(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/reports`,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setReports(await res.json());}
 }
 async function loadClasses(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/classes`,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setClasses(await res.json());}
 }
 useEffect(()=>{loadCourses();loadReports();loadClasses();},[]);
 function search(e){e.preventDefault();loadCourses();}
 async function addFeedback(reportId){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/reports/`+reportId+'/feedback',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({feedback:feedbacks[reportId]})});
  if(res.ok){loadReports();setFeedbacks({...feedbacks,[reportId]:''});}
 }
 return(
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-info text-white">
            <h4 className="card-title mb-0">Principal Lecturer Dashboard</h4>
          </div>
          <div className="card-body">
            <p className="text-muted">View courses under your stream, reports, and add feedback.</p>
            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Search Courses</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={search} className="d-flex">
                      <input className="form-control me-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Courses"/>
                      <button className="btn btn-outline-info">Search</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Courses</h6>
                  </div>
                  <div className="card-body">
                    {courses.map(c=><div key={c.id} className="border rounded p-2 mb-2 bg-light">
                      {c.name} ({c.code}) - {c.stream}
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Reports</h6>
                  </div>
                  <div className="card-body">
                    {reports.map(r=>(
                      <div key={r.id} className="border rounded p-3 mb-3 bg-white">
                        <strong>{r.course_name} ({r.course_code}) - {r.lecturer_name}</strong><br/>
                        <small className="text-muted">Date: {r.lecture_date}, Topic: {r.topic_taught}</small><br/>
                        <strong>PRL Feedback:</strong> {r.prl_feedback || 'None'}
                        <div className="mt-2">
                          <textarea className="form-control" placeholder="Add Feedback" value={feedbacks[r.id]||''} onChange={e=>setFeedbacks({...feedbacks,[r.id]:e.target.value})}/>
                          <button className="btn btn-success mt-2" onClick={()=>addFeedback(r.id)}>Add Feedback</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Monitoring</h6>
                  </div>
                  <div className="card-body">
                    <StudentMonitoring />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Rating</h6>
                  </div>
                  <div className="card-body">
                    <Rating />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Classes</h6>
                  </div>
                  <div className="card-body">
                    {classes.map(c=><div key={c.id} className="border rounded p-2 mb-2 bg-light">
                      <strong>{c.name}</strong> - {c.venue} at {c.scheduled_time}
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 );
}
