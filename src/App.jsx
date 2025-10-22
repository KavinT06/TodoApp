import React from 'react';
import { Autocomplete } from '@mui/material';
import AutocompleteHint from './components/AutocompleteHint';

export default function App() {
    return (
        <>
            <h1 className='bg-green-200'>Todo App</h1>
            <AutocompleteHint />
        </>
    );
};