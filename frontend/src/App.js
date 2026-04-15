import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [bugs, setBugs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', severity: 'Medium', gameArea: '', reproSteps: ''
  });

  const API_URL = 'https://rockstar-bug-tracker.onrender.com/api/bugs';

  const fetchBugs = async () => {
    try {
      const res = await axios.get(API_URL);
      setBugs(res.data);
    } catch (err) {
      console.error("Connection Error", err);
    }
  };

  useEffect(() => { fetchBugs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({ title: '', severity: 'Medium', gameArea: '', reproSteps: '' });
      fetchBugs();
    } catch (err) {
      alert("Error sending to Database. Check if Render backend is live!");
    }
  };

  return (
    <div className="App">
      <header className="rockstar-header">
        <div>ROCKSTAR GAMES // <span style={{color: '#fff'}}>PROD_ENVIRONMENT</span></div>
        <div style={{fontSize: '0.8rem'}}>STATION: HELIOS_16_QA</div>
      </header>

      <div className="main-content">
        <section className="form-section">
          <form onSubmit={handleSubmit} className="bug-form">
            <h2>{">"} INITIALIZE_NEW_REPORT</h2>
            <input 
              placeholder="SUMMARY" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
            <select 
              value={formData.severity} 
              onChange={e => setFormData({...formData, severity: e.target.value})}
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input 
              placeholder="AREA (e.g. WORLD_PHYSICS)" 
              value={formData.gameArea} 
              onChange={e => setFormData({...formData, gameArea: e.target.value})} 
            />
            <textarea 
              rows="5" 
              placeholder="REPRODUCTION_STEPS (Input steps 1, 2, 3...)" 
              value={formData.reproSteps} 
              onChange={e => setFormData({...formData, reproSteps: e.target.value})} 
            />
            <button type="submit">COMMIT TO CLOUD</button>
          </form>
        </section>

        <section className="bug-feed">
          <h2>// ACTIVE_SYSTEM_LOGS</h2>
          {bugs.length === 0 ? <p style={{color: '#444'}}>NO ACTIVE REGRESSIONS FOUND...</p> : 
            bugs.map(bug => (
              <div key={bug._id} className={`bug-card ${bug.severity.toLowerCase()}`}>
                <h3>
                  {bug.title}
                  <span style={{fontSize: '0.6rem', opacity: 0.5}}>{bug._id.slice(-8)}</span>
                </h3>
                
                <div className="meta-grid">
                  <div>Severity: <span>{bug.severity}</span></div>
                  <div>Location: <span>{bug.gameArea}</span></div>
                </div>

                <div className="repro-steps">
                  <div style={{color: '#fdb913', fontSize: '0.7rem', marginBottom: '5px'}}>REPRO_STEPS:</div>
                  <div style={{whiteSpace: 'pre-wrap'}}>{bug.reproSteps}</div>
                </div>
              </div>
            ))
          }
        </section>
      </div>
    </div>
  );
}

export default App;