import React from 'react';
import { Box, Select, FormControl, MenuItem } from '@mui/material';

const CountSetter = ({ count, setCount }) => {

  const maxCountOptions = [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 ];

  return (
    <Box display="flex" justifyContent="center" mb={ 2 }>
      <FormControl>
        <Select
          label="Count"
          value={ count }
          onChange={ (e) => setCount(e.target.value) }
        >
          { maxCountOptions.map((maxCount) => (
            <MenuItem key={ maxCount } value={ maxCount }>
              { maxCount }
            </MenuItem>
          )) }
        </Select>
      </FormControl>
    </Box>
  );
}

export default CountSetter;