import React from 'react';
import { Container, Typography } from '@mui/material';
import Job from './Job';
import { getSavedJobs } from '../../server/controller/actions';

const JobsList = ({ jobs, handleSaveJob, handleDeleteSavedJob }) => (

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
      jobs.map((job) => (
        <Job
          key={ job.id }
          job={ job }
          saved={ savedJobs.some((savedJob) => savedJob.id === job.id) }
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