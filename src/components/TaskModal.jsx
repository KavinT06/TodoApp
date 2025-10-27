// src/components/TaskModal.jsx
// 🔹 NEW - Generic modal component for Add & Edit

import React, { useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 420 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

export default function TaskModal({ open, onClose, mode = 'add', taskData, setTaskData, onSave }) {
    // Populate modal fields when editing
    useEffect(() => {
        if (taskData) {
            // taskData expected shape: { name, priority, category, index }
            setTaskData(prev => ({ ...prev, name: taskData.name ?? '', priority: taskData.priority ?? 'low', category: taskData.category ?? 'work', index: taskData.index ?? null }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        // validate
        if (!taskData.name || !taskData.name.trim()) return;
        onSave({ name: taskData.name.trim(), priority: taskData.priority, category: taskData.category });
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="task-modal" aria-describedby="task-modal-form">
            <Box sx={modalStyle}>
                <Typography id="task-modal" variant="h6" component="h2" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                    {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
                </Typography>

                <TextField
                    fullWidth
                    label="Task Name"
                    name="name"
                    value={taskData.name || ''}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" value={taskData.priority || 'low'} label="Priority" onChange={handleChange}>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Category</InputLabel>
                    <Select name="category" value={taskData.category || 'work'} label="Category" onChange={handleChange}>
                        <MenuItem value="work">Work</MenuItem>
                        <MenuItem value="personal">Personal</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveClick} disabled={!taskData.name || !taskData.name.trim()} sx={{ borderRadius: 2 }}>
                        {mode === 'edit' ? 'Save Changes' : 'Add Task'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
