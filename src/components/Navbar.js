// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Event Management Dashboard
                </Typography>
                {isAuthenticated ? (
                    <>
                        <Button color="inherit" component={Link} to="/">Events</Button>
                        <Button color="inherit" component={Link} to="/attendees">Attendees</Button>
                        <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
                        <Button color="inherit" onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
