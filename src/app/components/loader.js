"use client";
import React from 'react';
import { Box } from '@mui/material';

function Loader() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: "100vh",
                width: "100%",
              
            }}
        >
            <img
                src="/loader.gif" 
                alt="Loading..."
                style={{ width: '100px', height: '100px' }} 
            />
        </Box>
    );
}

export default Loader;
