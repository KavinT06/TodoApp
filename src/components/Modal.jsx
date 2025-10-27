import React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";


export default function Modal({ editModalOpen, handleEditClose, editTaskName, setEditTaskName, editTaskPriority, setEditTaskPriority, editTaskCategory, setEditTaskCategory, handleEditSave }) {
    return (
        <>
            <Modal
                open={editModalOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-task-modal"
                aria-describedby="edit-task-form"
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-task-modal" variant="h6" component="h2" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                        Edit Task
                    </Typography>

                    <TextField
                        fullWidth
                        label="Task Name"
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        sx={{ mb: 2 }}
                        variant="outlined"
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={editTaskPriority}
                            label="Priority"
                            onChange={(e) => setEditTaskPriority(e.target.value)}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={editTaskCategory}
                            label="Category"
                            onChange={(e) => setEditTaskCategory(e.target.value)}
                        >
                            <MenuItem value="work">Work</MenuItem>
                            <MenuItem value="personal">Personal</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleEditClose}
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleEditSave}
                            disabled={!editTaskName.trim()}
                            sx={{ borderRadius: 2 }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};