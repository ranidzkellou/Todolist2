import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).send("Un jeton d'authentification est requis");
  }

  try {
    const decodedToken = jwt.verify(token, TOKEN_KEY);
    req.currentUser = decodedToken;
  } catch (error) {
    return res.status(401).send("Jeton invalide fourni");
  }

  return next();
};


export default verifyToken;
