import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';

const Schema = mongoose.Schema;

let PairGame = new Schema({
    description : {
        type: String
    },
    pairs : {
        type: Array
    }
});

export default mongoose.model('PairGame', PairGame);