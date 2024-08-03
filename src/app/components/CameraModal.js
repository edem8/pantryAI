// components/CameraModal.js
import React, { useRef, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Camera } from 'react-camera-pro';

const CameraModal = ({ open, onClose, onPhotoCapture }) => {
    const camera = useRef(null);
    const [image, setImage] = useState(null);

    const handleCapture = () => {
        const photo = camera.current.takePhoto();
        setImage(photo);
        onPhotoCapture(photo);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                border: '2px solid #FF725E',
                borderRadius: 2,
                boxShadow: 24,
                p: 2,
                overflowY: 'auto',


            }}

            >

                <Camera ref={camera} aspectRatio={4 / 3} />
                <Button variant="contained" color="primary" onClick={handleCapture} sx={{
                    mt: 1,
                    backgroundColor: '#FF725E',
                    '&:hover': {
                        backgroundColor: '#FF5C4A',
                    },
                }} >
                    Submit
                </Button>
                {/* {image && <img src={image} alt='Captured' style={{ marginTop: 10, maxWidth: '100%' }} />} */}

            </Box>
        </Modal>
    );
};

export default CameraModal;
