import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';

const Schema = mongoose.Schema;

let GameDay = new Schema({
    date : {
        type: Date
    },
    pairGame : {
        type: Schema.Types.Mixed
    },
    association : {
        type: Schema.Types.Mixed
    }
});

export default mongoose.model('GameDay', GameDay);