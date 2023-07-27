const { API_URL, API_ID, API_KEY } = process.env;
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import Search from './Search';
import JobsList from './JobsList';
import Nav from './Nav';
import CountSetter from './CountSetter';

const App = () => {

  const [ jobs, setJobs ] = useState([]);

  const [ page, setPage ] = useState(1);
  const [ count, setCount ] = useState(10);

  const [ title, setTitle ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ keywords, setKeywords ] = useState('');

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        app_id: API_ID,
        app_key: API_KEY,
        results_per_page: count,
        page: page
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

      const queryRes = await axios({
        method: 'get',
        baseURL: `https://api.adzuna.com/v1/api/jobs/us/search`,
        params: queryParams,
      });
      setJobs(queryRes.data.results);

      console.log(`JOBS (client): ${JSON.stringify(queryRes.data.results)}`);

      setTitle('');
      setLocation('');
      setKeywords('');

    } catch (err) {
      console.error(`Error fetching jobs: ${err}`);
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

  /*
  const locateUser = () => {
    const { geolocation } = navigator;

    if (geolocation) {
      geolocation.getCurrentPosition(
        async(position) => {
          const { latitude, longitude } = position.coords;

          try {
            const locationRes = await axios.get(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ latitude }&longitude=${ longitude }&localityLanguage=en`
            );

            const { city, postalCode } = locationRes.data;
            console.log(`LOCATION: ${ JSON.stringify(locationRes.data) }`);

            setLocation(postalCode);
            handleSearch();

          } catch (err) {
            console.error(`Error fetching location: ${err}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    (async() => {
      try {
        await locateUser();
        await handleSearch();

      } catch(err) {
        console.log(`Error fetching on load: ${ err }`);
      }
    })();
  }, []);
  */

  useEffect(() => {
    fetchGeolocation();

    if (geolocation) {
      handleSearch();
    }

  }, [ geolocation ]);

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

      <JobsList jobs={ jobs } />

      <CountSetter
        count={ count }
        setCount={ setCount }
        changeCount={ changeCount }
      />
    </Box>
  );
};

export default App;