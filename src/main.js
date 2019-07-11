import { getFullName } from './js/utils';
import { trashLog } from './js/logger';

const firstName = getFullName(process.env.MYNAME);

console.log(firstName);

console.log('yo yo yo');

trashLog();