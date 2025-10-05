import React,{useState} from 'react';
export default function Register(){
 const [form,setForm]=useState({username:'',full_name:'',password:'',role:'student',stream:''});
 const [message,setMessage]=useState('');
 const API_BASE = process.env.REACT_APP_API || '';
 function update(e){setForm({...form,[e.target.name]:e.target.value})}
 async function submit(e){
  e.preventDefault();
  try{
  const res=await fetch(`${API_BASE}/api/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    const text = await res.text();
    let data;
    try{ data = JSON.parse(text); } catch(_) { data = {error: text}; }
    if(res.ok){
      setMessage('Registered successfully');
    } else {
      setMessage(data.error || 'Error: ' + (text || res.statusText));
    }
  }catch(err){
    setMessage('Network error: '+err.message);
  }
 }
 return(
  <form onSubmit={submit} className="card p-3">
    <h5>Register</h5>
    <input className="form-control mb-2" name="username" placeholder="Username" value={form.username} onChange={update} required/>
    <input className="form-control mb-2" name="full_name" placeholder="Full Name" value={form.full_name} onChange={update} required/>
    <input type="password" className="form-control mb-2" name="password" placeholder="Password" value={form.password} onChange={update} required/>
    <select className="form-control mb-2" name="role" value={form.role} onChange={update}>
      <option value="student">Student</option>
      <option value="lecturer">Lecturer</option>
      <option value="prl">Principal Lecturer</option>
      <option value="pl">Program Leader</option>
    </select>
    {(form.role==='prl'||form.role==='pl') && <input className="form-control mb-2" name="stream" placeholder="Stream" value={form.stream} onChange={update}/>}
    <button className="btn btn-primary">Register</button>
    <div className="text-success">{message}</div>
  </form>
 );
}
