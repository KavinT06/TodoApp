import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function TodoTable({ todos, setTodos, toggle, handleEdit }) {
    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Slice todos for current page
    const paginatedTodos = todos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', margin: 2 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                        {paginatedTodos.map((item, index) => {
                            const actualIndex = page * rowsPerPage + index; // Correct index in full todos list

                            return (
                                <TableRow key={actualIndex} hover>
                                    <TableCell
                                        onClick={() => toggle(actualIndex)}
                                        sx={{
                                            textDecoration: item.strike ? 'line-through' : 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {item.name}
                                    </TableCell>
                                    <TableCell>{item.priority === "high" ? <Button variant="outlined" color="success">
                                        high
                                    </Button> : item.priority === "medium" ? <Button variant="outlined" color="info">
                                        medium
                                    </Button> : <Button variant="outlined" color="error">
                                        low
                                    </Button>}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    setTodos(todos.filter((_, todoIndex) => todoIndex !== actualIndex))
                                                }
                                            />
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleEdit(actualIndex)}
                                            />
                                            <div onClick={() => toggle(actualIndex)} style={{ cursor: 'pointer' }}>
                                                {item.strike ? (
                                                    <FontAwesomeIcon icon={faCircleXmark} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCircleCheck} />
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ✅ Pagination Component */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={todos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
