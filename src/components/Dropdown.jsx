import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Dropdown({ label, value, onChange, options, name }) {
    return (
        <FormControl   sx={{ width: 120, marginX: 0.5 }}>
            <InputLabel>{label}</InputLabel>
            <Select 
                name={name}
                value={value} 
                label={label} 
                onChange={onChange}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
