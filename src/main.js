import { getFullName } from './js/utils';
import { trashLog } from './js/logger';

trashLog();

if (process.env.MYNAME) {
  const firstName = getFullName(process.env.MYNAME);
  console.log(firstName);
}
console.log('yo yo yo');