import db from "../config/db.js";
import bcrypt from 'bcrypt';
import { verifyHashedData } from '../util/hashData.js';
import { createToken } from '../util/createToken.js';

async function login(req, res) {
    console.log("login called ",req.body);
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json({ error: "L'email et le mot de passe sont nécessaires" });
    }

    try {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            throw new Error("Invalid email entered!");
        }

        const fetchedUser = rows[0];

        console.log(fetchedUser);

        const passwordMatch = await verifyHashedData(password, fetchedUser.password);
        if (!passwordMatch) {
            throw new Error("Invalid password entered!");
        }

        const tokenData = { userId: fetchedUser.id, email };
        const token = await createToken(tokenData);

        fetchedUser.token = token;
    

        res.status(200).json({ message: "Authentification réussie", user: fetchedUser,token:token  });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

async function signup(req, res) {

    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `INSERT INTO users (username, email, password) 
                      VALUES (?, ?, ?)`;
        
        await db.promise().query(query, [username, email, hashedPassword]);

        res.status(201).json({ 
            message: "Utilisateur enregistré avec succès." 
        });
    } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur:", err);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
}

export default {
    login,
    signup
};