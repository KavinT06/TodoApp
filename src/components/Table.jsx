import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function TodoTable({ todos, setTodos, toggle, handleEdit }) {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', margin: 2 }}>
            <TableContainer>
                <Table stickyHeader aria-label="todo table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Task</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.map((item, index) => (
                            <TableRow key={index} hover>
                                <TableCell
                                    onClick={() => toggle(index)}
                                    sx={{ textDecoration: item.strike ? 'line-through' : 'none', cursor: 'pointer' }}
                                >
                                    {item.name}
                                </TableCell>
                                <TableCell>{item.priority}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                setTodos(todos.filter((_, todoIndex) => todoIndex !== index))
                                            }
                                        />
                                        <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEdit(index)}
                                        />
                                        <div onClick={() => toggle(index)} style={{ cursor: 'pointer' }}>
                                            {item.strike ? <FontAwesomeIcon icon={faCircleXmark} /> : <FontAwesomeIcon icon={faCircleCheck} />}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
