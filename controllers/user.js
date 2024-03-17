import { conexion } from "../database/conection.js";
import { crearToken, existeUsuario } from "../utils/existeUsuario.js";
import bcrypt from "bcryptjs";

export const conseguirUsuarios = async(req,res) => {
    const query = 
    `
        SELECT * 
        FROM users;
    `;
    const [usuarios] = await conexion.query(query);
    res.json({
        status:200,
        message:usuarios
    })
}

export const crearUsuario = async(req,res) => {
    const { username, email, password } = req.body;

    // const existeUsuario = await existeUsuario(req.body.username);
    // console.log(existeUsuario);

    const genSalt = await bcrypt.genSalt(12);
    const newPassword = await bcrypt.hash(password, genSalt);

    //Creación del usuario
    const query = `
        INSERT INTO users (username, email, password)
        VALUES (?,?,?);
    `;
    const values = [username, email, newPassword];
    const ingresarUsuario = await conexion.query(query,values);

    if(!ingresarUsuario){
        res.status(500).json({
            status:"Error",
            message:"No es posible crear el usuario"
        })
    }

    res.json({
        status:"Success",
        message:"Usuario creado!"
    })
}


export const loginUser = async(req,res) => {
    const queryExisteUser = `
        SELECT id
        FROM users
        WHERE email = ?
    `;
    const valor = [req.body.email];
    const [existeUser] = await conexion.query(queryExisteUser, valor);
    if(!existeUser[0]){
        res.json({
            status:400,
            message:"[-] Error el usuario no existe"
        })
    }

    const queryPassword = `
        SELECT *
        FROM users
        WHERE email = ?
    `;
    const valorPassword = [req.body.email]

    const [sacarPassword] = await conexion.query(queryPassword, valorPassword);
    const passwordUser = sacarPassword[0].password;

    const comprobarPassword = await bcrypt.compare(req.body.password, passwordUser);

    if(comprobarPassword){
        const id_user = existeUser[0];
        const token = await crearToken({id: id_user})
        res.cookie("token", token);
    
        res.status(200).json({
            status:"Success",
            message:"[+] El usuario está logueado!",
            token:token
        })
    }else{
        res.status(400).json({
            status:"Error",
            message:"[+] Contraseña incorrecta!",
        })
    }


}

export const logout = async(req,res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });

    return res.status(200).json({
        status:"Success",
        message:"Saliendo correctamente!"
    });
}