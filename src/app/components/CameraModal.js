import React, { useRef, useState, useEffect } from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import { Camera } from 'react-camera-pro';

const CameraModal = ({ open, onClose, onPhotoCapture }) => {
    const camera = useRef(null);
    const [numberOfCameras, setNumberOfCameras] = useState(0);

    const isSwitchCameraEnabled = numberOfCameras <= 1


    const handleCapture = () => {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            onPhotoCapture(photo);
        }
    };

    const handleSwitchCamera = () => {
        camera.current.switchCamera()
    };

    return (
        <Modal open={open} onClose={() => {
            onClose();
        }}>
            <Box
                sx={{
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Camera ref={camera} aspectRatio={4 / 3} numberOfCamerasCallback={setNumberOfCameras} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: isSwitchCameraEnabled ? 'center' : 'center',
                        mt: 2,
                        gap: 2,
                    }}
                >
                    {!isSwitchCameraEnabled && (
                        <IconButton
                            onClick={handleSwitchCamera}
                            sx={{
                                backgroundColor: '#FF725E',
                                '&:hover': {
                                    backgroundColor: '#FF5C4A',
                                },
                                p: 1.5,
                            }}
                        >
                            <FlipCameraIosIcon sx={{ color: 'white' }} />
                        </IconButton>
                    )}
                    <IconButton
                        onClick={handleCapture}
                        sx={{
                            backgroundColor: '#FF725E',
                            '&:hover': {
                                backgroundColor: '#FF5C4A',
                            },
                            p: 1.5,
                        }}
                    >
                        <CameraAltIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default CameraModal;
