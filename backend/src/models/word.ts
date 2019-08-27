import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';
const Schema = mongoose.Schema;

let Word = new Schema({
    Term : {
        type: String
    }
});

export default mongoose.model('Word', Word);