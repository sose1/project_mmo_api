import express, {Request, Response} from "express";
import CharacterService from "./CharacterService";
import {authorize} from "../auth/AuthUtils";

class CharacterController {
    public readonly path = '/characters'
    public readonly router = express.Router()
    private characterService = new CharacterService()

    constructor() {
        this.router.get(this.path + "/owner/:ownerId", this.getAllByOwnerId)
        this.router.post(this.path + "/owner/:ownerId", this.createCharacter)
        this.router.delete(this.path + "/:characterId/owner/:ownerId", this.deleteCharacter)
        this.router.get(this.path + "/:characterId", this.getById)

    }

     getAllByOwnerId =  async (req: Request, res: Response) => {
         const response = await this.characterService.getCharacters(req.params.ownerId)
         if (response != null) {
             res.statusCode = 200
             res.send({response})
             return;
         }
         res.sendStatus(204)
    }

    createCharacter = async (req: Request, res: Response) => {
        const {nickname} = req.body
        const authHeader = req.headers["authorization"] as string

        let response
        authorize(authHeader)
            ? response = await this.characterService.createCharacter(nickname, req.params.ownerId, authHeader)
            : res.sendStatus(401)

        res.send(response)
    }

    deleteCharacter = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.characterService.deleteCharacter(req.params.characterId, req.params.ownerId, authHeader)
            : res.sendStatus(401)

        res.send(response)
    }

    getById = async (req: Request, res: Response) => {
        const authHeader = req.headers["authorization"] as string
        let response
        authorize(authHeader)
            ? response = await this.characterService.getById(req.params.characterId)
            : res.sendStatus(401)

        res.send(response)
    }
}

export default CharacterController
