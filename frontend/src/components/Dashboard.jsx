import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const meetings = [
    { id: 1, title: 'Product Launch', date: '2024-03-25', status: 'upcoming' },
    { id: 2, title: 'Stakeholder Meeting', date: '2024-03-24', status: 'upcoming' },
    { id: 3, title: 'Team Sync', date: '2024-03-19', status: 'completed' },
    { id: 4, title: 'Client Meeting', date: '2024-03-18', status: 'completed' },
    { id: 5, title: 'Project Review', date: '2024-03-17', status: 'completed' },
    { id: 6, title: 'Sprint Planning', date: '2024-03-16', status: 'completed' }
  ];

  const upcomingMeetings = meetings.filter(meeting => meeting.status === 'upcoming');
  const pastMeetings = meetings.filter(meeting => meeting.status === 'completed');

  const handleViewSummary = (meetingId) => {
    navigate(`/summary/${meetingId}`);
  };

  const handleJoinMeeting = () => {
    navigate('/meeting');
  };

  return (
    <div className="dashboard">
      {upcomingMeetings.length > 0 && (
        <section className="meetings-section">
          <h2>Upcoming Meetings</h2>
          <div className="meetings-grid">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="meeting-card upcoming">
                <h4>{meeting.title}</h4>
                <p className="meeting-date">{meeting.date}</p>
                <button 
                  className="join-meeting-btn"
                  onClick={handleJoinMeeting}
                >
                  Join Meeting
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="meetings-section">
        <h2>Past Meetings</h2>
        <div className="meetings-grid">
          {pastMeetings.map(meeting => (
            <div key={meeting.id} className="meeting-card">
              <h4>{meeting.title}</h4>
              <p className="meeting-date">{meeting.date}</p>
              <button 
                className="view-summary-btn"
                onClick={() => handleViewSummary(meeting.id)}
              >
                View Summary
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;