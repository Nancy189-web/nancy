import React,{useState,useEffect} from 'react';
import LecturerForm from './LecturerForm';
import ReportsList from './ReportsList';

export default function LecturerDashboard(){
 const [classes,setClasses]=useState([]);
 const [courses,setCourses]=useState([]);
 const [notifications,setNotifications]=useState([]);
 const [ratings,setRatings]=useState([]);
 const [showModal,setShowModal]=useState(false);
 const [classForm,setClassForm]=useState({course_id:'',name:'',venue:'',scheduled_time:'',total_registered:0});
 async function loadClasses(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/classes',{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setClasses(await res.json());}
 }
 async function loadCourses(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/courses',{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setCourses(await res.json());}
 }
 async function loadNotifications(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/notifications',{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setNotifications(await res.json());}
 }
 async function loadRatings(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/ratings',{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setRatings(await res.json());}
 }
 useEffect(()=>{loadClasses(); loadCourses(); loadNotifications(); loadRatings();},[]);
 useEffect(()=>{
  if(notifications.some(n=>!n.is_read)){setShowModal(true);}
 },[notifications]);
 return(
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-warning text-white">
            <h4 className="card-title mb-0">Lecturer Dashboard</h4>
          </div>
          <div className="card-body">
            <p className="text-muted">Submit reports, view your reports, and view classes.</p>

            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Submit Lecture Report</h6>
                  </div>
                  <div className="card-body">
                    <LecturerForm/>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Add Class</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={async(e)=>{
                      e.preventDefault();
                      const token=localStorage.getItem('token');
                      const res=await fetch('/api/classes',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(classForm)});
                      if(res.ok){setClassForm({course_id:'',name:'',venue:'',scheduled_time:'',total_registered:0}); loadClasses();}
                    }}>
                      <select className="form-control mb-2" value={classForm.course_id} onChange={e=>setClassForm({...classForm,course_id:e.target.value})} required>
                        <option value="">Select Course</option>
                        {courses.map(c=><option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                      </select>
                      <input type="text" className="form-control mb-2" placeholder="Class Name" value={classForm.name} onChange={e=>setClassForm({...classForm,name:e.target.value})} required/>
                      <input type="text" className="form-control mb-2" placeholder="Venue" value={classForm.venue} onChange={e=>setClassForm({...classForm,venue:e.target.value})}/>
                      <input type="text" className="form-control mb-2" placeholder="Scheduled Time" value={classForm.scheduled_time} onChange={e=>setClassForm({...classForm,scheduled_time:e.target.value})}/>
                      <input type="number" className="form-control mb-2" placeholder="Total Registered" value={classForm.total_registered} onChange={e=>setClassForm({...classForm,total_registered:e.target.value})}/>
                      <button className="btn btn-primary">Add Class</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Your Classes</h6>
                  </div>
                  <div className="card-body">
                    {classes.map(c=><div key={c.id} className="border rounded p-2 mb-2 bg-light">
                      <strong>{c.name}</strong><br/>
                      <small className="text-muted">Venue: {c.venue} | Time: {c.scheduled_time} | Registered: {c.total_registered}</small>
                    </div>)}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Your Reports</h6>
                  </div>
                  <div className="card-body">
                    <ReportsList/>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Notifications</h6>
                  </div>
                  <div className="card-body">
                    {notifications.length === 0 ? <p>No notifications.</p> : notifications.map(n=><div key={n.id} className={`alert ${n.is_read ? 'alert-secondary' : 'alert-info'}`}>
                      {n.message} <small className="text-muted">{new Date(n.created_at).toLocaleString()}</small>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">My Ratings</h6>
                  </div>
                  <div className="card-body">
                    {ratings.length === 0 ? <p>No ratings yet.</p> : ratings.map(r=><div key={r.id} className="border rounded p-2 mb-2 bg-light">
                      <strong>Rating: {r.rating}/5</strong> by {r.user_name}<br/>
                      <small className="text-muted">{r.comment}</small><br/>
                      <small className="text-muted">{new Date(r.created_at).toLocaleString()}</small>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Notification Modal */}
    {showModal && (
      <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Notifications</h5>
              <button type="button" className="btn-close" onClick={()=>setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {notifications.filter(n=>!n.is_read).map(n=><div key={n.id} className="alert alert-info">
                {n.message}
              </div>)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
 );
}
