import React, { useState } from 'react';
import { Box, TextField, Modal, Typography, Button, IconButton } from '@mui/material';
import EmojiPickerModal from './EmojiPickerModal';
import { auth, db, setDoc, collection, doc } from '../../services/firebase';
import { toast } from 'sonner';

const ModalForm = ({ open, handleClose }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('🍅');
    const [emojiModalOpen, setEmojiModalOpen] = useState(false);

    const handleEmojiOpen = () => setEmojiModalOpen(true);
    const handleEmojiClose = () => setEmojiModalOpen(false);

    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji);
        handleEmojiClose();
    };

    const handleSubmit = async () => {
        if (!name || !quantity) {
            console.log("Name and Quantity are required");
            return;
        }

        try {
            handleClose()
            toast.success("Item added to pantry")
            const user = auth.currentUser;

            const userId = user.uid;
            const userCollectionRef = collection(db, "users", userId, "items");
            const newItemRef = doc(userCollectionRef);

            await setDoc(newItemRef, {
                name,
                quantity,
                emoji: selectedEmoji
            });



            setName('');
            setQuantity('');
            setSelectedEmoji('🍅');

        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    return (
        <>
            <Modal
                disablePortal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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
                        overflowY: 'auto',
                    }}
                >
                    <Typography id="modal-title" fontWeight={"600"} color="#000">
                        Add Item
                    </Typography>


                    <IconButton onClick={handleEmojiOpen} size="large" >
                        {selectedEmoji}
                    </IconButton>
                    <TextField
                        size='normal'
                        margin="none"
                        placeholder='Item'
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#FF725E',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FF725E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF725E',
                                },
                            },
                        }}

                    />

                    <TextField
                        size='normal'
                        margin="dense"
                        placeholder='Quantity'
                        variant="outlined"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#FF725E',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FF725E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF725E',
                                },
                            },
                        }}
                    />

                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{
                        mt: 1,
                        backgroundColor: '#FF725E',
                        '&:hover': {
                            backgroundColor: '#FF5C4A',
                        },
                    }} >
                        Submit
                    </Button>
                </Box>
            </Modal>
            <EmojiPickerModal open={emojiModalOpen} handleClose={handleEmojiClose} onEmojiSelect={handleEmojiSelect} />
        </>
    );
};

export default ModalForm;
