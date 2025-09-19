import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('http://localhost:8000/resumes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResumes(res.data);
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/resumes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResumes(resumes.filter(r => r.id !== id)); // Update state to remove deleted resume
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume');
        }
    };


    return (
        <Box>
            <Typography variant="h4">Your Resumes</Typography>
            <Button
                variant="contained"
                component={Link}
                to="/create"
                style={{ marginTop: 10 }}
            >
                Create New
            </Button>
            <List>
                {resumes.map(r => (
                    <ListItem key={r.id} divider alignItems="center">
                        {/* <ListItemText primary={r.title} secondary={`ID: ${r.id}`} /> */}
                        <ListItemText primary={r.title || "Untitled Resume"} />

                        <Box ml="auto">
                            <IconButton component={Link}
                                to={`/edit/${r.id}`}    // <-- new edit route
                                variant="contained"
                                aria-label="edit"
                                size="small"
                                // color="primary"
                                style={{ marginRight: 5 }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(r.id)} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                            <Button component={Link} to={`/view/${r.id}`} aria-label="edit">
                                View
                            </Button>

                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}