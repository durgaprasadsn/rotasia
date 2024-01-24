import React, { useState, useRef } from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

export default function SelectBasic({ options, value, onChange, labelKey }) {
  const [val, setValue] = useState(value);
  const action = useRef(null);
  function operation(e, newValue) {
    console.log("Selected Project " + e, options[e.target.selectedIndex]);
    setValue(newValue);
    onChange(newValue);
  }
  return (
    <Box className="flex justify-center m-4" style={{padding: '0 16px'}}>
      <FormControl style={{ width: '700px', padding: '0 6px' }}>
            <Select
            action={action}
            value={val}
            placeholder="Select a Project"
            onChange={(e, newValue) => operation(e, newValue)}
            //   sx={{ minWidth: 50 }}
            >
            <Option value={null}>Select a Project</Option>
            {options.map((option, index) => (
            <Option key={index} value={option}>
                {option[labelKey]}
            </Option>
            ))}
            {/* <Option value="tesla">Tesla</Option>
            <Option value="bmw">BMW</Option>
            <Option value="bentley">Bentley</Option>
            <Option value="bugatti">Bugatti</Option> */}
            </Select>
        </FormControl>
    </Box>
  );
}