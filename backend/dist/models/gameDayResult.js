"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let GameDayResult = new Schema({
    date: {
        type: Date
    },
    username: {
        type: String
    },
    points: {
        type: Number
    }
});
exports.default = mongoose_1.default.model('GameDayResult', GameDayResult);
//# sourceMappingURL=gameDayResult.js.map