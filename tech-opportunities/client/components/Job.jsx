import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Job = ({ id, title, company, location, description, salary_min, salary_max }) => (

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
    </CardContent>
  </Card>
);

export default Job;