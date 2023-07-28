const { API_URL, API_ID, API_KEY } = process.env;
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import Search from './Search';
import JobsList from './JobsList';
import Nav from './Nav';
import CountSetter from './CountSetter';
import Categories from './Categories';

import { v4 as uuidv4 } from 'uuid';

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

// const App = () => {

//   const [ jobs, setJobs ] = useState([]);
//   const [ page, setPage ] = useState(1);
//   const [ count, setCount ] = useState(10);
//   const [ title, setTitle ] = useState('');
//   const [ keywords, setKeywords ] = useState('');
//   const [ categories, setCategories ] = useState([]);
//   // const [ location, setLocation ] = useState('');
//   // const [ geolocation, setGeolocation ] = useState(null);

//   // SAVED JOBS
//   const [ userId, setUserId ] = useState('');
//   const [ savedJobs, setSavedJobs ] = useState([]);

//   useEffect(() => {
//     const cachedUserId = localStorage.getItem('userId');

//     if (cachedUserId) {
//       setUserId(cachedUserId);

//     } else {
//       const newUserId = window.crypto.randomUUID();

//       setUserId(newUserId);
//       setSavedJobs()

//       localStorage.setItem('userId', newUserId);
//     }

//     fetchCategories();
//     /*
//     fetchGeolocation();

//     if (geolocation) {
//       handleSearch();
//     }
//     */
//   }, [/* geolocation */]);

//   const handleSaveJob = async(job) => {
//     try {
//       // send req to save job
//       const res = await axios.post('/api/jobs/save', {
//         userId: 'YOUR_USER_ID', // replace w/ user ID
//         jobData: job
//       });

//       // If the job was saved successfully, update the savedJobs state
//       if (res.data.message === 'Job saved successfully') {
//         setSavedJobs([ ...savedJobs, job ]);
//       }

//     } catch(err) {
//       console.error(`Error saving job: ${ err }`);
//     }
//   };

//   const handleDeleteSavedJob = async(jobId) => {
//     try {
//       // send req to delete saved job
//       const res = await axios.delete(`/api/jobs/delete/${ userId }/${ jobId }`);

//       // job deleted successfully —> update savedJobs state
//       if (res.data.message === 'Job removed from saved list') {
//         setSavedJobs(
//           savedJobs.filter((job) => job.id !== jobId)
//         );
//       }
//     } catch(err) {
//       console.error(`Error deleting saved job: ${ err }`);
//     }
//   };

//   const fetchGeolocation = async() => {
//     const { geolocation } = navigator;

//     if (geolocation) {
//       try {
//         const position = await new Promise((resolve, reject) => {
//           geolocation.getCurrentPosition(resolve, reject);
//         });

//         const { latitude, longitude } = position.coords;

//         const locationRes = await axios.get(
//           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ latitude }&longitude=${ longitude }&localityLanguage=en`
//         );

//         const { postalCode } = locationRes.data;
//         setGeolocation(postalCode);

//       } catch(err) {
//         console.error(`Error fetching location: ${ err.message }`);
//       }
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const queryParams = new URLSearchParams({
//         app_id: API_ID,
//         app_key: API_KEY,
//         results_per_page: count,
//         'content-type': 'application/json'
//       });

//       const constructWhat = (jobTitle, searchTerms) => {
//         let titleParam = '';
//         let keywordsParam = '';

//         if (jobTitle) {
//           titleParam = jobTitle
//             .trim().toLowerCase() // standardize
//             .split(' ').join('%20'); // convert spaces
//         }

//         if (searchTerms) {
//           // NOTE: space-delimited only
//           keywordsParam = searchTerms
//             .trim().toLowerCase() // standardize
//             .split(' ').join('%20'); // convert spaces
//         }

//         return (titleParam && keywordsParam)
//           ? (`${ titleParam }%20${ keywordsParam }`)
//           : (titleParam || keywordsParam);
//       };

//       const whatParam = constructWhat(title, keywords);
//       if (whatParam) {
//         queryParams.append('what', whatParam);
//       }

//       if (location) {
//         queryParams.append('location', location);
//       }

//       const queryRes = await axios({
//         method: 'get',
//         baseURL: `https://api.adzuna.com/v1/api/jobs/us/search/1`,
//         params: queryParams,
//       });
//       setJobs(queryRes.data.results);

//       setTitle('');
//       setLocation('');
//       setKeywords('');

//     } catch (err) {
//       console.error(`Error fetching jobs: ${err}`);
//     }
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     try {
//       await handleSearch();

//     } catch(err) {
//       console.error(`Error submitting user input: ${ err }`);
//     }
//   };

//   const fetchCategories = async() => {
//     try {
//       const categoryQuery = axios({
//         method: 'get',
//         url: '/jobs/us/categories',
//         baseURL: API_URL,
//         params: { app_id: API_ID, app_key: API_KEY }
//       });
//       setCategories(categoryQuery.results);

//     } catch(err) {
//       console.error(`Error fetching categories: ${ err.message }`);
//     }
//   };

//   const [ startIndex, setStartIndex ] = useState(0);

//   const handlePageChange = (direction) => {
//     setPage((prevPage) => {
//       const newPage = (direction === 'next')
//         ? (prevPage + 1)
//         : (prevPage - 1);

//       // update startIndex for pagination
//       setStartIndex((newPage - 1) * count);

//       return newPage;
//     });
//   };

//   const changeCount = (e) => {
//     const newCount = e.target.value;
//     setCount(newCount);

//     // reset page num to 1 when count changes
//     setPage(1);

//     // reset startIndex to 0 when count changes
//     setStartIndex(0);
//   };

//   return (
//     <Box sx={{ mt: 2 }}>
//       <Search
//         title={ title }
//         setTitle={ setTitle }
//         location={ location }
//         setLocation={ setLocation }
//         keywords={ keywords }
//         setKeywords={ setKeywords }
//         handleSearch={ handleSearch }
//         handleSubmit={ handleSubmit }
//       />

//       <Nav
//         page={ page }
//         count={ count }
//         jobs={ jobs }
//         handlePageChange={ handlePageChange }
//       />

//       <Categories
//         categories={ categories }
//         jobs={ jobs }
//         setJobs={ setJobs }
//       />

//       <JobsList
//         jobs={ jobs }
//         handleSaveJob={ handleSaveJob }
//         handleDeleteSavedJob={ handleDeleteSavedJob }
//       />

//       <CountSetter
//         count={ count }
//         setCount={ setCount }
//         changeCount={ changeCount }
//       />
//     </Box>
//   );
// };

export default App;