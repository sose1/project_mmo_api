import {Request} from "express";
import User from "../infrastructure/UserRepository";

class UserService {
    constructor() {
    }

    public async createUser(req: Request) {
        const {email, password, isLogged} = req.body;
        const user = User.build({email, password, isLogged});
        return await user.save();
    }

    public async getUsers() {
        return await User.find();
    }

    public async getUserById(userId: string) {
        return await User.findById(userId);
    }

    public async updateById(req: Request) {
        const {email, password, isLogged} = req.body;
        const _id = req.params.userId;
        await User.findByIdAndUpdate({_id}, {email: email, password: password, isLogged: isLogged});
        return User.findById(_id);
    }

    public async deleteById(userId: string) {
        return User.findByIdAndDelete(userId)
    }
}

export default UserService
