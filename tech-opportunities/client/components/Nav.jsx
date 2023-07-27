import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import JobsList from './JobsList';

const Nav = ({ handlePrevPage, handleNextPage, page, count, jobs }) => {

  const totalPages = Math.ceil(jobs?.length / count);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 10 }}>
      <Button
        variant="contained"
        onClick={ handlePrevPage }
        disabled={ page === 1 }
        sx={{ mr: '10px' }}
      >
        Prev
      </Button>

      <Button
        variant="contained"
        onClick={ handleNextPage }
        disabled={ jobs?.length === 0 || page === totalPages }
        sx={{ ml: '10px' }}
      >
        Next
      </Button>
    </Box>
  );
};

export default Nav;