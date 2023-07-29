import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

const Switcher = ({ jobsDisplayed, setJobsDisplayed }) => {
  // const [ option, setOption ] = useState('all');

  return (
    <FormControl>
      <Select
        // label="selectJobsDisplayed"
        value={ jobsDisplayed }
        onChange={ (e) => setJobsDisplayed(e.target.value) }
      >
        <MenuItem key="all" value="all">
          All
        </MenuItem>
        <MenuItem key="saved" value="saved">
          Saved
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default Switcher;