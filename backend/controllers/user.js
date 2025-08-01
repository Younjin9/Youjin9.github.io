// controllers/user.js
const bcrypt = require('bcryptjs');
const userDB = require('../models/userDB');

const isBcryptHash = (s) => typeof s === 'string' && (s.startsWith('$2a$') || s.startsWith('$2b$'));
const textToHash = (t) => bcrypt.hash(t, 10);

const matchPasswordSmart = async (inputPW, storedPW) => {
  if (isBcryptHash(storedPW)) return bcrypt.compare(inputPW, storedPW);
  return inputPW === storedPW;
};

exports.loginCheck = async (req, res) => {
  const { userID, userPW } = req.body;
  try {
    const rows = await userDB.getUser(userID);
    if (!rows.length) return res.status(401).json({ message: '존재하지 않는 아이디다.' });

    const user = rows[0];
    const ok = await matchPasswordSmart(userPW, user.userPW);
    if (!ok) return res.status(401).json({ message: '비밀번호가 일치하지 않는다.' });

    // (선택) 평문이면 로그인 성공 시 해시로 자동 마이그레이션
    if (!isBcryptHash(user.userPW)) {
      try {
        const newHash = await textToHash(userPW);
        await userDB.updatePassword(user.userID, newHash);
        console.log('비밀번호 해시 마이그레이션 완료:', user.userID);
      } catch (e) {
        console.warn('마이그레이션 실패(로그인은 성공):', e.message);
      }
    }

    const payload = {
      userID: user.userID,
      id: user.id,
      gender: user.gender,
      birthdate: user.birthdate,
      phone: user.phone,
      address: user.address,
      email: user.email,
      major: user.major,
      grade: user.grade,
    };
    return res.status(200).json(payload);
  } catch (err) {
    console.error('loginCheck error:', err); // <- 여기 콘솔을 꼭 봐줘
    return res.status(500).json({ message: '서버 에러' });
  }
};
