import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Textography } from '@mui/material';

export default function App() {
  return (
    <Box>
      <Textography variant="title">What's good in the hood, fam?</Textography>
    </Box>
  );
};

ReactDOM.createRoot(
  document.getElementById('app')

).render(<App />);