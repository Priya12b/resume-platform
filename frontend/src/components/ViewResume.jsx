import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

// -------------------- TEMPLATES --------------------
function TemplateOne({ resume }) {
  if (!resume) return null;
  const s = resume.sections;
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>{resume.title}</h1>
      <h2>{s.personal?.name}</h2>
      <p>{s.personal?.email}</p>
      <h3>Skills</h3>
      <ul>{(s.skills || []).map((sk, i) => <li key={i}>{sk}</li>)}</ul>
      <h3>Education</h3>
      <ul>{(s.education || []).map((ed, i) => <li key={i}>{ed.degree} - {ed.institute} ({ed.year})</li>)}</ul>
      <h3>Experience</h3>
      <ul>{(s.experience || []).map((ex, i) => <li key={i}>{ex.title} - {ex.company}: {ex.description}</li>)}</ul>
    </div>
  );
}

function TemplateTwo({ resume }) {
  if (!resume) return null;
  const s = resume.sections;
  return (
    <div style={{ padding: 20, fontFamily: "Georgia", background: "#fdfdfd" }}>
      <header style={{ borderBottom: "2px solid black", marginBottom: 10 }}>
        <h1 style={{ margin: 0 }}>{s.personal?.name}</h1>
        <p>{s.personal?.email}</p>
      </header>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Skills</h3>
          <ul>{(s.skills || []).map((sk, i) => <li key={i}>{sk}</li>)}</ul>
          <h3>Education</h3>
          <ul>{(s.education || []).map((ed, i) => <li key={i}>{ed.degree} - {ed.institute} ({ed.year})</li>)}</ul>
        </div>
        <div style={{ flex: 2 }}>
          <h3>Experience</h3>
          <ul>{(s.experience || []).map((ex, i) => <li key={i}><b>{ex.title}</b> @ {ex.company}<br />{ex.description}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

// -------------------- MAIN COMPONENT --------------------
export default function ViewResume({ mode }) {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("one");
  const ref = useRef();
  const navigate = useNavigate();
  const handlePrint = useReactToPrint({ content: () => ref.current });

  useEffect(() => {
    async function fetchResume() {
      const token = localStorage.getItem('token');
      if (!token) return navigate("/login");
      try {
        const res = await axios.get(`http://localhost:8000/resumes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(res.data);
      } catch (error) {
        console.error('Error fetching resume:', error);
        alert('Failed to load resume');
      }
    }
    fetchResume();
  }, [id, navigate]);

  if (!resume) return <Typography>Loading...</Typography>;

  const RenderTemplate = selectedTemplate === "one" ? TemplateOne : TemplateTwo;

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/resumes/${id}`, resume, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Resume updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save resume:", error);
      alert("Failed to save resume");
    }
  };

  return (
    <Box>
      <Typography variant="h4">{mode === "edit" ? "Edit Resume" : "View Resume"}</Typography>

      {/* Template Selector */}
      <Box mt={2}>
        <Typography variant="subtitle1">Choose Template</Typography>
        <Select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <MenuItem value="one">Template One (Simple)</MenuItem>
          <MenuItem value="two">Template Two (Modern)</MenuItem>
        </Select>
      </Box>

      {/* Resume Display */}
      <div ref={ref} style={{ marginTop: 20 }}>
        <RenderTemplate resume={resume} />
      </div>

      {/* Editable form only if mode==="edit" */}
      {mode === "edit" && (
        <Box mt={4}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={resume.title}
            onChange={e => setResume({ ...resume, title: e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={resume.sections.personal.name}
            onChange={e => setResume({ 
              ...resume, 
              sections: { 
                ...resume.sections, 
                personal: { ...resume.sections.personal, name: e.target.value } 
              } 
            })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={resume.sections.personal.email}
            onChange={e => setResume({ 
              ...resume, 
              sections: { 
                ...resume.sections, 
                personal: { ...resume.sections.personal, email: e.target.value } 
              } 
            })}
          />
          {/* Add skills, education, experience editing here if needed */}
          <TextField
            label="Skills (comma separated)"
            fullWidth
            margin="normal"
            value={(resume.sections.skills || []).join(", ")}
            onChange={e => setResume({ 
              ...resume, 
              sections: { 
                ...resume.sections, 
                skills: e.target.value.split(",").map(s => s.trim()) 
              } 
            })}
          />
          <TextField 
          label="Education (format: degree,institute,year; separate multiple with |)"
          fullWidth
          margin="normal"
          value={(resume.sections.education || []).map(ed => `${ed.degree},${ed.institute},${ed.year}`).join(" | ")}
          onChange={e => {
            const eduArr = e.target.value.split("|").map(item => {
              const [degree, institute, year] = item.split(",").map(s => s.trim());
              return { degree, institute, year };
            });
            setResume({
              ...resume,
              sections: {
                ...resume.sections,
                education: eduArr
              }
            });
          }}
          />
          <TextField 
          label="Experience (format: title,company,description; separate multiple with |)"
          fullWidth
          margin="normal"
          value={(resume.sections.experience || []).map(ex => `${ex.title},${ex.company},${ex.description}`).join(" | ")}
          onChange={e => {
            const expArr = e.target.value.split("|").map(item => {
              const [title, company, description] = item.split(",").map(s => s.trim());
              return { title, company, description };
            });
            setResume({
              ...resume,
              sections: {
                ...resume.sections,
                experience: expArr
              }
            });
          }}
          />

          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: 10 }}>
            Save Changes
          </Button>
        </Box>
      )}

      <Button variant="contained" onClick={handlePrint} style={{ marginTop: 10 }}>
        Download as PDF
      </Button>
    </Box>
  );
}
