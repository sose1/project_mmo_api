import Account from "./AccountRepository";
import {accessToken, decodeToken} from "../auth/AuthUtils";
import {Request} from "express";
import Character from "../character/CharacterRepository";

class AccountService {

    constructor() {
    }

    async getAccounts() {
        let accounts
        accounts = await Account.find().select(['-password']);
        if (accounts.length == 0)
            return null

        return accounts
    }

    async createAccount(email: string, password: string) {
        const account = Account.build({email, password})
        return await account.save();
    }

    async login(email: string, password: string) {
        const account = await Account.findOne({email: email});

        if (account == null) {
            return 409
        }

        if (password != account.password) {
            return 409
        }

        if (account.isLogged == true) {
            return 403
        }
        const res = await Account.findOneAndUpdate({email: email}, {isLogged:true}, {new: true}).select(['-password']);
        return {accessToken: await accessToken(email), account: res};
    }

    async logout(authHeader: string) {
        await Character.updateMany(
            {"owner": await Account.findOne({email: decodeToken(authHeader).username}).select('_id')},
            {"$set":{"isActive": false}}
        );

        return await Account.findOneAndUpdate(
            {
                email: decodeToken(authHeader).username
            },
            {
                isLogged: false
            },
            {
                new: true
            }
        )
    }

    async getAccountById(accountId: string) {
        return await Account.findById(accountId);
    }

    async updateById(req: Request) {
        const {email, password} = req.body;
        const _id = req.params.accountId;
        const authHeader = req.headers["authorization"] as string
        const editor = decodeToken(authHeader)
        const editorDbObject = await Account.findOne({email: editor.username})

        if (editorDbObject != null && editorDbObject._id != _id) {
            return 401
        }

        await Account.findByIdAndUpdate({_id}, {email: email, password: password});
        return await Account.findById(_id);
    }

    async deleteById(req: Request) {
        const _id = req.params.accountId;
        const authHeader = req.headers["authorization"] as string
        const editor = decodeToken(authHeader)
        const editorDbObject = await Account.findOne({email: editor.username})

        if (editorDbObject != null && editorDbObject._id != _id) {
            return 401
        }

        return await Account.findByIdAndDelete(_id)
    }
}

export default AccountService
