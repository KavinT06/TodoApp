import { React, useState, useEffect, useMemo } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import Dropdown from './components/Dropdown';
import Table from './components/Table';
import TaskModal from './components/TaskModal';

export default function App() {

    const [task, setTask] = useState('');
    const [todos, setTodos] = useState([]);
    const [filtered, setFiltered] = useState("all")
    const [priority, setPriority] = useState('low');
    const [category, setCategory] = useState('work');

    const [pendingFilCategory, setPendingFilCategory] = useState("all");
    const [pendingFilPriority, setPendingFilPriority] = useState("all");
    const [pendingFiltered, setPendingFiltered] = useState("all");

    const [filCategory, setFilCategory] = useState("all")
    const [filPriority, setFilPriority] = useState("all");
    const [activeFiltered, setActiveFiltered] = useState("all");

    const [editTaskId, setEditTaskId] = useState(null);
    const [search, setSearch] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    const [pendingSortBy, setPendingSortBy] = useState("none");
    const [pendingSortOrder, setPendingSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("none");
    const [sortOrder, setSortOrder] = useState("asc");

    const PRIORITY_INDEXES = { low: 1, medium: 2, high: 3 };

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos')
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos))
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    }, [todos, isLoaded])


    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'neutral',
    });


    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                const nextDirection =
                    prev.direction === 'asc'
                        ? 'desc'
                        : prev.direction === 'desc'
                            ? 'neutral'
                            : 'asc';
                return { key, direction: nextDirection };
            }
            return { key, direction: 'asc' }; // start with ascending
        });
    };


    // First, add originalIndex to todos before sorting
    const todosWithIndex = todos.map((item, index) => ({ ...item, originalIndex: index }));
    
    const sortedTodos = useMemo(() => {
        let sorted = [...todosWithIndex];
        if (sortConfig.direction === 'neutral' || !sortConfig.key) return sorted;

        if (sortConfig.key === 'serial') {
            // Sort by ID (creation time) - newer items have higher IDs
            sorted.sort((a, b) => {
                const aId = a.id || 0; // fallback for items without ID
                const bId = b.id || 0;
                return sortConfig.direction === 'asc' ? aId - bId : bId - aId;
            });
        } else if (sortConfig.key === 'name') {
            sorted.sort((a, b) => {
                if (sortConfig.direction === 'asc')
                    return a.name.localeCompare(b.name);
                else return b.name.localeCompare(a.name);
            });
        } else if (sortConfig.key === 'priority') {
            const priorityOrder = { low: 1, medium: 2, high: 3 };
            sorted.sort((a, b) => {
                if (sortConfig.direction === 'asc')
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                else return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } else if (sortConfig.key === 'category') {
            const categoryOrder = { personal: 1, work: 2 };
            sorted.sort((a, b) => {
                if (sortConfig.direction === 'asc')
                    return categoryOrder[a.category] - categoryOrder[b.category];
                else return categoryOrder[b.category] - categoryOrder[a.category];
            });
        }

        return sorted;
    }, [todosWithIndex, sortConfig]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'task':
                setTask(value);
                break;
            case 'priority':
                setPriority(value);
                break;
            case 'category':
                setCategory(value);
                break;
            default:
                break;
        }
    }


    const submitClick = () => {
        if (task.trim() !== '') {
            if (editTaskId !== null) {
                const updatedTasks = todos.map((item, index) => {
                    if (index === editTaskId) {
                        return {
                            ...item,
                            name: task,
                            category: category,
                            priority: priority,
                            strike: false
                        };
                    }
                    return item
                });
                setTodos(updatedTasks);
                setEditTaskId(null)
            } else {
                const newTask = {
                    id: Date.now(), // Add unique ID for serial sorting
                    name: task,
                    category: category,
                    priority: priority,
                    strike: false
                };
                setTodos([...todos, newTask])
            }
            setTask('')
        }
    }

    const applyFilters = () => {
        setFilCategory(pendingFilCategory);
        setFilPriority(pendingFilPriority);
        setActiveFiltered(pendingFiltered);
        setSortBy(pendingSortBy);
        setSortOrder(pendingSortOrder);
    }


    const [modalOpen, setModalOpen] = useState(false);             // modal open/close
    const [modalMode, setModalMode] = useState('add');             // 'add' | 'edit'
    const [modalTaskData, setModalTaskData] = useState({           // holds current form values
        name: '',
        priority: 'low',
        category: 'work',
        index: null // when editing, store originalIndex here
    });


    // 🔹 NEW — Open modal in Add mode
    const openAddModal = () => {
        setModalMode('add');
        setModalTaskData({ name: '', priority: 'low', category: 'work', index: null });
        setModalOpen(true);
    };

    // 🔹 NEW — Open modal in Edit mode with originalIndex (from Table)
    // Table will call openEditModal(originalIndex)
    const openEditModal = (originalIndex) => {
        const taskToEdit = todos[originalIndex];
        if (!taskToEdit) return;
        setModalMode('edit');
        setModalTaskData({
            name: taskToEdit.name,
            priority: taskToEdit.priority,
            category: taskToEdit.category,
            index: originalIndex
        });
        setModalOpen(true);
    };

    // 🔹 NEW — Save from modal (both add & edit)
    const handleModalSave = (formData) => {
        if (modalMode === 'add') {
            const newTask = {
                id: Date.now(), // Add unique ID for serial sorting
                name: formData.name,
                priority: formData.priority,
                category: formData.category,
                strike: false
            };
            setTodos(prev => [...prev, newTask]);
        } else {
            // edit mode
            const idx = modalTaskData.index;
            if (idx === null || idx === undefined) {
                setModalOpen(false);
                return;
            }
            setTodos(prev => prev.map((item, i) => i === idx ? { ...item, name: formData.name, priority: formData.priority, category: formData.category } : item));
        }
        setModalOpen(false);
    };



    const handleEdit = (originalIndex) => {
        const taskToEdit = todos[originalIndex];
        if (taskToEdit) {
            setTask(taskToEdit.name);
            setCategory(taskToEdit.category);
            setPriority(taskToEdit.priority);
            setEditTaskId(originalIndex);
        }
    }

    const handleDelete = (originalIndex) => {
        setTodos(prev => prev.filter((_, idx) => idx !== originalIndex));
    }

    const toggle = (originalIndex) => {
        setTodos(
            todos.map((item, index) => {
                return index === originalIndex ? { ...item, strike: !item.strike } : item
            })
        )
    }

    let filteredTodos = sortedTodos
        .filter((item) => {
            if (activeFiltered === "complete") return item.strike;
            if (activeFiltered === "uncomplete") return !item.strike;
            return true;
        })
        .filter((item) => {
            if (filCategory === "work") return item.category === "work"
            if (filCategory === "personal") return item.category === "personal"
            return true;
        })
        .filter((item) => {
            if (filPriority === "low") return item.priority === "low"
            if (filPriority === "medium") return item.priority === "medium"
            if (filPriority === "high") return item.priority === "high"
            return true;
        })
        .filter((item) => {
            if (!search.trim()) return true;
            return item.name.toLowerCase().includes(search.trim().toLowerCase());
        });

    // Apply dropdown-based sorting only if table header sorting is neutral
    if (sortConfig.direction === 'neutral' || !sortConfig.key) {
        filteredTodos = [...filteredTodos].sort((a, b) => {
            if (sortBy === "none") return 0;

            let comparison = 0;
            if (sortBy === "task") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === "priority") {
                comparison = PRIORITY_INDEXES[a.priority] - PRIORITY_INDEXES[b.priority];
            } else if (sortBy === "category") {
                comparison = a.category.localeCompare(b.category);
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    }

    const markComplete = () => {
        const updatedTodos = todos.map((item) => {
            return item !== filtered && item !== "complete" ? { ...item, strike: true } : item;
        })
        setTodos(updatedTodos)
    }

    const workCount = todos.filter(item => item.category === "work").length;
    const personalCount = todos.filter(item => item.category === "personal").length;
    const lowCount = todos.filter(item => item.priority === "low").length;
    const mediumCount = todos.filter(item => item.priority === "medium").length;
    const highCount = todos.filter(item => item.priority === "high").length;
    const completedCount = todos.filter(item => item.strike).length;
    const uncompletedCount = todos.filter(item => !item.strike).length;
    const totalCount = todos.length;


    return (
        <>
            <h1 className='text-4xl text-center bg-gray-200 h-12 font-inter'>Todo App</h1>
            <div className='lg:mx-auto lg:max-w-full py-8 p-6 lg:px-16'>
                {/* <div className='flex flex-wrap md:flex-nowrap items-center justify-center gap-5 md:gap-0'>
                    <div className='md:w-96 md:my-5 md:mx-5'>
                        <TextField id="outlined-basic" label="Enter Tasks..." name="task" variant="outlined" className='w-72' value={task} onChange={handleChange} onKeyDown={(e) => {
                            if (task.trim() !== '' && e.key === 'Enter') {
                                submitClick()
                            }
                        }} required />
                    </div>
                    <div className='flex flex-wrap justify-center md:flex-nowrap items-center gap-y-3 mb-5'>
                        <Dropdown
                            label="Priority"
                            value={priority}
                            name="priority"
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (priority.trim() !== '' && e.key === 'Enter') {
                                    submitClick()
                                }
                            }}
                            options={[
                                { label: "low", value: "low" },
                                { label: "medium", value: "medium" },
                                { label: "high", value: "high" },
                            ]}

                        />
                        <Dropdown
                            label="Category"
                            name="category"
                            value={category}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (category.trim() !== '' && e.key === 'Enter') {
                                    submitClick()
                                }
                            }}
                            options={[
                                { label: "Work", value: "work" },
                                { label: "Personal", value: "personal" },
                            ]}
                        />
                        <div className='ml-4'>
                            <Button variant="contained" disableElevation color="primary" onClick={submitClick}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div> */}
                <div className='flex flex-wrap xl:flex-nowrap items-center justify-center md:gap-5 gap-y-5'>
                    <div >
                        <TextField id="outlined-basic" label="Search Tasks" variant="outlined" className='w-64' value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div>
                        {/* <p className='text-center'>Priority</p> */}
                        <Dropdown
                            label="Priority"
                            value={pendingFilPriority}
                            onChange={(e) => setPendingFilPriority(e.target.value)}
                            options={[
                                { label: `all (${totalCount})`, value: "all" },
                                { label: `low (${lowCount})`, value: "low" },
                                { label: `medium (${mediumCount})`, value: "medium" },
                                { label: `high (${highCount})`, value: "high" },
                            ]}
                        />
                    </div>
                    <div>
                        {/* <p className='text-center'>Category</p> */}
                        <Dropdown
                            label="Category"
                            value={pendingFilCategory}
                            onChange={(e) => setPendingFilCategory(e.target.value)}
                            options={[
                                { label: `all (${totalCount})`, value: "all" },
                                { label: `Work (${workCount})`, value: "work" },
                                { label: `Personal (${personalCount})`, value: "personal" },
                            ]}
                        />
                    </div>
                    <div>
                        {/* <p className='text-center'>Status</p> */}
                        <Dropdown
                            label="Status"
                            value={pendingFiltered}
                            onChange={(e) => setPendingFiltered(e.target.value)}
                            options={[
                                { label: `all (${totalCount})`, value: "all" },
                                { label: `Completed (${completedCount})`, value: "complete" },
                                { label: `Uncompleted (${uncompletedCount})`, value: "uncomplete" },
                            ]}
                        />
                    </div>
                    {/* <div>
                        <Dropdown
                            label="Sort"
                            value={pendingSortBy}
                            onChange={(e) => setPendingSortBy(e.target.value)}
                            options={[
                                { label: "Timestamp", value: "none" },
                                { label: "Task", value: "task" },
                                { label: "Priority", value: "priority" },
                                { label: "Category", value: "category" },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            label="Order By"
                            value={pendingSortOrder}
                            onChange={(e) => setPendingSortOrder(e.target.value)}
                            options={[
                                { label: "Ascending", value: "asc" },
                                { label: "Descending", value: "desc" },
                            ]}
                        />
                    </div> */}
                    <Button variant="contained" disableElevation color="secondary" onClick={applyFilters} className='md:h-12'>
                        Apply Filters
                    </Button>
                </div>
                <div className='flex items-center justify-center lg:my-5 md:px-52 lg:px-0 md:py-5 lg:py-2 xl:py-4 md:gap-5 lg:gap-15 gap-2 my-5'>
                    <Button variant="contained" disableElevation color="success" onClick={markComplete} className=''>
                        Mark All Complete
                    </Button>
                    <Button variant="contained" disableElevation color="error" onClick={() => {
                        setTodos(todos.filter((item, index) => {
                            return !item.strike
                        }))
                    }}>
                        Delete All Complete
                    </Button>
                </div>
                <Table 
                    todos={filteredTodos} 
                    onOpenAdd={openAddModal} 
                    onOpenEdit={openEditModal} 
                    onDelete={handleDelete} 
                    onToggle={toggle}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                />
                <TaskModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    mode={modalMode}
                    taskData={modalTaskData}
                    setTaskData={setModalTaskData}
                    onSave={handleModalSave}
                />
            </div>
        </>
    );
};