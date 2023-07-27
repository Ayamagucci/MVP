const { API_ID, API_KEY } = process.env;
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

  const handleSearch = async() => {

    try {
      const queryParams = new URLSearchParams({
        app_id: API_ID,
        app_key: API_KEY,
        results_per_page: count
      });

      const constructWhat = (jobTitle, searchTerms) => {
        const titleParam = jobTitle
          ? jobTitle.trim().toLowerCase().split(' ').join('%20')
          : null;

        const keywordsParam = searchTerms
          ? searchTerms.trim().toLowerCase().split(' ').join('%20') // NOTE: space-delimited only
          : null;

        return titleParam && keywordsParam
          ? `${ titleParam }%20${ keywordsParam }`
          : titleParam || keywordsParam;
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
        baseURL: `https://api.adzuna.com/v1/api/jobs/us/search/1`,
        params: queryParams
      });
      setJobs(queryRes.data.results);

      console.log(`JOBS (client): ${ JSON.stringify(queryRes.data.results) }`);

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
            const { city, /* countryName */ } = locationRes.data;

            setLocation(city);
            handleSearch();

          } catch (err) {
            console.error(`Error fetching location: ${err}`);
          }
        }
      );
    }
  };

  const handlePrevPage = () => {
    setPage((page) => page - 1);
  };
  const handleNextPage = () => {
    setPage((page) => page + 1);
  };

  // fetch all jobs on initial load
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
        handlePrevPage={ handlePrevPage }
        handleNextPage={ handleNextPage }
        page={ page }
        count={ count }
        jobs={ jobs }
      />

      <JobsList jobs={ jobs } />

      <CountSetter count={ count } setCount={ setCount } />
    </Box>
  );
};

export default App;

