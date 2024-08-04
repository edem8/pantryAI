'use client'
import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Button, Paper, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, auth } from '../../services/firebase';
import Loader from '../components/loader';
import ModalForm from '../components/AddManuallyModal';
import { db, collection, onSnapshot, doc, deleteDoc } from '../../services/firebase';
import CameraModal from '../components/CameraModal';
import { toast } from 'sonner';

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeButton, setActiveButton] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [pantry, setPantry] = useState([]);
    const [cameraModalOpen, setCameraModalOpen] = useState(false);
    const [initialName, setInitialName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');
            } else {
                const userId = user.uid;
                const userCollectionRef = collection(db, "users", userId, "items");
                const unsubscribeSnapshot = onSnapshot(userCollectionRef, (snapshot) => {
                    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setPantry(items);
                    setLoading(false);
                });

                return () => {
                    unsubscribeSnapshot();
                };
            }
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const handleIconClick = (type) => {
        type === 'add' ? setModalOpen(true) : setCameraModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleCameraModalClose = () => {
        setCameraModalOpen(false);
    };

    const handlePhotoCapture = async (photo) => {
        console.log('Captured Photo:', photo);
        handleCameraModalClose();

        const aiPromise = () => new Promise(async (resolve, reject) => {
            try {
                const base64Image = photo.split(',')[1];
                const result = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageBlob: base64Image,
                    }),
                });

                const data = await result.json();
                console.log('API Response:', data.description);

                setInitialName(data.description);
                setModalOpen(true);
                resolve(data.description);
            } catch (error) {
                console.error('Error handling photo capture:', error);
                reject(error);
            }
        });

        toast.promise(aiPromise, {
            loading: 'Processing Image',
            success: (data) => `${data} identified`,
            error: (error) => `Sorry, couldn't process photo`,
        });
    };

    const handleDelete = async (id) => {
        try {
            const user = auth.currentUser;
            const userId = user.uid;
            const itemDocRef = doc(db, "users", userId, "items", id);
            await deleteDoc(itemDocRef);
            console.log("Item deleted successfully");
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Box p={{ xs: 1, sm: 2, md: 3 }} height="100vh" overflow="hidden">
                    <Box display="flex" flexDirection="column" height="100%" overflow="auto">
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <IconButton
                                onClick={() => handleIconClick('add')}
                                sx={{
                                    color: '#FF725E',
                                    '&:hover': {
                                        color: '#FF5733',
                                    },
                                }}
                            >
                                <AddCircleOutlinedIcon fontSize='large' />
                            </IconButton>
                            <IconButton
                                onClick={() => handleIconClick('camera')}
                                sx={{
                                    color: '#FF725E',
                                    '&:hover': {
                                        color: '#FF5733',
                                    },
                                    fontSize: { xs: 40, sm: 50, md: 60 }
                                }}
                            >
                                <CameraAltIcon fontSize='large' />
                            </IconButton>
                        </Box>

                        <ModalForm open={modalOpen} handleClose={handleModalClose} initialName={initialName} setInitialName={setInitialName} />
                        <CameraModal open={cameraModalOpen} onClose={handleCameraModalClose} onPhotoCapture={handlePhotoCapture} />

                        <TextField
                            id="search-bar"
                            onInput={(e) => setSearchQuery(e.target.value)}
                            variant="outlined"
                            placeholder="Search your pantry"
                            size="large"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#ff6c4d' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#ff6c4d',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF5733',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF5733',
                                    },
                                    bgcolor: '#fff',
                                    borderRadius: 2,
                                },
                                width: '100%',
                                mb: 2,
                            }}
                        />

                        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                            {['ALL', 'FRUITS', 'SNACKS', 'VEGETABLES'].map((label, index) => (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleButtonClick(index)}
                                    sx={{
                                        fontWeight: "600",
                                        padding: '6px 12px',
                                        fontSize: { xs: '10px', sm: '12px' },
                                        color: activeButton === index ? '#fff' : '#9e9e9e',
                                        bgcolor: activeButton === index ? '#FF725E' : 'transparent',
                                        borderColor: activeButton === index ? '#FF725E' : '#9e9e9e',
                                        '&:hover': {
                                            bgcolor: activeButton === index ? '#FF725E' : '#F28F81',
                                            color: '#fff',
                                            borderColor: activeButton === index ? '#FF725E' : '#F28F81',
                                        }
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>

                        <Box
                            sx={{
                                overflowY: 'auto',
                                maxHeight: '70vh',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' }
                            }}
                        >
                            {pantry
                                .filter((item) =>
                                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((item) => (
                                    <Paper
                                        key={item.id}
                                        elevation={0}
                                        sx={{
                                            p: 1.3,
                                            mt: 1.5,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box display="flex" flexDirection="row" gap={2}>
                                            <Typography color="text.primary" fontSize={{ xs: '20px', sm: '25px' }}>
                                                {item.emoji}
                                            </Typography>
                                            <Box display="flex" flexDirection="column" color="text.primary">
                                                <Typography variantMapping={"body1"} fontWeight={500}>
                                                    {item.name}
                                                </Typography>
                                                <Typography color={"#9e9e9e"} fontSize={"12px"} fontWeight={500} letterSpacing={"1px"}>
                                                    {item.quantity}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleDelete(item.id)}
                                            sx={{
                                                color: '#FF5733',
                                                '&:hover': {
                                                    color: '#FF3C2D',
                                                },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Paper>
                                ))}
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default Page;
