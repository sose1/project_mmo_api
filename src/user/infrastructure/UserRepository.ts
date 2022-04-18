import mongoose from "mongoose";

interface IUser {
    email: string;
    password: string;
    isLogged: boolean;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
    build(attr: IUser): UserDoc
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    isLogged: boolean;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isLogged: {
        type: Boolean,
        required: false
    },
});

userSchema.statics.build = (attr: IUser) => {
    return new User(attr)
}

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema);

const build = (attr: IUser) => {
    return new User(attr)
}
export default User
