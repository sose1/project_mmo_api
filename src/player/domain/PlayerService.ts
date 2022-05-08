import {Request} from "express";
import Player from "../infrastructure/PlayerRepository";
import {accessToken, decodeToken} from "../../auth/AuthUtils";

class PlayerService {
    constructor() {
    }

    async createPlayer(req: Request) {
        const {email, password, nickname} = req.body;
        const player = Player.build({email, password, nickname});
        return await player.save();
    }

    async getPlayers() {
        return await Player.find().select(['-password']);
    }

    async getPLayerById(playerId: string) {
        return await Player.findById(playerId);
    }

    async updateById(req: Request) {
        const {email, password} = req.body;
        const _id = req.params.playerId;
        const authHeader = req.headers["authorization"] as string
        const editor = decodeToken(authHeader)
        const editorDbObject = await Player.findOne({email: editor.username})

        if (editorDbObject != null && editorDbObject._id != _id) {
            return 401
        }

        await Player.findByIdAndUpdate({_id}, {email: email, password: password});
        return await Player.findById(_id);
    }

    async deleteById(req: Request) {
        const _id = req.params.playerId;
        const authHeader = req.headers["authorization"] as string
        const editor = decodeToken(authHeader)
        const editorDbObject = await Player.findOne({email: editor.username})

        if (editorDbObject != null && editorDbObject._id != _id) {
            return 401
        }

        return await Player.findByIdAndDelete(_id)
    }

    async login(email: string, password: string) {
        const player = await Player.findOne({email: email});

        if (player == null) {
            return 409
        }

        if (password != player.password) {
            return 409
        }

        if (player.isLogged == true) {
            return 403
        }

        return await accessToken(email)
    }

    async activatePlayer(req: Request) {
        return await Player.findOneAndUpdate(
            {
                email: decodeToken(req.headers["authorization"] as string).username
            },
            {
                isLogged: true
            },
            {
                new: true
            }
        )
    }

    async logoutPlayer(req: Request) {
        return await Player.findOneAndUpdate(
            {
                email: decodeToken(req.headers["authorization"] as string).username
            },
            {
                isLogged: false
            },
            {
                new: true
            }
        )
    }
}

export default PlayerService
