import { Users } from "../models/";

export const getAll = async (req, res) => {
  try {
    let results = await Users.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error al tratar de procesar tu petición",
      error,
    });
  }
};