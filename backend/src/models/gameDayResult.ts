import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';

const Schema = mongoose.Schema;

let GameDayResult = new Schema({
    date : {
        type : Date
    },
    username : {
        type : String
    },
    points : {
        type : Number
    }
});

export default mongoose.model('GameDayResult', GameDayResult);