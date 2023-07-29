const { API_URL, API_ID, API_KEY } = process.env;
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import Search from './Search';
import JobsList from './JobsList';
import Nav from './Nav';
import CountSetter from './CountSetter';
import Switcher from './Switcher';

const App = () => {

  const [ jobs, setJobs ] = useState([]);
  const [ jobsDisplayed, setJobsDisplayed ] = useState('all');

  const [ page, setPage ] = useState(1);
  const [ count, setCount ] = useState(10);

  const [ title, setTitle ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ keywords, setKeywords ] = useState('');

  // SAVED JOBS
  const [ userId, setUserId ] = useState(
    (localStorage.getItem('id') || '')
  );
  const [ savedJobs, setSavedJobs ] = useState([]);

  useEffect(() => {
    const getUserId = () => {
      let id = localStorage.getItem('id');

      if (!id) {
        id = String(window.crypto.randomUUID());
        localStorage.setItem('id', id);
      }

      return id;
    };

    const cookieId = getUserId();
    setUserId(cookieId);

    const fetchSavedJobs = async() => {
      try {
        const query = await axios.get(`/api/jobs/saved/${ userId }`);
        setSavedJobs(query.data.savedJobs);

      } catch(err) {
        console.error(`Error fetching saved jobs: ${ err.message }`);
      }
    };

    fetchSavedJobs();

  }, [ count, page ]);

  const handleSearch = async() => {
    try {
      const queryParams = new URLSearchParams({
        app_id: API_ID,
        app_key: API_KEY,
        results_per_page: count
      });

      const constructWhat = (jobTitle, searchTerms) => {
        let titleParam = '';
        let keywordsParam = '';

        if (jobTitle) {
          titleParam = jobTitle
            .trim().toLowerCase() // standardize
            .split(' ').join('%20'); // convert spaces
        }

        if (searchTerms) {
          // NOTE: space-delimited only
          keywordsParam = searchTerms
            .trim().toLowerCase() // standardize
            .split(' ').join('%20'); // convert spaces
        }

        return (titleParam && keywordsParam)
          ? (`${ titleParam }%20${ keywordsParam }`)
          : (titleParam || keywordsParam);
      };

      const whatParam = constructWhat(title, keywords);
      if (whatParam) {
        queryParams.append('what', whatParam);
      }

      if (location) {
        queryParams.append('location', location);
      }

      queryParams.append('content-type', 'application/json');

      const query = await axios({
        method: 'get',
        baseURL: 'https://api.adzuna.com/v1/api/jobs/us/search/1',
        params: queryParams,
      });

      setJobs(query.data.results);
      console.dir(query.data.results)

      setTitle('');
      setLocation('');
      setKeywords('');

    } catch(err) {
      console.error(`Error fetching jobs: ${ err }`);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await handleSearch();

    } catch(err) {
      console.error(`Error submitting user input: ${ err }`);
    }
  };

  const [ startIndex, setStartIndex ] = useState(0);

  const handlePageChange = (direction) => {
    setPage((prevPage) => {
      const newPage = (direction === 'next')
        ? (prevPage + 1)
        : (prevPage - 1);

      // update startIndex for pagination
      setStartIndex((newPage - 1) * count);

      return newPage;
    });
  };

  const changeCount = (e) => {
    const newCount = e.target.value;
    setCount(newCount);

    // reset page num to 1 when count changes
    setPage(1);

    // reset startIndex to 0 when count changes
    setStartIndex(0);
  };

  const [ geolocation, setGeolocation ] = useState(null);

  const fetchGeolocation = async() => {
    const { geolocation } = navigator;

    if (geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const locationRes = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ latitude }&longitude=${ longitude }&localityLanguage=en`
        );

        const { postalCode } = locationRes.data;
        setGeolocation(postalCode);

      } catch (err) {
        console.error(`Error fetching location: ${ err.response.data }`);
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Search
        title={ title }
        setTitle={ setTitle }
        location={ location }
        setLocation={ setLocation }
        keywords={ keywords }
        setKeywords={ setKeywords }
        handleSearch={ handleSearch }
        handleSubmit={ handleSubmit }
      />

      <Nav
        page={ page }
        count={ count }
        jobs={ jobs }
        handlePageChange={ handlePageChange }
      />

      <Switcher
        jobsDisplayed={ jobsDisplayed }
        setJobsDisplayed={ setJobsDisplayed }
      />

      <JobsList
        jobs={ jobs }
        userId={ userId }
        setSavedJobs={ setSavedJobs }
      />

      <CountSetter
        count={ count }
        setCount={ setCount }
        changeCount={ changeCount }
      />
    </Box>
  );
};

export default App;