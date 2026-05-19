const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || 'database/app.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

function readSql(fileName) {
  return fs.readFileSync(path.join(__dirname, '..', 'database', fileName), 'utf8');
}

function initializeDatabase() {
  db.exec(readSql('schema.sql'));
  const nodeCount = db.prepare('SELECT COUNT(*) AS total FROM nodes').get().total;
  if (nodeCount === 0) {
    db.exec(readSql('seed.sql'));
  }
}

module.exports = { db, initializeDatabase };
