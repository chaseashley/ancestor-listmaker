import Dexie from 'dexie';

const db = new Dexie('ListmakerDexie');

db.version(1).stores({ main: '', lines: '' });

export default db;