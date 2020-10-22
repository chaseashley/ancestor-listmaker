const axios = require('axios');

/*
function getData(url) {
  return new Promise((resolve, reject) => {
      fetch_retry(url, 5)
          .then((resp) => resp.json())
          .then((data) => {resolve(data)})
          .catch((err) => {console.log(err)})
  })
}

fetches a profile; tries n times; used in getData 
function fetch_retry(url, n) {
  return fetch(url).catch(function(error) {
      if (n === 1) throw error;
      return fetch_retry(url, n - 1);
  })
}*/

function get_retry(url, n) {
  return axios.get(url)
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (n===1) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          return get_retry(url, n-1);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        if (n === 1) {
          console.log(error.request);
        } else {
          return get_retry(url, n-1);
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
}

export function getCoordinates(locationName) {
  const dbURL = 'https://ancestor-listmaker-backend.herokuapp.com/locations/' + locationName;
  return get_retry(dbURL, 5)
}
    
/*
// Get coordinates for locationName from locations db on heroku
export  function getCoordinates(locationName) {
    const dbURL = 'https://ancestor-listmaker-backend.herokuapp.com/locations/' + locationName;
    return axios.get(dbURL)
    .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
}
*/

export async function postCoordinates(locationName, coordinates) {
    const dbURL = 'https://ancestor-listmaker-backend.herokuapp.com/locations/create';
    return await axios.post(dbURL, {'locationName': locationName, 'coordinates': coordinates})
    .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
}

