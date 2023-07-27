import React from 'react';
import { Container, Typography } from '@mui/material';
import Job from './Job';

const JobsList = ({ jobs }) => (

  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Typography
      variant="h3"
      component="h1"
      align="center"
      sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
      gutterBottom
    >
      Job Opportunities
    </Typography>

    { jobs?.length > 0 ? (
      jobs.map(({ id, title, company, location, description, salary_min, salary_max }) => (
        <Job key={ id }
          title={ title }
          company={ company?.display_name }
          location={ location?.display_name }
          description={ description }
          salary_min={ salary_min }
          salary_max={ salary_max }
        />
      ))
    ) : (
      <Typography variant="subtitle1" color="textSecondary" align="center">
        Sorry, no jobs found.
        But things will get better — keep grinding, friend.
      </Typography>
    ) }
  </Container>
);

export default JobsList;