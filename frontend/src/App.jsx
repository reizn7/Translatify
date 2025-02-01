import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import LiveMeeting from "./components/LiveMeeting"
import MeetingSummary from "./components/MeetingSummary"
import "./App.css"

// Simple Dialog component
const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

// NavBar component to handle conditional rendering
const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isNotDashboard = location.pathname !== "/"
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [meetingCode, setMeetingCode] = useState("")

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      navigate(`/meeting?code=${meetingCode}`)
      setIsDialogOpen(false)
    }
  }

  return (
    <nav className="navbar">
      <div className="logo">Meeting Pro</div>
      <ul className="nav-links">
        {isNotDashboard ? (
          <li>
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Back to Dashboard
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => setIsDialogOpen(true)}>Join Meeting</button>
          </li>
        )}
      </ul>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <h2>Join Meeting</h2>
        <p>Enter the meeting code to join.</p>
        <input
          type="text"
          placeholder="Enter meeting code"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
        />
        <button onClick={handleJoinMeeting}>Join</button>
      </Dialog>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        {/* Geometric Elements */}
        <div className="geometric-element"></div>
        <div className="geometric-element"></div>
        <div className="geometric-element"></div>

        <NavBar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meeting" element={<LiveMeeting />} />
            <Route path="/summary/:id" element={<MeetingSummary />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App