import React, { useState } from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';

const Categories = ({ categories, jobs, setJobs }) => {

  const [ selectedCategory, setSelectedCategory ] = useState('');

  const changeCategory = (e) => {
    const categoryId = e.target.value;

    if (categoryId === 'all') {
      setJobs(jobs);

    } else {
      const validJobs = jobs.filter((job) => {
        const { id } = job.category;
        return id === categoryId;
      });
      setJobs(validJobs);
    }
    setSelectedCategory(categoryId);
  };

  return (
    <FormControl>
      <Select
        label="Category"
        value={ selectedCategory }
        onChange={ changeCategory }
      >
        <MenuItem key="all" value="all">
          All
        </MenuItem>

        { categories?.map((category) => (
          <MenuItem key={ category } value={ category }>
            { category }
          </MenuItem>
        )) }
      </Select>
    </FormControl>
  );
};

export default Categories;