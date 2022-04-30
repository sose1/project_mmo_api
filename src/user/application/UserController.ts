import express, {Request, Response} from "express";
import UserService from "../domain/UserService";
import {authorize} from "../../auth/AuthUtils";

class UserController {
    public readonly path = '/users'
    public readonly router = express.Router()
    private userService = new UserService()

    constructor() {
        this.router.get(this.path, this.getAll)
        this.router.get(this.path + "/:userId", this.getById)
        this.router.post(this.path, this.createUser)
        this.router.patch(this.path + "/:userId", this.updateByID)
        this.router.delete(this.path + "/:userId", this.deleteById)
        this.router.post(this.path + "/login", this.login)
        this.router.get(this.path + "/server/authorize", this.authorizeConnection)
    }

    getAll = async (req: Request, res: Response) => {
        const response = await this.userService.getUsers()
        res.statusCode = 200
        res.send(response);
    }

    getById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.userService.getUserById(req.params.userId)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response);
    }

    createUser = async (req: Request, res: Response) => {
        const response = await this.userService.createUser(req)
        res.statusCode = 201;
        res.send(response)
    }

    updateByID = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.userService.updateById(req)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response)
    }

    deleteById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string

        authorize(authHeader)
            ? await this.userService.deleteById(req)
            : res.sendStatus(401)
    }

    login = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const response = await this.userService.login(email, password);
        res.send(response)
    }

    authorizeConnection = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response

        authorize(authHeader)
            ? response = await this.userService.getUserByEmail(req)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response);
    }
}

export default UserController