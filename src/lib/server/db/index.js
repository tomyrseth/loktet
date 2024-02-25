import Database from "better-sqlite3";

const db = new Database("./data/database.db", { verbose: console.log });

export function getLifts() {
  const sql = `
  SELECT * FROM sessions;
  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows;
}

export function getInfo() {
  const sql = `
  SELECT * FROM personInfo
  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows;
}

export function getUsers() {
  const sql = `
  SELECT * FROM users
  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows;
}
