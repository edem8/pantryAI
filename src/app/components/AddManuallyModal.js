import React, { useState, useEffect } from 'react';
import { Box, TextField, Modal, Typography, Button, IconButton } from '@mui/material';
import EmojiPickerModal from './EmojiPickerModal';
import { auth, db, setDoc, collection, doc, query, where, getDocs, updateDoc } from '../../services/firebase';
import { toast } from 'sonner';

const ModalForm = ({ open, handleClose, initialName, setInitialName }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('🍅');
    const [emojiModalOpen, setEmojiModalOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setName(initialName || '');
        }
    }, [open, initialName]);

    const handleEmojiOpen = () => setEmojiModalOpen(true);
    const handleEmojiClose = () => setEmojiModalOpen(false);

    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji);
        handleEmojiClose();
    };

    const capitalizeName = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleSubmit = async () => {
        if (!name || !quantity) {
            console.log("Name and Quantity are required");
            return;
        }

        const capitalizedName = capitalizeName(name.trim());

        try {
            handleClose();
            toast.success("Item added to pantry");

            const user = auth.currentUser;
            const userId = user.uid;
            const userCollectionRef = collection(db, "users", userId, "items");

            const itemQuery = query(userCollectionRef, where("name", "==", capitalizedName));
            const querySnapshot = await getDocs(itemQuery);

            if (!querySnapshot.empty) {
                const existingItemRef = querySnapshot.docs[0].ref;
                await updateDoc(existingItemRef, {
                    quantity: quantity,
                    emoji: selectedEmoji
                });
            } else {
                const newItemRef = doc(userCollectionRef);
                await setDoc(newItemRef, {
                    name: capitalizedName,
                    quantity,
                    emoji: selectedEmoji
                });
            }

            setName('');
            setQuantity('');
            setSelectedEmoji('🍅');
            setInitialName('')

        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    return (
        <>
            <Modal
                disablePortal
                open={open}
                onClose={() => { handleClose(); setName(''); }}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 305,
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        border: '2px solid #FF725E',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 2,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography id="modal-title" fontWeight={"600"} color="#000" mb={1}>
                        Add Item
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 1,
                        }}
                    >
                        <IconButton onClick={handleEmojiOpen} size="medium">
                            {selectedEmoji}
                        </IconButton>
                        <Typography fontSize={"9px"} fontWeight={"bold"} color={"gray"} letterSpacing={".8px"} >
                            Change emoji
                        </Typography>
                    </Box>

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
                    <Typography fontSize={"10px"} fontWeight={500} color={"gray"} letterSpacing={".8px"} mb={1}>
                        Add quantity units e.g. 7pcs, 1 dozen
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: '#FF725E',
                            '&:hover': {
                                backgroundColor: '#FF5C4A',
                            },
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal >
            <EmojiPickerModal open={emojiModalOpen} handleClose={handleEmojiClose} onEmojiSelect={handleEmojiSelect} />
        </>
    );
};

export default ModalForm;
