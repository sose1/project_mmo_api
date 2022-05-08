import mongoose from "mongoose";

interface IPlayer {
    email: string;
    password: string;
    nickname: string;
}

interface PlayerModelInterface extends mongoose.Model<PlayerDoc> {
    build(attr: IPlayer): PlayerDoc
}

interface PlayerDoc extends mongoose.Document {
    email: string;
    password: string;
    isLogged: boolean;
}

const playerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    position: {
        x: Number,
        y: Number,
        z: Number,
        rotation: Number
    },
    isLogged: Boolean
});

playerSchema.statics.build = (attr: IPlayer) => {
    return new Player(attr)
}

const Player = mongoose.model<PlayerDoc, PlayerModelInterface>('Player', playerSchema);

const build = (attr: IPlayer) => {
    return new Player(attr)
}
export default Player