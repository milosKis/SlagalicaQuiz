"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Association = new Schema({
    A: {
        A1: String,
        A2: String,
        A3: String,
        A4: String,
        A_sol: String
    },
    B: {
        B1: String,
        B2: String,
        B3: String,
        B4: String,
        B_sol: String
    },
    C: {
        C1: String,
        C2: String,
        C3: String,
        C4: String,
        C_sol: String
    },
    D: {
        D1: String,
        D2: String,
        D3: String,
        D4: String,
        D_sol: String
    },
    final_sol: String
});
exports.default = mongoose_1.default.model('Association', Association);
//# sourceMappingURL=association.js.map