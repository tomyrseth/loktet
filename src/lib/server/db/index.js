import Database from "better-sqlite3";

const db = new Database("./data/lifts.db", { verbose: console.log });

export function getLifts() {
  const sql = `
  select * from personInfo
  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows;
}