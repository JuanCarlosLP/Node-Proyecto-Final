import supertest from "supertest";
import app from "../app";
import {Users} from "../models/";
import {sign} from "../utils/jwt";

describe("Probando el registro de usuarios", () => {

    beforeAll(async () => {
        await Users.destroy({where: { email: "hector02@gmail.com"}})
    });

    it("Agregando un nuevo usuario", async ( done ) => {
        //arrange
        let userObj = {
            firstName: "Hector",
            lastName: "Rodriguez",
            email: "hector02@gmail.com",
            password: "hector12345"
        };

        //assert
        const response = await supertest(app).post("/api/v1/signup").send(userObj);

        //act
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("firstName", "Hector");
        expect(response.body).toHaveProperty("lastName", "Rodriguez");
        
    });

    it("Falla al momento de agregar un usuario que ya existe", async(done) => {
        //arrange
        let userObj = {
            firstName: "Hector",
            lastName: "Rodriguez",
            email: "hector02@gmail.com",
            password: "hector12345"
        };

        //assert
        const response = await supertest(app).post("/api/v1/signup").send(userObj);

        //act
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Ya existe el usuario en el sistema");
        
    });

    it("Creando un token de autorizacion", () => {
        //arrange
        let payload = {
            id: 7,
            firstName: "Hector",
            lastName: "Rodriguez",
            email: "hector02@gmail.com",
        };
        //assert
        let token = sign(payload);

        //act
        expect(token).toBeDefined();
    });

    it("Iniciando sesión", async ( done ) => {
        //arrange
        let userObj = {
            email: "hector02@gmail.com",
            password: "hector12345"
        };

        //assert
        const response = await supertest(app).post("/api/v1/login").send(userObj);

        //act
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("message", "Has iniciado sesión correctamente");
        
    });

    it("Inicio fallido", async ( done ) => {
        //arrange
        let userObj = {
            email: "hector02@gmail.com",
            password: "contrasena12345"
        };

        //assert
        const response = await supertest(app).post("/api/v1/login").send(userObj);

        //act
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Las credenciales son incorrectas");
        
    });

    it("Inicio fallido con usuario que no existe", async ( done ) => {
        //arrange
        let userObj = {
            email: "hector022@gmail.com",
            password: "contrasena12345"
        };

        //assert
        const response = await supertest(app).post("/api/v1/login").send(userObj);

        //act
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Las credenciales son incorrectas");
        
    });

    it("Inicio fallido", async ( done ) => {
        //arrange
        let userObj = {};

        //assert
        const response = await supertest(app).post("/api/v1/login").send(userObj);

        //act
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Hubo un error al tratar de autenticar al usuario en el sistema");
        
    });
});