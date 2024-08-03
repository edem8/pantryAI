"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Loader from './components/loader';
import SignIn from './components/sign-in'




export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (isLoading ? <Loader /> : <SignIn />);
}