/*
For added context:

When the following request URL is sent:
https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=87a351c3&app_key=ce8d58e6a5b5b59b99081090776f9ca1&results_per_page=10

The results are the following (per the documentation on their site):
{"mean":68627.35,"count":7084626,"__CLASS__":"Adzuna::API::Response::JobSearchResults","results":[{"salary_max":61436.46,"title":"Registered Nurse (RN) - Part Time","id":"4224038243","created":"2023-07-26T00:39:45Z","category":{"label":"Part time Jobs","__CLASS__":"Adzuna::API::Response::Category","tag":"part-time-jobs"},"company":{"__CLASS__":"Adzuna::API::Response::Company","display_name":"Gale Healthcare"},"salary_min":61436.46,"salary_is_predicted":"1","latitude":39.39427,"longitude":-76.52358,"description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJzIjoiUEUxRmRFWXM3aEdrc21WQ183ZWVQUSIsImkiOiI0MjI0MDM4MjQzIn0.nAWC0CRoyLC6yMT9lBaf-s02ElxiDvsfS5l7g7-_nDw","redirect_url":"https://www.adzuna.com/details/4224038243?utm_medium=api&utm_source=87a351c3","location":{"display_name":"Carney, Baltimore County","__CLASS__":"Adzuna::API::Response::Location","area":["US","Maryland","Baltimore County","Carney"]},"__CLASS__":"Adzuna::API::Response::Job"},{"salary_max":49456.25,"title":"Registered Nurse (RN) - Contract Basis","company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"latitude":39.038318,"salary_min":49456.25,"salary_is_predicted":"1","id":"4224037816","created":"2023-07-26T00:39:40Z","category":{"tag":"healthcare-nursing-jobs","__CLASS__":"Adzuna::API::Response::Category","label":"Healthcare & Nursing Jobs"},"description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJzIjoiUEUxRmRFWXM3aEdrc21WQ183ZWVQUSIsImkiOiI0MjI0MDM3ODE2In0.gnEiAYafp7_cO8_RfzbgFaiCLBsH-dAgiJBUUkoYSjU","longitude":-76.441124,"__CLASS__":"Adzuna::API::Response::Job","redirect_url":"https://www.adzuna.com/details/4224037816?utm_medium=api&utm_source=87a351c3","location":{"__CLASS__":"Adzuna::API::Response::Location","area":["US","Maryland","Anne Arundel County","Cape Saint Claire"],"display_name":"Cape Saint Claire, Anne Arundel County"}},{"redirect_url":"https://www.adzuna.com/details/4224038876?utm_medium=api&utm_source=87a351c3","location":{"display_name":"Glen Burnie, Anne Arundel County","__CLASS__":"Adzuna::API::Response::Location","area":["US","Maryland","Anne Arundel County","Glen Burnie"]},"__CLASS__":"Adzuna::API::Response::Job","longitude":-76.576408,"adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIyNDAzODg3NiIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.wr80cCu4I22WnqY_3WGOzX5njgRbRkTA61ucoHNujwA","description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","id":"4224038876","category":{"__CLASS__":"Adzuna::API::Response::Category","label":"Healthcare & Nursing Jobs","tag":"healthcare-nursing-jobs"},"created":"2023-07-26T00:39:54Z","company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"salary_min":68039.38,"salary_is_predicted":"1","latitude":39.17281,"salary_max":68039.38,"title":"Registered Nurse (RN) - Sign-on Bonus"},{"__CLASS__":"Adzuna::API::Response::Job","location":{"display_name":"Bladensburg, Prince George's County","area":["US","Maryland","Prince George's County","Bladensburg"],"__CLASS__":"Adzuna::API::Response::Location"},"redirect_url":"https://www.adzuna.com/details/4217755651?utm_medium=api&utm_source=87a351c3","description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIxNzc1NTY1MSIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.5YRo7WsopmUeM2GFO9cGLMawxEQJRvB8G3iwWzwBMKI","longitude":-76.933863,"salary_min":57882.88,"salary_is_predicted":"1","latitude":38.939278,"company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"category":{"__CLASS__":"Adzuna::API::Response::Category","label":"Healthcare & Nursing Jobs","tag":"healthcare-nursing-jobs"},"created":"2023-07-21T17:33:51Z","id":"4217755651","title":"Registered Nurse (RN) - Competitive benefits","salary_max":57882.88},{"title":"Registered Nurse (RN) - Competitive benefits","salary_max":55279.56,"salary_min":55279.56,"salary_is_predicted":"1","latitude":39.038318,"company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"category":{"tag":"healthcare-nursing-jobs","label":"Healthcare & Nursing Jobs","__CLASS__":"Adzuna::API::Response::Category"},"created":"2023-07-21T17:33:53Z","id":"4217755787","adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIxNzc1NTc4NyIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.iT8ohylGhOmBanm_kmOd8RKx3BdqOOBGf8x-JKssyE8","description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","longitude":-76.441124,"__CLASS__":"Adzuna::API::Response::Job","location":{"__CLASS__":"Adzuna::API::Response::Location","area":["US","Maryland","Anne Arundel County","Cape Saint Claire"],"display_name":"Cape Saint Claire, Anne Arundel County"},"redirect_url":"https://www.adzuna.com/details/4217755787?utm_medium=api&utm_source=87a351c3"},{"description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJzIjoiUEUxRmRFWXM3aEdrc21WQ183ZWVQUSIsImkiOiI0MjI0MDM2ODU3In0.MXlPASQpUT-5U8WH58q8E1DHMeKuMdonUME1uhdcD3U","longitude":-76.924418,"__CLASS__":"Adzuna::API::Response::Job","redirect_url":"https://www.adzuna.com/details/4224036857?utm_medium=api&utm_source=87a351c3","location":{"display_name":"Marlow Heights, Prince George's County","area":["US","Maryland","Prince George's County","Marlow Heights"],"__CLASS__":"Adzuna::API::Response::Location"},"salary_max":72372.66,"title":"Registered Nurse (RN) - Sign-on Bonus","company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"salary_is_predicted":"1","salary_min":72372.66,"latitude":38.862057,"id":"4224036857","category":{"tag":"healthcare-nursing-jobs","__CLASS__":"Adzuna::API::Response::Category","label":"Healthcare & Nursing Jobs"},"created":"2023-07-26T00:39:28Z"},{"__CLASS__":"Adzuna::API::Response::Job","redirect_url":"https://www.adzuna.com/details/4224038107?utm_medium=api&utm_source=87a351c3","location":{"display_name":"South Gate, Los Angeles County","area":["US","California","Los Angeles County","South Gate"],"__CLASS__":"Adzuna::API::Response::Location"},"description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIyNDAzODEwNyIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.eD06sDDN1Bl_KTrq8zhYEIVG5WOpsvgh9GRbW4UvM3o","longitude":-118.212016,"company":{"__CLASS__":"Adzuna::API::Response::Company","display_name":"Gale Healthcare"},"salary_min":56009.74,"latitude":33.954737,"salary_is_predicted":"1","id":"4224038107","created":"2023-07-26T00:39:43Z","category":{"tag":"healthcare-nursing-jobs","label":"Healthcare & Nursing Jobs","__CLASS__":"Adzuna::API::Response::Category"},"salary_max":56009.74,"title":"Registered Nurse (RN) - Competitive benefits"},{"created":"2023-07-23T02:13:48Z","category":{"__CLASS__":"Adzuna::API::Response::Category","label":"Healthcare & Nursing Jobs","tag":"healthcare-nursing-jobs"},"id":"4219894378","salary_min":49520.24,"latitude":44.410977,"salary_is_predicted":"1","company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"title":"Registered Nurse (RN) - Contract Basis","salary_max":49520.24,"location":{"display_name":"Fort Meade, Meade County","area":["US","South Dakota","Meade County","Fort Meade"],"__CLASS__":"Adzuna::API::Response::Location"},"redirect_url":"https://www.adzuna.com/details/4219894378?utm_medium=api&utm_source=87a351c3","__CLASS__":"Adzuna::API::Response::Job","longitude":-103.471515,"description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIxOTg5NDM3OCIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.aI3YA9U_yaWHG7B-FlGRb2hW4tTT5rnie_slyi8O2Rc"},{"__CLASS__":"Adzuna::API::Response::Job","location":{"area":["US","Maryland","Prince George's County","Fairmount Heights"],"__CLASS__":"Adzuna::API::Response::Location","display_name":"Fairmount Heights, Prince George's County"},"redirect_url":"https://www.adzuna.com/details/4224037870?utm_medium=api&utm_source=87a351c3","description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIyNDAzNzg3MCIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.sEGt70Iw0H2VIH8BigCGA79PO_R6IMduxEFnQ84WVJ0","longitude":-76.915529,"latitude":38.900945,"salary_min":66768.83,"salary_is_predicted":"1","company":{"display_name":"Gale Healthcare","__CLASS__":"Adzuna::API::Response::Company"},"created":"2023-07-26T00:39:41Z","category":{"tag":"healthcare-nursing-jobs","label":"Healthcare & Nursing Jobs","__CLASS__":"Adzuna::API::Response::Category"},"id":"4224037870","title":"Registered Nurse (RN) - Gale Healthcare","salary_max":66768.83},{"title":"RN - Paid Daily","salary_max":68063.85,"created":"2023-07-26T00:39:35Z","category":{"label":"Healthcare & Nursing Jobs","__CLASS__":"Adzuna::API::Response::Category","tag":"healthcare-nursing-jobs"},"id":"4224037364","salary_is_predicted":"1","salary_min":68063.85,"latitude":26.807032,"company":{"__CLASS__":"Adzuna::API::Response::Company","display_name":"Gale Healthcare"},"longitude":-80.081429,"description":"Are you interested in the opportunity to have complete control of your schedule and get paid DAILY when you choose to work? If so, you have come to the right place. PRN - Local Contract - Travel Contract opportunities are all available Gale Healthcare Solutions is currently seeking clinicians with acute care experience to join our rapidly growing network of clinicians. Available Shifts: All shifts are available: 12-hour shifts; days or nights Requirements: Current unencumbered state or compact \u2026","adref":"eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDIyNDAzNzM2NCIsInMiOiJQRTFGZEVZczdoR2tzbVZDXzdlZVBRIn0.6xNOUVWMAKhNn1TueGm17SGVX5CYeDCm0d4Cfv8UUr4","location":{"display_name":"Riviera Beach, Palm Beach County","__CLASS__":"Adzuna::API::Response::Location","area":["US","Florida","Palm Beach County","Riviera Beach"]},"redirect_url":"https://www.adzuna.com/details/4224037364?utm_medium=api&utm_source=87a351c3","__CLASS__":"Adzuna::API::Response::Job"}]}

{
  "access-control-allow-headers": "Origin, X-Requested-With, Content-Type, Accept",
  "access-control-allow-origin": "*",
  "connection": "keep-alive",
  "content-length": "14086",
  "content-type": "application/json; charset=utf8",
  "date": "Thu, 27 Jul 2023 06:26:00 GMT",
  "server": "openresty",
  "vary": "Content-Type",
  "x-catalyst": "5.90130",
  "x-envoy-upstream-service-time": "544"
}

Response Code: 200
*/