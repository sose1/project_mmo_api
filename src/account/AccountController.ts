import express, {Request, Response} from "express";
import AccountService from "./AccountService";
import {authorize} from "../auth/AuthUtils";

class AccountController {
    public readonly path = '/accounts'
    public readonly router = express.Router()
    private accountService = new AccountService()

    constructor() {
        this.router.get(this.path, this.getAll)
        this.router.get(this.path + "/logout", this.logout)
        this.router.get(this.path + "/:accountId", this.getById)
        this.router.post(this.path, this.createAccount)
        this.router.patch(this.path + "/:accountId", this.updateByID)
        this.router.delete(this.path + "/:accountId", this.deleteById)
        this.router.post(this.path + "/login", this.login)
        this.router.get(this.path + "/server/authorize", this.authorizeConnection)
    }

    getAll = async (req: Request, res: Response) => {
        const response = await this.accountService.getAccounts()
        if (response != null) {
            res.statusCode = 200
            res.send(response)
            return;
        }
        res.sendStatus(204)
    }

    createAccount = async (req: Request, res: Response) => {
        const {email, password} = req.body
        const response = await this.accountService.createAccount(email, password)
        res.statusCode = 201
        res.send(response)
    }

    getById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.accountService.getAccountById(req.params.accountId)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response);
    }

    updateByID = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.accountService.updateById(req)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response)
    }

    deleteById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string

        authorize(authHeader)
            ? await this.accountService.deleteById(req)
            : res.sendStatus(401)
    }

    login = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const response = await this.accountService.login(email, password);
        res.send(response)
    }

    logout = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response

        authorize(authHeader)
            ? response = await this.accountService.logout(authHeader)
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
            ? response = await this.accountService.activatePlayer(authHeader)
            : res.sendStatus(401)

        if (response == null) {
            res.sendStatus(404)
        }
        res.send(response);
    }
}

export default AccountController
