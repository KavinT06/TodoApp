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
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '16px 8px' }}>
            <Paper sx={{ 
                width: { xs: '100%', sm: '95%', md: '90%', lg: '85%', xl: '80%' }, 
                maxWidth: '1200px',
                overflow: 'hidden', 
                margin: { xs: 1, sm: 1.5, md: 2 },
                borderRadius: 3,
                boxShadow: { xs: 2, md: 4 },
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
                <TableContainer sx={{ 
                    maxHeight: { xs: 300, sm: 350, md: 440, lg: 500 },
                    borderRadius: 3,
                    overflowX: { xs: 'hidden', sm: 'auto' }
                }}>
                <Table stickyHeader aria-label="todo table" size="small" sx={{
                    tableLayout: { xs: 'fixed', sm: 'auto' },
                    width: '100%'
                }}>
                    <TableHead>
                        <TableRow sx={{ 
                            backgroundColor: { xs: '#f5f5f5', md: '#fafafa' },
                            '& .MuiTableCell-head': {
                                fontWeight: 600,
                                color: '#1976d2'
                            }
                        }}>
                            <TableCell sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                padding: { xs: '8px 4px', md: '16px' },
                                width: { xs: '15%', sm: 'auto' }
                            }}>S.No</TableCell>
                            <TableCell sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                padding: { xs: '8px 4px', md: '16px' },
                                width: { xs: '35%', sm: 'auto' }
                            }}>Task</TableCell>
                            <TableCell sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                padding: { xs: '8px 4px', md: '16px' },
                                width: { xs: '20%', sm: 'auto' }
                            }}>Priority</TableCell>
                            <TableCell sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                padding: { xs: '8px 4px', md: '16px' },
                                width: { xs: '15%', sm: 'auto' }
                            }}>Category</TableCell>
                            <TableCell sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                padding: { xs: '8px 4px', md: '16px' }, 
                                textAlign: 'center',
                                width: { xs: '15%', sm: 'auto' }
                            }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedTodos.map((item, index) => {
                            // Use the originalIndex from filtered todos, or fall back to calculated index
                            const originalIndex = item.originalIndex !== undefined ? item.originalIndex : (page * rowsPerPage + index);

                            return (
                                <TableRow key={originalIndex} hover sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        transform: 'scale(1.01)',
                                        transition: 'all 0.2s ease-in-out'
                                    }
                                }}>
                                    <TableCell sx={{ 
                                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                        padding: { xs: '8px 4px', md: '16px' },
                                        width: { xs: '15%', sm: 'auto' }
                                    }}>{index + 1+"."}</TableCell>
                                    <TableCell
                                        onClick={() => toggle(originalIndex)}
                                        sx={{
                                            textDecoration: item.strike ? 'line-through' : 'none',
                                            cursor: 'pointer',
                                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' },
                                            padding: { xs: '8px 4px', md: '16px' },
                                            width: { xs: '35%', sm: 'auto' },
                                            maxWidth: { xs: '35%', sm: '150px', md: 'auto' },
                                            wordBreak: 'break-word',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: { xs: 'nowrap', sm: 'normal' },
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                transition: 'background-color 0.2s',
                                                whiteSpace: 'normal'
                                            }
                                        }}
                                        title={item.name}
                                    >
                                        {item.name}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                        padding: { xs: '8px 4px', md: '16px' },
                                        width: { xs: '20%', sm: 'auto' }
                                    }}>{item.priority === "high" ? <Button variant="outlined" color="success" size="small" sx={{
                                        fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem' },
                                        borderRadius: 2,
                                        textTransform: 'capitalize',
                                        minWidth: { xs: '40px', sm: '60px' },
                                        padding: { xs: '2px 4px', sm: '4px 8px' }
                                    }}>
                                        high
                                    </Button> : item.priority === "medium" ? <Button variant="outlined" color="info" size="small" sx={{
                                        fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem' },
                                        borderRadius: 2,
                                        textTransform: 'capitalize',
                                        minWidth: { xs: '40px', sm: '60px' },
                                        padding: { xs: '2px 4px', sm: '4px 8px' }
                                    }}>
                                        medium
                                    </Button> : <Button variant="outlined" color="error" size="small" sx={{
                                        fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem' },
                                        borderRadius: 2,
                                        textTransform: 'capitalize',
                                        minWidth: { xs: '40px', sm: '60px' },
                                        padding: { xs: '2px 4px', sm: '4px 8px' }
                                    }}>
                                        low
                                    </Button>}</TableCell>
                                    <TableCell sx={{ 
                                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }, 
                                        padding: { xs: '8px 4px', md: '16px' },
                                        width: { xs: '15%', sm: 'auto' },
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }} title={item.category}>{item.category}</TableCell>
                                    <TableCell sx={{ 
                                        padding: { xs: '8px 4px', md: '16px' }, 
                                        textAlign: 'center',
                                        width: { xs: '15%', sm: 'auto' }
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: { xs: '4px', sm: '8px' }[0], 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            flexDirection: { xs: 'column', sm: 'row' }[0]
                                        }}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                style={{ 
                                                    cursor: 'pointer',
                                                    marginRight: "2px",
                                                    fontSize: '0.8rem',
                                                    color: '#d32f2f',
                                                    transition: 'all 0.2s ease',
                                                    ':hover': {
                                                        transform: 'scale(1.1)',
                                                        color: '#b71c1c'
                                                    }
                                                }}
                                                onClick={() => {
                                                    // Use setTodos to delete from the original todos array using originalIndex
                                                    setTodos(prevTodos => {
                                                        const newTodos = prevTodos.filter((_, todoIndex) => todoIndex !== originalIndex);
                                                        return newTodos;
                                                    });
                                                    // Reset to first page if current page becomes empty
                                                    const newFilteredLength = todos.length - 1;
                                                    const newPageCount = Math.ceil(newFilteredLength / rowsPerPage);
                                                    if (page >= newPageCount && newPageCount > 0) {
                                                        setPage(newPageCount - 1);
                                                    } else if (newFilteredLength === 0) {
                                                        setPage(0);
                                                    }
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    fontSize: '0.8rem',
                                                    color: '#1976d2',
                                                    transition: 'all 0.2s ease',
                                                    marginRight: "1px"
                                                }}
                                                onClick={() => handleEdit(originalIndex)}
                                            />
                                            <div onClick={() => toggle(originalIndex)} style={{ cursor: 'pointer' }}>
                                                {item.strike ? (
                                                    <FontAwesomeIcon icon={faCircleXmark} style={{ 
                                                        fontSize: '0.8rem',
                                                        color: '#f57c00',
                                                        transition: 'all 0.2s ease'
                                                    }} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCircleCheck} style={{ 
                                                        fontSize: '0.8rem',
                                                        color: '#388e3c',
                                                        transition: 'all 0.2s ease'
                                                    }} />
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
    </div>
    );
}
