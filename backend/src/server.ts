import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const sockets = require('./sockets');
sockets.startSockets();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/slagalica');

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('mongo open');
})

const router = express.Router();

import User from './models/user';
import Pen from './models/pen';
import Match from './models/match';
import Word from './models/Word';
import GameDay from './models/gameday';
import PairGame from './models/pair-game';
import GameDayResult from './models/gameDayResult';
import Association from './models/association';
import { Socket } from 'dgram';

router.route('/login').post(
    (req, res)=>{
        let username = req.body.username;
        let password = req.body.password;

        User.find({'username':username, 'password':password},
         (err,user)=>{
            if(err) console.log(err);
            else res.json(user);
        })
    }
);

router.route('/user').post(
    (req, res)=>{
        let username = req.body.username;

        User.find({'username':username},
         (err,user)=>{
            if(err) console.log(err);
            else res.json(user);
        })
    }
);

router.route('/user/multiple').post(
    (req, res)=>{
        let usernames = req.body.usernames;
        User.find({'username': { $in : usernames}},
         (err,users : any[])=>{
            if(err) console.log(err);
            else {
                var array : any = [];
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
        })
    }
);

router.route('/requests').post(
    (req, res)=>{
        User.find({'status':'nonactive'},
         (err,user)=>{
            if(err) console.log(err);
            else res.json(user);
        })
    }
);

router.route('/requests/activate').post(
    (req, res)=>{
        let username = req.body.username;
        User.findOneAndUpdate({'username' : username}, 
            {$set : {'status' : 'active'}}, (err, users)=> {
                if (err) console.log(err);
                else {
                    res.json(users);
                }
            }
        )
    }
);

router.route('/requests/delete').post(
    (req, res)=>{
    let username = req.body.username;
    User.findOneAndDelete({'username':username},
      (err, users)=>{
        if(err) console.log(err);
        else{
            res.json(users);
        }
    })
});

router.route('/password-change').post(
    (req, res)=>{
        let username = req.body.username;
        let password = req.body.password;
        User.findOneAndUpdate({'username' : username}, 
            {$set : {'password' : password}}, (err, users)=> {
                if (err) console.log(err);
                else {
                    res.json(users);
                }
            }
        )
    }
);

router.route('/register').post((req, res)=>{
    let user = new User(req.body);
    user.save().
        then(user=>{
            res.status(200).json({'user':'ok'});
        }).catch(err=>{
            res.status(400).json({'user':'no'});
        })
});

router.route('/match/create-request').post((req, res)=>{
    let match = new Match(req.body);
    match.save().
        then(match=>{
            res.status(200).json({'match':'ok'});
        }).catch(err=>{
            res.status(400).json({'match':'no'});
        })
});

router.route('/match/requests').post(
    (req, res)=>{
        Match.find({'playerRed':''},
         (err,match)=>{
            if(err) console.log(err);
            else res.json(match);
        })
    }
);

router.route('/match/all-matches').post(
    (req, res)=>{
        Match.find({},
         (err,match)=>{
            if(err) console.log(err);
            else res.json(match);
        })
    }
);

router.route('/match/all-matches-for-previous-days').post(
    (req, res)=>{
        let date = req.body.date;
        Match.find({'date' : {$gte : date}},
         (err,match)=>{
            if(err) console.log(err);
            else res.json(match);
        })
    }
);

router.route('/match/all-matches-for-player-for-previous-days').post(
    (req, res)=>{
        let username = req.body.username;
        let date = req.body.date;
        Match.find({ $or : [{'playerBlue' : username}, {'playerRed' : username}], 'date' : {$gte : date}},
         (err,match)=>{
            if(err) console.log(err);
            else res.json(match);
        })
    }
);

router.route('/match/insert-match-data').post((req, res)=>{
    let match = new Match(req.body);
    match.save().
        then(match=>{
            res.status(200).json({'match':'ok'});
        }).catch(err=>{
            res.status(400).json({'match':'no'});
        })
});

router.route('/word/check').post(
    (req, res)=>{
        let term = req.body.Term;
        Word.find({'Term': term},
         (err,words)=>{
            if(err) console.log(err);
            else {
                if (words && words[0])
                    res.json(true);
                else    
                    res.json(false);
            }
        })
    }
);

router.route('/word/insert').post(
    (req, res)=>{
        let word = new Word(req.body);
        word.save().
        then(word=>{
            res.status(200).json({'word':'ok'});
        }).catch(err=>{
            res.status(400).json({'word':'no'});
        })
    }
);

router.route('/pairs/insert').post(
    (req, res)=>{
        let pairs = new PairGame(req.body);
        pairs.save().
        then(pair=>{
            res.status(200).json({'pairs':'ok'});
        }).catch(err=>{
            res.status(400).json({'pairs':'no'});
        })
    }
);

router.route('/game-day/insert').post(
    (req, res)=>{
        let gameDay = new GameDay(req.body);
        gameDay.save().
        then(gameDay=>{
            res.status(200).json({'gameDay':'ok'});
        }).catch(err=>{
            res.status(400).json({'gameDay':'no'});
        })
    }
);

router.route('/associations/insert').post(
    (req, res)=>{
        let associations = new Association(req.body);
        associations.save().
        then(associations=>{
            res.status(200).json({'associations':'ok'});
        }).catch(err=>{
            res.status(400).json({'associations':'no'});
        })
    }
);

router.route('/associations/get-all').post(
    (req, res)=>{
        Association.find({},
         (err,assoc)=>{
            if(err) console.log(err);
            else res.json(assoc);
        })
    }
);

router.route('/get-todays-game').post(
    (req, res)=>{
        let date = req.body.date;
        GameDay.find({'date': date},
         (err,games)=>{
            if(err) console.log(err);
            else res.json(games);
        })
    }
);

router.route('/pairs/get-all').post(
    (req, res)=>{
        PairGame.find({},
         (err,pairs)=>{
            if(err) console.log(err);
            else res.json(pairs);
        })
    }
);

router.route('/game-day-result/create').post((req, res)=>{
    let gameDayResult = new GameDayResult(req.body);
    gameDayResult.save().
        then(gameDayResult=>{
            res.status(200).json({'game-day-result':'ok'});
        }).catch(err=>{
            res.status(400).json({'game-day-result':'no'});
        })
});

router.route('/game-day-result/get').post(
    (req, res)=>{
        let date = req.body.date;
        let username = req.body.username;
        GameDayResult.find({'date': date, 'username' : username},
         (err,results)=>{
            if(err) console.log(err);
            else res.json(results);
        })
    }
);

router.route('/game-day-result/get-sorted').post(
    (req, res)=>{
        let date = req.body.date;
        GameDayResult.find({'date': date}, null,
        {sort : {points : -1}},
         (err,results)=>{
            if(err) console.log(err);
            else res.json(results);
        })
    }
);



router.route('/news').get((req, res)=>{
    User.findOne({'username':'admin'}, (err, user)=>{
        if(err) console.log(err);
        else{
            res.json(user.get('news'));
        }
    })
})

router.route('/pens/:owner').get((req, res)=>{
    Pen.find({'vlasnik':req.params.owner}, (err, pens)=>{
        if(err) console.log(err);
        else{
            res.json(pens);
        }
    })
})

router.route('/majstor/:username').get((req, res)=>{
    User.find({'type': 'majstor', 'username' : req.params.username}, (err, users)=>{
        if(err) console.log(err);
        else{
            res.json(users);
        }
    })
})

router.route('/majstor').get((req, res)=>{
    User.find({'type': 'majstor'}, (err, users)=>{
        if(err) console.log(err);
        else{
            res.json(users);
        }
    })
})

router.route('/vacation').post((req, res)=>{
    let username = req.body.username;
    console.log("USAO U METODU");
    console.log(username);
    User.findOneAndUpdate({'username':username},
     {$set:{'status':'neaktivan'}}, (err, users)=>{
        if(err) console.log(err);
        else{
            res.json(users);
        }
    })
});


router.route('/addJob').post((req, res)=>{
    let username = req.body.username;
    let jobName = req.body.jobName;
    User.findOneAndUpdate({'username':username},
     {$push:{'jobs': {'naziv' : jobName}}}, (err, users)=>{
        if(err) console.log(err);
        else{
            res.json(users);
        }
    })
});

router.route('/delete').post((req, res)=>{
    let username = req.body.username;
    User.findOneAndDelete({'username':username},
      (err, users)=>{
        if(err) console.log(err);
        else{
            res.json(users);
        }
    })
});

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));