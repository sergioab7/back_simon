import { conexion } from "../database/conection.js";

export const dashboard = async (req,res) => {
    const user = req.user.id;

    const query = `
    SELECT id, username, email, puntuacion, created
    FROM users
    WHERE id = ?
    `;
    const valorId = [user];
    const [sacarInformacionUser] = await conexion.query(query,valorId);

    if(sacarInformacionUser){
        res.status(200).json({
            status:"Success",
            informacion: sacarInformacionUser[0]
        })
    }else{
        res.status(200).json({
            status:"Error",
            message:"[-] No se ha podido sacar la información"
        })
    }


}

export const ranking = async(req,res) => {
    const limit = parseInt(req.params.limit);
    console.log(limit);
    if(limit){
        //Ranking de los que tienen mayor puntuación
        const query = `
        SELECT id, username, puntuacion
        FROM users
        WHERE puntuacion > 0
        ORDER BY puntuacion DESC
        LIMIT ?;
        `;

        const limiteMax = [limit];
        const [resultadoRanking] = await conexion.query(query, limiteMax);
        if(resultadoRanking){
            return res.status(200).json({
                status:"Success",
                ranking:resultadoRanking
            })
        }else{
            return res.status(200).json({
                status:"Error",
                ranking:"Error en el limite"
            })
        }
    }else{
        //Ranking de los que tienen mayor puntuación
        const query = `
        SELECT id, username, puntuacion
        FROM users
        WHERE puntuacion > 0
        ORDER BY puntuacion DESC;
        `;
        const [resultadoRanking] = await conexion.query(query);
        if(resultadoRanking){
        return res.status(200).json({
            status:"Success",
            ranking:resultadoRanking
        })
        }
}
    
}

export const addNuevaPuntuacion = async(req,res) => {
    const { puntos } = req.body;
    
    const queryPuntuacion = 
    `
        SELECT puntuacion
        FROM users
        WHERE id = ?;
    `;
    const value = [req.user.id];
    const [puntuacion] = await conexion.query(queryPuntuacion,value);
    const puntitos = puntuacion[0].puntuacion;
    console.log(puntitos);

    if(puntitos < puntos){
        const queryActualizar = 
        `
            UPDATE users
            SET puntuacion = ?
            WHERE id = ?
        `;
        const valores = [puntos, req.user.id];
        const actualizadoPuntuacion = await conexion.query(queryActualizar,valores);
        if(!actualizadoPuntuacion){
            return res.status(500).json({
                status:"Error",
                message:"No se ha podido actualizar la puntuación!"
            })
        }

        return res.status(200).json({
            status:"Success",
            message:"Puntuación actualizada!"
        })
    }else{

        return res.status(400).json({
            status:"Error",
            message:"El usuario ya tiene mas puntos!. No se puede actualizar."
        })
    }
}