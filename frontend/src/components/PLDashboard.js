import React,{useState,useEffect} from 'react';
import ReportsList from './ReportsList';
import StudentMonitoring from './StudentMonitoring';
import Rating from './Rating';
import { API_BASE } from '../config';

export default function PLDashboard(){
 const [courses,setCourses]=useState([]);
 const [lecturers,setLecturers]=useState([]);
 const [classes,setClasses]=useState([]);
 const [lectures,setLectures]=useState([]);
 const [q,setQ]=useState('');
 const [newCourse,setNewCourse]=useState({faculty_id:1,name:'',code:'',stream:''});
 async function loadCourses(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/courses?q=`+encodeURIComponent(q),{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setCourses(await res.json());}
 }
 async function loadLecturers(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/users?role=lecturer`,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setLecturers(await res.json());}
 }
 async function loadClasses(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/classes`,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setClasses(await res.json());}
 }
 async function loadLectures(){
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/reports`,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setLectures(await res.json());}
 }
 useEffect(()=>{loadCourses();loadLecturers();loadClasses();loadLectures();},[]);
 function search(e){e.preventDefault();loadCourses();}
 async function addCourse(e){
  e.preventDefault();
  const token=localStorage.getItem('token');
  const res=await fetch(`${API_BASE}/api/courses`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(newCourse)});
  if(res.ok){loadCourses();setNewCourse({faculty_id:1,name:'',code:'',stream:''});}
 }
 async function assignLecturer(courseId,lecturerId){
  const token=localStorage.getItem('token');
  await fetch(`${API_BASE}/api/courses/`+courseId,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({lecturer_id:lecturerId})});
  loadCourses();
 }
 return(
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="card-title mb-0">Program Leader Dashboard</h4>
          </div>
          <div className="card-body">
            <p className="text-muted">Manage courses, assign lecturers, view reports.</p>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Add Course</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={addCourse}>
                      <div className="mb-2">
                        <input className="form-control" placeholder="Name" value={newCourse.name} onChange={e=>setNewCourse({...newCourse,name:e.target.value})}/>
                      </div>
                      <div className="mb-2">
                        <input className="form-control" placeholder="Code" value={newCourse.code} onChange={e=>setNewCourse({...newCourse,code:e.target.value})}/>
                      </div>
                      <div className="mb-2">
                        <input className="form-control" placeholder="Stream" value={newCourse.stream} onChange={e=>setNewCourse({...newCourse,stream:e.target.value})}/>
                      </div>
                      <button className="btn btn-success">Add Course</button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Search Courses</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={search} className="d-flex">
                      <input className="form-control me-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Courses"/>
                      <button className="btn btn-outline-primary">Search</button>
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
                    {courses.map(c=><div key={c.id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-light">
                      <span>{c.name} ({c.code}) - {c.stream}</span>
                      <select onChange={e=>assignLecturer(c.id,e.target.value)} className="form-select w-auto">
                        <option>Assign Lecturer</option>
                        {lecturers.map(l=><option key={l.id} value={l.id}>{l.full_name}</option>)}
                      </select>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Classes</h6>
                  </div>
                  <div className="card-body">
                    {classes.map(c=><div key={c.id} className="border rounded p-2 mb-2">
                      {c.name} - Course ID: {c.course_id}
                    </div>)}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Recent Lectures</h6>
                  </div>
                  <div className="card-body">
                    {lectures.slice(0,10).map(l=><div key={l.id} className="border rounded p-2 mb-2">
                      <strong>{l.topic_taught}</strong><br/>
                      <small className="text-muted">by {l.lecturer_name} on {l.lecture_date}</small>
                    </div>)}
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
                    <h6 className="mb-0">Reports</h6>
                  </div>
                  <div className="card-body">
                    <ReportsList/>
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
