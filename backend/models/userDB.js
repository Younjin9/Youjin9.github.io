// models/userDB.js
const conn = require('../db');          // 네가 만든 db.js
const p = conn.promise();               // promise 래퍼

// userID로 한 명 조회 (Student 스키마)
exports.getUser = async (userID) => {
  const sql = `
    SELECT id, userID, userPW, gender, birthdate, phone, address, email, major, grade
    FROM Student
    WHERE userID = ?
    LIMIT 1
  `;
  const [rows] = await p.query(sql, [userID]);
  return rows;
};

// (선택) 회원가입 – 해시 저장 전제
exports.signUp = async ({ id, userID, userPW, gender, birthdate, phone, address, email, major, grade }) => {
  const sql = `
    INSERT INTO Student (id, userID, gender, userPW, birthdate, phone, address, email, major, grade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [id, userID, gender, userPW, birthdate, phone, address, email, major, grade];
  const [result] = await p.execute(sql, params);
  return result;
};

// (선택) 평문 → 해시 마이그레이션
exports.updatePassword = async (userID, newHash) => {
  const sql = `UPDATE Student SET userPW = ? WHERE userID = ?`;
  const [result] = await p.execute(sql, [newHash, userID]);
  return result;
};
