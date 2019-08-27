import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';

const Schema = mongoose.Schema;

let Pair = new Schema({
    left : {
        type: String
    },
    right : {
        type: String
    }
});

export default mongoose.model('Pair', Pair);