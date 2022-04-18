import {Request} from "express";
import User from "../infrastructure/UserRepository";
import {accessToken, decodeToken} from "../../auth/AuthUtils";

class UserService {
    constructor() {
    }

    async createUser(req: Request) {
        const {email, password, isLogged} = req.body;
        const user = User.build({email, password, isLogged});
        return await user.save();
    }

    async getUsers() {
        return await User.find();
    }

    async getUserById(userId: string) {
        return await User.findById(userId);
    }

    async updateById(req: Request) {
        const {email, password, isLogged} = req.body;
        const _id = req.params.userId;
        const authHeader = req.headers["authorization"] as string
        const editor = decodeToken(authHeader)
        const editorDbObject = await User.findOne({email: editor.username})

        if (editorDbObject != null && editorDbObject._id != _id) {
            return 401
        }

        await User.findByIdAndUpdate({_id}, {email: email, password: password, isLogged: isLogged});
        return await User.findById(_id);
    }

    async deleteById(req: Request) {
        const _id = req.params.userId;
        const authHeader = req.headers["authorization"] as string
        const editor = decodeToken(authHeader)
        const editorDbObject = await User.findOne({email: editor.username})

        if (editorDbObject != null && editorDbObject._id != _id) {
            return 401
        }

        return await User.findByIdAndDelete(_id)
    }

    async login(email: string, password: string) {
        const user = await User.findOne({email: email});

        if (user == null) {
            return 409
        }

        if (password != user.password) {
            return 409
        }

        return await accessToken(email)
    }
}

export default UserService
