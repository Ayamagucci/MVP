import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

const Search = ({
  title,
  setTitle,
  location,
  setLocation,
  keywords,
  setKeywords,
  handleSearch,
  handleSubmit
}) => (

  <form onSubmit={ handleSubmit }>
    <Grid container spacing={ 2 }>
      <Grid item xs={ 12 } sm={ 6 }>
        <TextField
          label="Title"
          value={ title }
          onChange={ (e) => setTitle(e.target.value) }
          variant="outlined"
          fullWidth
        />
      </Grid>

      <Grid item xs={ 12 } sm={ 6 }>
        <TextField
          label="Zip Code"
          value={ location }
          onChange={ (e) => setLocation(e.target.value) }
          variant="outlined"
          fullWidth
        />
      </Grid>

      <Grid item xs={ 12 }>
        <TextField
          label="Keywords"
          value={ keywords }
          onChange={ (e) => setKeywords(e.target.value) }
          variant="outlined"
          fullWidth
        />
      </Grid>

      <Grid item xs={ 12 }>
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </Grid>
    </Grid>
  </form>
);

export default Search;