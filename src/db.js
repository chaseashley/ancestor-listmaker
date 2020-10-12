import Dexie from 'dexie';

const db = new Dexie('ListmakerDexie');

db.version(2).stores({ main: '', lines: '', map: '' });

export default db;