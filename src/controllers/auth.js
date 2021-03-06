import { Users, ResetTokens } from "../models/";
import bcrypt from "bcryptjs";
import { sign } from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/nodemailer";
import moment from "moment";
import {Op} from "sequelize";


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await Users.findOne({ where: { email } });
      if (user) {
        let hashPassword = user.password;
        let valid = bcrypt.compareSync(password, hashPassword);
        let userObj = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        if (valid) {
          return res.status(200).json({
            message: "Has iniciado sesión correctamente",
            token: sign(userObj),
          });
        }
        return res.status(401).json({
          message: "Las credenciales son incorrectas",
        });
      } else {
        res.status(401).json({
          message: "Las credenciales son incorrectas",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Hubo un error al tratar de autenticar al usuario en el sistema",
        error,
      });
    }
  };
  
export const signup = async (req, res) => {
    //Obtener todos los campos que ha enviado el cliente
    const { firstName, lastName, email, password } = req.body;
    try {
      let hashPassword = bcrypt.hashSync(password, 10);
      let results = await Users.findOrCreate({
        defaults: { firstName, lastName, email, password: hashPassword },
        where: { email },
      });
      if (results[1]) {
        res.status(201).json(results[0]);
      } else {
        res.status(400).json({
          message: "Ya existe el usuario en el sistema",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Hubo un error al tratar de registrar el usuario en el sistema",
        error,
      });
    }
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await Users.findOne({ where: { email } });
    if (user) {
      let userID = user.id;
      let tokenUUID = uuidv4();
      let resetTokenObj = {
        token: tokenUUID,
        expirationDate: moment().add(1, "day"),
        userId: userID,
        active: true,
      };
      let results = await ResetTokens.create(resetTokenObj);
      console.log(results);
      sendEmail(user.email, tokenUUID, userID);
      res
        .status(200)
        .json({
          message:
            "Se enviará un correo electronico a la dirección asociada a la cuenta para restablecer la contraseña",
        });
    }
    return res.status(200).json({
      message:
        "Se enviará un correo electronico a la dirección asociada a la cuenta para restablecer la contraseña",
    });
  } catch (error) {}
};

export const updatePassword = async(req, res) => {
  const {token, userId, password} = req.body; 
  try{
    let tokenObj = await ResetTokens.findOne({where: {token, [Op.and]: { 
      userId
    }}});
    if(tokenObj){
      //validar que este activo
      //validar que el token no haya expirado
      //la fecha actual es menor a la fecha de expiracion?
      let validToken = moment().isBefore(tokenObj.expirationDate);
      if(tokenObj.active && validToken){
        //Cambiar la contrasena en la DB
        let hashPassword = bcrypt.hashSync(password, 10);
        await Users.update({password: hashPassword}, {where: {id: tokenObj.userId}});
        //Cambiar el estatus del token a false
        await ResetTokens.update({active: false}, {where: {id: tokenObj.id}});
        return res.status(200).json({
          message: "Se ha restablecido tu contraseña",
        });
      }
      return res.status(403).json({
        message: "El token es invalido o ya expiro",
      });
    }else{
      res.status(403).json({
        message: "El token es invalido o ya expiro",
      });
    }
  }catch(error){
    res.status(500).json({
      message: "Hubo un error al tratar de validar el token en el sistema",
      error,
    });
  }
};