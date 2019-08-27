"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const sockets = require('./sockets');
sockets.startSockets();
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
mongoose_1.default.connect('mongodb://localhost:27017/slagalica');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('mongo open');
});
const router = express_1.default.Router();
const user_1 = __importDefault(require("./models/user"));
const pen_1 = __importDefault(require("./models/pen"));
const match_1 = __importDefault(require("./models/match"));
const Word_1 = __importDefault(require("./models/Word"));
const gameday_1 = __importDefault(require("./models/gameday"));
const pair_game_1 = __importDefault(require("./models/pair-game"));
const gameDayResult_1 = __importDefault(require("./models/gameDayResult"));
const association_1 = __importDefault(require("./models/association"));
router.route('/login').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    user_1.default.find({ 'username': username, 'password': password }, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});
router.route('/user').post((req, res) => {
    let username = req.body.username;
    user_1.default.find({ 'username': username }, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});
router.route('/user/multiple').post((req, res) => {
    let usernames = req.body.usernames;
    user_1.default.find({ 'username': { $in: usernames } }, (err, users) => {
        if (err)
            console.log(err);
        else {
            var array = [];
            for (var i = 0; i < users.length; i++) {
                var username = usernames[i];
                var index = 0;
                for (index = 0; index < users.length; index++)
                    if (users[index].username == username)
                        break;
                array[i] = users[index];
            }
            res.json(array);
        }
    });
});
router.route('/requests').post((req, res) => {
    user_1.default.find({ 'status': 'nonactive' }, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});
router.route('/requests/activate').post((req, res) => {
    let username = req.body.username;
    user_1.default.findOneAndUpdate({ 'username': username }, { $set: { 'status': 'active' } }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/requests/delete').post((req, res) => {
    let username = req.body.username;
    user_1.default.findOneAndDelete({ 'username': username }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/password-change').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    user_1.default.findOneAndUpdate({ 'username': username }, { $set: { 'password': password } }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/register').post((req, res) => {
    let user = new user_1.default(req.body);
    user.save().
        then(user => {
        res.status(200).json({ 'user': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'user': 'no' });
    });
});
router.route('/match/create-request').post((req, res) => {
    let match = new match_1.default(req.body);
    match.save().
        then(match => {
        res.status(200).json({ 'match': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'match': 'no' });
    });
});
router.route('/match/requests').post((req, res) => {
    match_1.default.find({ 'playerRed': '' }, (err, match) => {
        if (err)
            console.log(err);
        else
            res.json(match);
    });
});
router.route('/match/all-matches').post((req, res) => {
    match_1.default.find({}, (err, match) => {
        if (err)
            console.log(err);
        else
            res.json(match);
    });
});
router.route('/match/all-matches-for-previous-days').post((req, res) => {
    let date = req.body.date;
    match_1.default.find({ 'date': { $gte: date } }, (err, match) => {
        if (err)
            console.log(err);
        else
            res.json(match);
    });
});
router.route('/match/all-matches-for-player-for-previous-days').post((req, res) => {
    let username = req.body.username;
    let date = req.body.date;
    match_1.default.find({ $or: [{ 'playerBlue': username }, { 'playerRed': username }], 'date': { $gte: date } }, (err, match) => {
        if (err)
            console.log(err);
        else
            res.json(match);
    });
});
router.route('/match/insert-match-data').post((req, res) => {
    let match = new match_1.default(req.body);
    match.save().
        then(match => {
        res.status(200).json({ 'match': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'match': 'no' });
    });
});
router.route('/word/check').post((req, res) => {
    let term = req.body.Term;
    Word_1.default.find({ 'Term': term }, (err, words) => {
        if (err)
            console.log(err);
        else {
            if (words && words[0])
                res.json(true);
            else
                res.json(false);
        }
    });
});
router.route('/word/insert').post((req, res) => {
    let word = new Word_1.default(req.body);
    word.save().
        then(word => {
        res.status(200).json({ 'word': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'word': 'no' });
    });
});
router.route('/pairs/insert').post((req, res) => {
    let pairs = new pair_game_1.default(req.body);
    pairs.save().
        then(pair => {
        res.status(200).json({ 'pairs': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'pairs': 'no' });
    });
});
router.route('/game-day/insert').post((req, res) => {
    let gameDay = new gameday_1.default(req.body);
    gameDay.save().
        then(gameDay => {
        res.status(200).json({ 'gameDay': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'gameDay': 'no' });
    });
});
router.route('/associations/insert').post((req, res) => {
    let associations = new association_1.default(req.body);
    associations.save().
        then(associations => {
        res.status(200).json({ 'associations': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'associations': 'no' });
    });
});
router.route('/associations/get-all').post((req, res) => {
    association_1.default.find({}, (err, assoc) => {
        if (err)
            console.log(err);
        else
            res.json(assoc);
    });
});
router.route('/get-todays-game').post((req, res) => {
    let date = req.body.date;
    gameday_1.default.find({ 'date': date }, (err, games) => {
        if (err)
            console.log(err);
        else
            res.json(games);
    });
});
router.route('/pairs/get-all').post((req, res) => {
    pair_game_1.default.find({}, (err, pairs) => {
        if (err)
            console.log(err);
        else
            res.json(pairs);
    });
});
router.route('/game-day-result/create').post((req, res) => {
    let gameDayResult = new gameDayResult_1.default(req.body);
    gameDayResult.save().
        then(gameDayResult => {
        res.status(200).json({ 'game-day-result': 'ok' });
    }).catch(err => {
        res.status(400).json({ 'game-day-result': 'no' });
    });
});
router.route('/game-day-result/get').post((req, res) => {
    let date = req.body.date;
    let username = req.body.username;
    gameDayResult_1.default.find({ 'date': date, 'username': username }, (err, results) => {
        if (err)
            console.log(err);
        else
            res.json(results);
    });
});
router.route('/game-day-result/get-sorted').post((req, res) => {
    let date = req.body.date;
    gameDayResult_1.default.find({ 'date': date }, null, { sort: { points: -1 } }, (err, results) => {
        if (err)
            console.log(err);
        else
            res.json(results);
    });
});
router.route('/news').get((req, res) => {
    user_1.default.findOne({ 'username': 'admin' }, (err, user) => {
        if (err)
            console.log(err);
        else {
            res.json(user.get('news'));
        }
    });
});
router.route('/pens/:owner').get((req, res) => {
    pen_1.default.find({ 'vlasnik': req.params.owner }, (err, pens) => {
        if (err)
            console.log(err);
        else {
            res.json(pens);
        }
    });
});
router.route('/majstor/:username').get((req, res) => {
    user_1.default.find({ 'type': 'majstor', 'username': req.params.username }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/majstor').get((req, res) => {
    user_1.default.find({ 'type': 'majstor' }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/vacation').post((req, res) => {
    let username = req.body.username;
    console.log("USAO U METODU");
    console.log(username);
    user_1.default.findOneAndUpdate({ 'username': username }, { $set: { 'status': 'neaktivan' } }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/addJob').post((req, res) => {
    let username = req.body.username;
    let jobName = req.body.jobName;
    user_1.default.findOneAndUpdate({ 'username': username }, { $push: { 'jobs': { 'naziv': jobName } } }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
router.route('/delete').post((req, res) => {
    let username = req.body.username;
    user_1.default.findOneAndDelete({ 'username': username }, (err, users) => {
        if (err)
            console.log(err);
        else {
            res.json(users);
        }
    });
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map