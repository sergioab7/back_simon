import { conexion } from "../database/conection.js";
import jwt from "jsonwebtoken";

export const existeUsuario = async(user) => {
    const query = 
    `
        SELECT *
        FROM users
        WHERE username = ?;
    `;
    const value = [user];
    const existeUsuario = await conexion.query(query,value);
    console.log(existeUsuario);
}


export const crearToken = (id) => {
    return new Promise((resolve,reject) => {
        jwt.sign(id, process.env.TOKEN_SECRET, {expiresIn:'1d'}, (err,token) => {
            if(err){
                reject(err);
            }
            resolve(token);
        })
    })
}