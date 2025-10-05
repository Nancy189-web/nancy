import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

export default function StudentMonitoring() {
  const [reports, setReports] = useState([]);
  const [q, setQ] = useState('');

  async function loadReports() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/student/reports`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.ok) {
      setReports(await res.json());
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    // Optional: add search filter locally if needed
  }

  return (
    <div className="card p-3">
      <h5>Monitoring Reports</h5>
      <form onSubmit={handleSearch} className="mb-2 d-flex">
        <input
          className="form-control me-2"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by course, lecturer, topic..."
        />
        <button className="btn btn-secondary">Search</button>
      </form>

      {reports.length === 0 && <p>No reports found.</p>}

      {reports.map(r => (
        <div key={r.lecture_id} className="border p-2 mb-2">
          <b>{r.course_name} ({r.course_code})</b><br/>
          Faculty: {r.faculty_name}<br/>
          Class: {r.class_name}<br/>
          Week: {r.week_of_reporting}, Date: {r.lecture_date}<br/>
          Lecturer: {r.lecturer_name}<br/>
          Actual Students Present: {r.actual_students_present} / Total Registered: {r.total_registered}<br/>
          Venue: {r.venue}, Scheduled Time: {r.scheduled_time}<br/>
          Topic: {r.topic_taught}<br/>
          Learning Outcomes: {r.learning_outcomes}<br/>
          Recommendations: {r.recommendations}
        </div>
      ))}
    </div>
  );
}
