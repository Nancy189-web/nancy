import React,{useState,useEffect} from 'react';

export default function Rating(){
 const [lecturers,setLecturers]=useState([]);
 const [rating,setRating]=useState({target_id:'',target_type:'lecturer',rating:5,comment:''});
 const [message,setMessage]=useState('');
 async function loadLecturers(){
  const token=localStorage.getItem('token');
  const res=await fetch('/api/users?role=lecturer',{headers:{'Authorization':'Bearer '+token}});
  if(res.ok){setLecturers(await res.json());}
 }
 useEffect(()=>{loadLecturers();},[]);
 async function submit(e){
  e.preventDefault();
  const token=localStorage.getItem('token');
  const res=await fetch('/api/ratings',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(rating)});
  if(res.ok){setMessage('Rating submitted');}else setMessage('Error');
 }
 return(
  <div className="card p-3 mb-3">
    <h6>Rate a Lecturer</h6>
    <form onSubmit={submit}>
      <select className="form-control mb-2" value={rating.target_id} onChange={e=>setRating({...rating,target_id:e.target.value})}>
        <option value="">Select Lecturer</option>
        {lecturers.map(l=><option key={l.id} value={l.id}>{l.full_name}</option>)}
      </select>
      <input type="number" min="1" max="5" className="form-control mb-2" placeholder="Rating 1-5" value={rating.rating} onChange={e=>setRating({...rating,rating:e.target.value})}/>
      <textarea className="form-control mb-2" placeholder="Comment" value={rating.comment} onChange={e=>setRating({...rating,comment:e.target.value})}/>
      <button className="btn btn-primary">Submit Rating</button>
    </form>
    <div className="text-success">{message}</div>
  </div>
 );
}
