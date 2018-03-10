const citytrash = require('./helpers/citytrash');
try {
  citytrash.getDate()
} catch (e) {
  console.error(`Something went wrong: ${e.message}`);
}

console.log('trashed');
