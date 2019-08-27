import mongoose from 'mongoose';
import { Binary, BSON } from 'bson';

const Schema = mongoose.Schema;

let User = new Schema({
    firstName : {
        type: String
    },
    lastName : {
        type: String
    },
    email : {
        type : String
    },
    job : {
        type : String
    },
    username : {
        type: String
    },
    password : {
        type: String
    },
    gender : {
        type: String
    },
    birthday : {
        type : Date
    },
    photo : {
        type : String
    },
    status: {
        type: String
    },
    type: {
        type: String
    }
});

export default mongoose.model('User', User);