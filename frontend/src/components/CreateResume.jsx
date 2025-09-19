import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    TextareaAutosize,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function CreateResume() {
    const [title, setTitle] = useState('My Resume');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('');
    const [education, setEducation] = useState([{ degree: '', institute: '', year: '' }]);
    const [experience, setExperience] = useState([{ title: '', company: '', description: '' }]);
    const navigate = useNavigate();

    const validateYear = (year) => {
        // Allow either empty, 4 digits, or 4 digits-4 digits
        const regex = /^\d{4}(-\d{4})?$/;
        return regex.test(year) || year === '';
    };

    const validateEmail = (email) => {
        // Simple but solid regex for most cases
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) || email === '';
    };
    const validateName = (name) => {
        return name.trim().length > 0; // not empty
    };
    const isFormValid =
        validateName(name) &&
        validateEmail(email) &&
        skills.trim().length > 0 &&
        education.every(edu =>
            edu.degree.trim() &&
            edu.institute.trim() &&
            validateYear(edu.year)
        ) &&
        experience.every(exp =>
            exp.title.trim() &&
            exp.company.trim() &&
            exp.description.trim()
        );



    const handleAddEducation = () => {
        setEducation([...education, { degree: '', institute: '', year: '' }]);
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);
    };

    const handleAddExperience = () => {
        setExperience([...experience, { title: '', company: '', description: '' }]);
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExperience = [...experience];
        updatedExperience[index][field] = value;
        setExperience(updatedExperience);
    };


    const submit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('please login');
            return;
        }

        const payload = {
            title,
            sections: {
                personal: { name, email },
                skills: skills.split(',').map(s => s.trim()),
                education: education,
                experience: experience,
            },
        };

        try {
            const res = await axios.post('http://localhost:8000/resumes', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating resume:', error);
            alert('Failed to create resume');
        }
    };



    return (
        <Box maxWidth={800} mx="auto" mt={3} p={3} bgcolor="#f5f5f5" borderRadius={2}>
            <Typography variant="h5" gutterBottom>
                Create Resume
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={!validateEmail(email)}
                        helperText={
                            !validateEmail(email)
                                ? "Enter a valid email address (e.g. name@example.com)"
                                : ""
                        }
                    />

                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Skills (comma separated)"
                        fullWidth
                        margin="normal"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        error={skills.trim().length === 0}
                        helperText={skills.trim().length === 0 ? "At least one skill is required" : "Separate skills with commas"}
                    />
                </Grid>

                {/* Education */}
                <Grid item xs={12}>
                    <Typography variant="h6">Education</Typography>
                    {education.map((edu, index) => (
                        <Grid container spacing={2} key={index} mt={1}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Degree"
                                    fullWidth
                                    value={edu.degree}
                                    onChange={e => handleEducationChange(index, 'degree', e.target.value)}
                                    error={!edu.degree.trim()}
                                    helperText={!edu.degree.trim() ? "Degree is required" : ""}
                                />

                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Institute"
                                    fullWidth
                                    value={edu.institute}
                                    onChange={e => handleEducationChange(index, 'institute', e.target.value)}
                                    error={!edu.institute.trim()}
                                    helperText={!edu.institute.trim() ? "Institute is required" : ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Year"
                                    fullWidth
                                    value={edu.year}
                                    onChange={e => handleEducationChange(index, 'year', e.target.value)}
                                    error={!validateYear(edu.year)}
                                    helperText={
                                        !validateYear(edu.year)
                                            ? "Enter year as YYYY or YYYY-YYYY"
                                            : ""
                                    }
                                />


                            </Grid>
                        </Grid>
                    ))}
                    <Button variant="outlined" onClick={handleAddEducation} mt={2}>
                        Add Education
                    </Button>
                </Grid>

                {/* Experience */}
                <Grid item xs={12}>
                    <Typography variant="h6">Experience</Typography>
                    {experience.map((exp, index) => (
                        <Grid container spacing={2} key={index} mt={1}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    value={exp.title}
                                    onChange={e => handleExperienceChange(index, 'title', e.target.value)}
                                    error={!exp.title.trim()}
                                    helperText={!exp.title.trim() ? "Title is required" : ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Company"
                                    fullWidth
                                    value={exp.company}
                                    onChange={e => handleExperienceChange(index, 'company', e.target.value)}
                                    error={!exp.company.trim()}
                                    helperText={!exp.company.trim() ? "Company is required" : ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    minRows={3}
                                    placeholder="Description"
                                    style={{ width: '100%', marginTop: '8px', padding: '8px' }}
                                    value={exp.description}
                                    onChange={e => handleExperienceChange(index, 'description', e.target.value)}
                                    aria-label="experience description"
                                    error={!exp.description.trim()}
                                    helperText={!exp.description.trim() ? "Description is required" : ""}
                                />

                            </Grid>
                        </Grid>
                    ))}
                    <Button variant="outlined" onClick={handleAddExperience} mt={2}>
                        Add Experience
                    </Button>
                </Grid>


                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                        disabled={!isFormValid}
                    >
                        Save Resume
                    </Button>

                </Grid>
            </Grid>


            {/* Resume Preview */}
            <Box mt={4} p={3} bgcolor="white" border="1px solid #ccc" borderRadius={2}>
                <Typography variant="h6">Resume Preview</Typography>
                <Typography variant="h4">{title}</Typography>
                <Typography variant="h5">{name}</Typography>
                <Typography>{email}</Typography>
                <Typography variant="h6">Skills</Typography>
                <ul>
                    {skills.split(',').map((skill, index) => (
                        <li key={index}>{skill.trim()}</li>
                    ))}
                </ul>
                <Typography variant="h6">Education</Typography>
                <ul>
                    {education.map((edu, index) => (
                        <li key={index}>
                            {edu.degree} - {edu.institute} ({edu.year})
                        </li>
                    ))}
                </ul>
                <Typography variant="h6">Experience</Typography>
                <ul>
                    {experience.map((exp, index) => (
                        <li key={index}>
                            {exp.title} - {exp.company} : {exp.description}
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
}