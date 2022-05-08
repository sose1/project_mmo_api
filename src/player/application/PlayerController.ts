import express, {Request, Response} from "express";
import PlayerService from "../domain/PlayerService";
import {authorize} from "../../auth/AuthUtils";

class PlayerController {
    public readonly path = '/players'
    public readonly router = express.Router()
    private playerService = new PlayerService()

    constructor() {
        this.router.get(this.path, this.getAll)
        this.router.get(this.path + "/logout", this.logout)
        this.router.get(this.path + "/:playerId", this.getById)
        this.router.post(this.path, this.createPlayer)
        this.router.patch(this.path + "/:playerId", this.updateByID)
        this.router.delete(this.path + "/:playerId", this.deleteById)
        this.router.post(this.path + "/login", this.login)
        this.router.get(this.path + "/server/authorize", this.authorizeConnection)
    }

    getAll = async (req: Request, res: Response) => {
        const response = await this.playerService.getPlayers()
        res.statusCode = 200
        res.send(response);
    }

    getById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.playerService.getPLayerById(req.params.playerId)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response);
    }

    createPlayer = async (req: Request, res: Response) => {
        const response = await this.playerService.createPlayer(req)
        res.statusCode = 201;
        res.send(response)
    }

    updateByID = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.playerService.updateById(req)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response)
    }

    deleteById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string

        authorize(authHeader)
            ? await this.playerService.deleteById(req)
            : res.sendStatus(401)
    }

    login = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const response = await this.playerService.login(email, password);
        res.send(response)
    }

    logout = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response

        authorize(authHeader)
            ? response = await this.playerService.logoutPlayer(req)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response)
    }

    authorizeConnection = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response

        authorize(authHeader)
            ? response = await this.playerService.activatePlayer(req)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response);
    }
}

export default PlayerController
