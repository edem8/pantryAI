"use client";
import React from 'react';
import { Box, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { auth, browserSessionPersistence, googleProvider, setPersistence, signInWithPopup } from '../../services/firebase';
import { useRouter } from 'next/navigation';
import Loader from './loader';
import { toast } from 'sonner';

function SignIn() {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const signInPromise = () => new Promise(async (resolve, reject) => {
            try {
                await setPersistence(auth, browserSessionPersistence);
                const result = await signInWithPopup(auth, googleProvider);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(signInPromise, {
            loading: 'Loading Pantry...',
            success: () => {
                router.push('/pantry');
                return `Signed in successfully`;
            },
            error: (error) => {
                console.error('Error signing in with Google:', error);
                router.push('/');
                return `Sign-in failed`;
            }
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: "100vh",
                p: 2,
                bgcolor: '#f4f4f4'
            }}
        >
            <img
                src="/grocery.png"
                alt="Grocery"
                style={{ width: '90%', maxWidth: 400, marginBottom: 80 }}
            />
            
            <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                    maxWidth: 400,
                    
                    p: 1.5,
                    borderRadius: 3,
                    backgroundColor: '#FF725E',
                    '&:hover': {
                        backgroundColor: '#FA553E',
                    }
                }}
                onClick={handleGoogleSignIn}
            >
                Sign in with Google
            </Button>
        </Box>
    );
}

export default SignIn;
