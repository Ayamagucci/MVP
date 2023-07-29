import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Job = ({ id, title, company, location, description, salary_min, salary_max, userId, setSavedJobs }) => {

  const handleSave = async(jobData) => {
    try {
      await axios.post('/api/jobs/save', { userId, jobData });

      console.dir(jobData);

      const query = await axios.get(`/api/jobs/saved/${ userId }`);
      setSavedJobs(query.data.savedJobs);

    } catch(err) {
      console.error(`Error saving job: ${ err.message }`);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" color="textPrimary">
          { title }
        </Typography>

        <Typography variant="subtitle1" color="textSecondary" align="right">
          <LocationOnIcon fontSize="small" /> { location }
        </Typography>

        <Typography variant="subtitle2" color="textSecondary">
          { company }
        </Typography>

        { salary_min && salary_max ? (
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Salary:</strong> ${ salary_min } — { salary_max } per year
          </Typography>
        ) : null }

        <Typography variant="body2" sx={{ mt: 2 }}>
          { description }
        </Typography>

        <Button onClick={ () => handleSave({
          id, title, company, location,
          description, salary_min, salary_max
        }) }>
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

export default Job;