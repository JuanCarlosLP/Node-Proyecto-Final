import {Users} from "../models/";

const getRole = async(id) => {
    //Obtenemos el rol por el id del usuario
    try{
        let role = await Users.findOne({where: {id}, include: ["Roles"]});
        console.log(role.Roles[0].name);
        return role.Roles[0].name;
    }catch(error){
        console.log(error);
    }
}

export const isAdmin = (id) => {
    return async (req, res, next) => {
        let role = await getRole(id);
        if(role === "Admin"){
            next();
        }else{
            res.json({
                message: "No tienes los permisos necesarios para acceder al recurso"
            })
        }
    }
}

export const isEditor = (id) => {
    return async (req, res, next) => {
        let role = await getRole(id);
        if(role === "Editor" || role === "Admin"){
            next();
        }else{
            res.json({
                message: "No tienes los permisos necesarios para acceder al recurso"
            })
        }
    }
}

export const isUser = (id) => {
    return async (req, res, next) => {
        let role = await getRole(id);
        if(role === "Usuario" || role === "Editor" || role === "Admin"){
            next();
        }else{
            res.json({
                message: "No tienes los permisos necesarios para acceder al recurso"
            })
        }
    }
}