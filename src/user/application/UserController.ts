import express, {Request, Response} from "express";
import UserService from "../domain/UserService";

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
    }

    getAll = async (req: Request, res: Response) => {
        const response = await this.userService.getUsers()
        res.statusCode = 200
        res.send(response);
    }

    getById = async (req: Request, res: Response) => {
        const response = await this.userService.getUserById(req.params.userId)
        if (response == null) {
            res.statusCode = 404
        }
        res.send(response);
    }

    createUser = async (req: Request, res: Response) => {
        const response = await this.userService.createUser(req)
        res.statusCode = 201;
        res.send(response)
    }

    updateByID = async (req: Request, res: Response) => {
        const response = await this.userService.updateById(req)
        if (response == null) {
            res.statusCode = 404
        }
        res.send(response)
    }

    deleteById = async (req: Request, res: Response) => {
        const response = await this.userService.deleteById(req.params.userId)
        res.send(response)
    }
}

export default UserController
