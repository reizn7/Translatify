import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TriggerPython from "../components/TriggerPython"; // Import TriggerPython component
import "../styles/LiveMeeting.css";

const LiveMeeting = () => {
  const navigate = useNavigate();
  const [translation, setTranslation] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showTriggerPython, setShowTriggerPython] = useState(false); // To control showing TriggerPython
  const [isExecuting, setIsExecuting] = useState(false); // To control the execution state

  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Toggle the execution of the Python script
  const handleExecute = () => {
    setShowTriggerPython(true); // Show TriggerPython component when Execute is clicked
    setIsExecuting(true); // Set executing to true
  };

  // Stop the Python script execution
  const handleStop = () => {
    setShowTriggerPython(false); // Hide TriggerPython component when Stop is clicked
    setIsExecuting(false); // Set executing to false
  };

  // End the meeting and navigate back to Dashboard
  const handleEndMeeting = () => {
    navigate("/"); // Navigate back to Dashboard
  };

  return (
    <div className="live-meeting">
      <div className="meeting-header">
        <h2>Current Meeting</h2>
        <button className="end-meeting-btn" onClick={handleStop}>
          End Meeting
        </button>
      </div>

      <div className="meeting-content">
        <div className="translation-panel">
          <h3>Real-Time Translation</h3>
          <div className="translation-content">
            {translation || "Translation will appear here..."}
          </div>
        </div>

        <div className="tasks-panel">
          <h3>Tasks & Action Items</h3>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add new task..."
            />
            <button type="submit">Add</button>
          </form>
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    setTasks(
                      tasks.map((t) =>
                        t.id === task.id
                          ? { ...t, completed: !t.completed }
                          : t
                      )
                    );
                  }}
                />
                <span className={task.completed ? "completed" : ""}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Execute and Stop buttons */}
        <div className="execute-button-container">
          {!isExecuting ? (
            <button onClick={handleExecute} className="execute-btn">
              Execute
            </button>
          ) : (
            <button onClick={handleStop} className="stop-btn">
              Stop Execution
            </button>
          )}
          {showTriggerPython && <TriggerPython />} {/* Show TriggerPython when Execute is clicked */}
        </div>
      </div>
    </div>
  );
};

export default LiveMeeting;
