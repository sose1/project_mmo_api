import Character from "./CharacterRepository";
import mongoose from "mongoose";
import {decodeToken} from "../auth/AuthUtils";
import Account from "../account/AccountRepository";

class CharacterService {
    constructor() {
    }

    async getCharacters(ownerId: string) {
        let characters
        characters = await Character.find(new mongoose.Schema.Types.ObjectId(ownerId));
        if (characters.length == 0)
            return null

        return characters
    }


    async createCharacter(nickname: string, ownerId: string, authHeader: string) {
        const editor = await Account.findOne({email: decodeToken(authHeader).username})
        if (editor != null && editor._id != ownerId) {
            return 401
        }

        const character = Character.build({nickname: nickname, owner: ownerId})
        await character.save()

        const characterId = await Character.findOne({nickname: nickname}).select('_id')
        return await Account.findByIdAndUpdate(
            {
                _id: ownerId
            },
            {
                $push:
                    {
                        characters: characterId
                    }
            },
            {
                new: true
            }
        ).select('-password')
    }

    async deleteCharacter(characterId: string, ownerId: string, authHeader: string) {
        const editor = await Account.findOne({email: decodeToken(authHeader).username})
        if (editor != null && editor._id != ownerId) {
            return 401
        }

        await Character.findByIdAndDelete(characterId)
        return await Account.findByIdAndUpdate(
            {
                _id: ownerId
            },
            {
                $pullAll: {
                    characters: [{_id: characterId}],
                }
            },
            {
                new: true
            }
        )
    }

    async getById(characterId: string) {
        return await Character.findById(characterId)
    }
}

export default CharacterService
