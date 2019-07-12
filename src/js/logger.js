const axios = require('axios');

const trashLog = () => {
  axios.get('/api/current')
  .then(function (response) {
    console.log(response.data.trashDay);
  })
  .catch(function (error) {
    console.log(error);
  })
}

export { trashLog };