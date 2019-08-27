import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';

const Schema = mongoose.Schema;

let Match = new Schema({
    playerBlue : {
        type: String
    },
    playerRed : {
        type: String
    },
    pointsBlue : {
        type: Number
    },
    pointsRed : {
        type: Number
    },
    date : {
        type: Date
    },
    winner : {
        type: Number
    }
});

export default mongoose.model('Match', Match);