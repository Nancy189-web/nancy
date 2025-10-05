import React,{useState,useEffect} from 'react';
export default function ReportsList(){
 const [reports,setReports]=useState([]);
 const [q,setQ]=useState('');
 async function load(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/reports?q='+encodeURIComponent(q),{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setReports(await res.json());}
 }
 useEffect(()=>{load();},[]);
 function search(e){e.preventDefault();load();}
 async function exportExcel(){
  const token = localStorage.getItem('token');
  const response = await fetch('/api/reports/export?q='+encodeURIComponent(q), {
    headers: {'Authorization': 'Bearer ' + token}
  });
  if (!response.ok) {
    alert('Failed to download');
    return;
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reports.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
 }
 return(
  <div className="card p-3">
    <h5>Reports</h5>
    <form onSubmit={search} className="mb-2 d-flex">
      <input className="form-control me-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search"/>
      <button className="btn btn-secondary">Search</button>
    </form>
    <button className="btn btn-outline-success mb-2" onClick={exportExcel}>Download Excel</button>
    {reports.map(r=><div key={r.id} className="border p-2 mb-2"><b>{r.course_name}</b> {r.topic_taught} | Lecturer: {r.lecturer_name}</div>)}
  </div>
 );
}