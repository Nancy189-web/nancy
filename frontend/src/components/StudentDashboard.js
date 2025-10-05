import React, { useState, useEffect } from 'react';
import Rating from './Rating';
import { API_BASE } from '../config';

export default function StudentDashboard() {
  const [reports, setReports] = useState([]);
  const [q, setQ] = useState('');

  // Load student reports (monitoring)
  async function loadReports() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/reports`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      const data = await res.json();
      setReports(data);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  // Optional: live search/filter by course, lecturer, or topic
  const filteredReports = reports.filter(r =>
    (r.course_name || '').toLowerCase().includes(q.toLowerCase()) ||
    (r.lecturer_name || '').toLowerCase().includes(q.toLowerCase()) ||
    (r.topic_taught || '').toLowerCase().includes(q.toLowerCase())
  );

  function handleSearch(e) {
    e.preventDefault();
    // filtering happens automatically in filteredReports
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h4 className="card-title mb-0">Student Dashboard</h4>
            </div>
            <div className="card-body">
              <p className="text-muted">View reports (Monitoring) and rate lecturers/courses.</p>

              {/* Search Bar for Monitoring */}
              <div className="row">
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h6 className="mb-0">Search Reports</h6>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSearch} className="d-flex">
                        <input
                          className="form-control me-2"
                          placeholder="Search by course, lecturer, or topic"
                          value={q}
                          onChange={e => setQ(e.target.value)}
                        />
                        <button className="btn btn-outline-success">Search</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitoring Reports */}
              <div className="row">
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h6 className="mb-0">Monitoring Reports</h6>
                    </div>
                    <div className="card-body">
                      {filteredReports.length === 0 && <p className="text-muted">No reports found.</p>}
                      {filteredReports.map(r => (
                        <div key={r.lecture_id} className="border rounded p-3 mb-3 bg-light">
                          <strong className="text-primary">{r.course_name} ({r.course_code})</strong><br/>
                          <small className="text-muted">
                            Faculty: {r.faculty_name} | Class: {r.class_name} | Week: {r.week_of_reporting} | Date: {r.lecture_date}<br/>
                            Lecturer: {r.lecturer_name} | Attendance: {r.actual_students_present} / {r.total_registered}<br/>
                            Venue: {r.venue} | Time: {r.scheduled_time}
                          </small><br/>
                          <strong>Topic:</strong> {r.topic_taught}<br/>
                          <strong>Learning Outcomes:</strong> {r.learning_outcomes}<br/>
                          <strong>Recommendations:</strong> {r.recommendations}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Component */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Rate Lecturers/Courses</h6>
                    </div>
                    <div className="card-body">
                      <Rating />
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
