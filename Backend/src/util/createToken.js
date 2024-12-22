import jwt from "jsonwebtoken";  // Utiliser 'import' si vous êtes en mode module

const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const createToken = async (tokenData, tokenKey = TOKEN_KEY, expiresIn = TOKEN_EXPIRY) => {
  try {
    const token = jwt.sign(tokenData, tokenKey, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export { createToken  };  // Utilisez 'export default' si vous êtes en mode module
