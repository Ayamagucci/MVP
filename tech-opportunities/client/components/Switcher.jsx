import React, { useState } from 'react';
import { Box, FormControl, Select, MenuItem } from '@mui/material';

const Switcher = ({ jobsToDisplay, setJobsToDisplay }) => (

  <Box display="flex" justifyContent="center">
    <FormControl>
      <Select
        value={ jobsToDisplay }
        onChange={ (e) => setJobsToDisplay(e.target.value) }
      >
        <MenuItem key="all" value="all">
          All
        </MenuItem>
        <MenuItem key="saved" value="saved">
          Saved
        </MenuItem>
      </Select>
    </FormControl>
  </Box>
);

export default Switcher;