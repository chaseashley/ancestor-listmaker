import Dexie from 'dexie';

const db = new Dexie('AncestorExplorerDexie');

db.version(2).stores({ main: '', lines: '', map: '' });

export default db;