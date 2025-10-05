import React,{useState,useEffect} from 'react';
import { useAuth } from '../AuthContext';
export default function LecturerForm(){
 const { full_name } = useAuth();
 const [form,setForm]=useState({faculty_id:'',course_id:'',class_id:'',lecturer_name:'',week_of_reporting:'',lecture_date:'',topic_taught:'',learning_outcomes:'',recommendations:'',actual_students_present:0,venue:'',scheduled_time:''});
 const [faculties,setFaculties]=useState([]);
 const [courses,setCourses]=useState([]);
 const [classes,setClasses]=useState([]);
 const [selectedClass,setSelectedClass]=useState(null);
 const [message,setMessage]=useState('');
 function update(e){setForm({...form,[e.target.name]:e.target.value})}
 async function loadFaculties(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/faculties',{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setFaculties(await res.json());}
 }
 async function loadCourses(facultyId){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/courses?faculty_id='+facultyId,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setCourses(await res.json());}
 }
 async function loadClasses(courseId){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/classes?course_id='+courseId,{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setClasses(await res.json());}
 }
 useEffect(()=>{loadFaculties();},[]);
 useEffect(() => {
  if (full_name) {
   setForm(prev => ({ ...prev, lecturer_name: full_name }));
  }
 }, [full_name]);
 function onFacultyChange(e){
  const fid=e.target.value;
  setForm({...form,faculty_id:fid,course_id:'',class_id:''});
  loadCourses(fid);
 }
 function onCourseChange(e){
  const cid=e.target.value;
  setForm({...form,course_id:cid,class_id:'',venue:'',scheduled_time:''});
  setSelectedClass(null);
  loadClasses(cid);
 }
 async function submit(e){
  e.preventDefault();
  const token=localStorage.getItem('token');
  const res=await fetch('/api/reports',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(form)});
  if(res.ok){setMessage('Report submitted');}else setMessage('Error');}
 return(
  <form onSubmit={submit}>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Faculty</label>
        <select className="form-select" name="faculty_id" value={form.faculty_id} onChange={onFacultyChange}>
          <option value="">Select Faculty</option>
          {faculties.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Course</label>
        <select className="form-select" name="course_id" value={form.course_id} onChange={onCourseChange} disabled={!form.faculty_id} required>
          <option value="">Select Course</option>
          {courses.map(c=><option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
        </select>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Class</label>
        <select className="form-select" name="class_id" value={form.class_id} onChange={(e)=>{
          update(e);
          const cls = classes.find(c=>c.id==e.target.value)||null;
          setSelectedClass(cls);
          if (cls) {
            setForm(prev => ({ ...prev, venue: cls.venue || '', scheduled_time: cls.scheduled_time || '' }));
          }
        }} disabled={!form.course_id}>
          <option value="">Select Class</option>
          {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Lecturer Name</label>
        <input className="form-control" name="lecturer_name" placeholder="Lecturer’s Name" value={form.lecturer_name} onChange={update}/>
      </div>
    </div>
    {selectedClass && (
      <div className="alert alert-info mb-3">
        <strong>Total Registered Students:</strong> {selectedClass.total_registered}
      </div>
    )}
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Venue</label>
        <input className="form-control" name="venue" placeholder="Venue of the Class" value={form.venue} onChange={update}/>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Scheduled Time</label>
        <input className="form-control" name="scheduled_time" placeholder="Scheduled Lecture Time" value={form.scheduled_time} onChange={update}/>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Week of Reporting</label>
        <input className="form-control" name="week_of_reporting" placeholder="Week of Reporting" value={form.week_of_reporting} onChange={update}/>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Lecture Date</label>
        <input className="form-control" type="date" name="lecture_date" value={form.lecture_date} onChange={update}/>
      </div>
    </div>
    <div className="mb-3">
      <label className="form-label">Topic Taught</label>
      <input className="form-control" name="topic_taught" placeholder="Topic Taught" value={form.topic_taught} onChange={update}/>
    </div>
    <div className="mb-3">
      <label className="form-label">Learning Outcomes</label>
      <textarea className="form-control" rows="3" name="learning_outcomes" placeholder="Learning Outcomes" value={form.learning_outcomes} onChange={update}/>
    </div>
    <div className="mb-3">
      <label className="form-label">Recommendations</label>
      <textarea className="form-control" rows="3" name="recommendations" placeholder="Recommendations" value={form.recommendations} onChange={update}/>
    </div>
    <div className="mb-3">
      <label className="form-label">Actual Students Present</label>
      <input className="form-control" type="number" name="actual_students_present" placeholder="Actual Present" value={form.actual_students_present} onChange={update}/>
    </div>
    <button className="btn btn-success">Submit Report</button>
    {message && <div className="alert alert-success mt-3">{message}</div>}
  </form>
 );
}
