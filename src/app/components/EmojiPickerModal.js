import React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';




const EmojiPickerModal = ({ open, handleClose, onEmojiSelect }) => {

    const handleEmojiSelect = (emoji) => {
        onEmojiSelect(emoji.native);
    };

    return (
        <Modal
            disablePortal
            open={open}
            onClose={handleClose}
            aria-labelledby="emoji-picker-title"
            aria-describedby="emoji-picker-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 350,
                    height: 350,
                    bgcolor: 'background.paper',
                    border: '2px solid #FF725E',
                    borderRadius: 2,
                    boxShadow: 24,
                    scrollbarWidth: "none",
                    maxHeight: '80vh',
                    overflow: 'hidden',
                }}
            >
                <Box >
                    <Picker
                        data={data}
                        categories={['foods']}
                        navPosition="none"
                        emojiSize="27"
                        theme="light"
                        previewPosition="none"
                        onEmojiSelect={handleEmojiSelect}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default EmojiPickerModal;
