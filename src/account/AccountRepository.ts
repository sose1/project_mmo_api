import mongoose from "mongoose";

interface IAccount {
    email: string;
    password: string;
}

interface AccountModelInterface extends mongoose.Model<AccountDoc> {
    build(attr: IAccount): AccountDoc
}

interface AccountDoc extends mongoose.Document {
    email: string;
    password: string;
    isLogged: boolean;
    characters: mongoose.Schema.Types.ObjectId;

}

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isLogged: Boolean,
    characters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character"
    }]
})
accountSchema.statics.build = (attr: IAccount) => {
    return new Account(attr)
}
const Account = mongoose.model<AccountDoc, AccountModelInterface>("Account", accountSchema)
const build = (attr: IAccount) => {
    return new Account(attr)
}
export default Account
