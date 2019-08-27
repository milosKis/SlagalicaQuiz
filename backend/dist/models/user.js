"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    job: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String
    },
    birthday: {
        type: Date
    },
    photo: {
        type: String
    },
    status: {
        type: String
    },
    type: {
        type: String
    }
});
exports.default = mongoose_1.default.model('User', User);
//# sourceMappingURL=user.js.map