"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pair_game_1 = __importDefault(require("./models/pair-game"));
const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
function startSockets() {
    var position = {
        x: 200,
        y: 200
    };
    var bluePlayers = [];
    var sockets = [];
    var matches = [];
    var words = [];
    var correctWords = [];
    var numbers = [];
    var correctNumbers = [];
    var combinations = [];
    var allPairs = [];
    var allRightColumns = [];
    var settedPairs = [];
    Socketio.on("connection", function (socket) {
        socket.emit("updateMatchRequests", bluePlayers);
        socket.on("createMatchRequest", username => {
            sockets[username] = socket;
            bluePlayers.push(username);
            Socketio.emit("updateMatchRequests", bluePlayers);
        });
        socket.on("acceptMatchRequest", data => {
            sockets[data.redPlayer] = socket;
            var index = bluePlayers.indexOf(data.bluePlayer);
            bluePlayers.splice(index, 1);
            var letters = generateLettersCombination();
            Socketio.emit("updateMatchRequests", bluePlayers);
            const newData = {
                bluePlayer: data.bluePlayer,
                redPlayer: data.redPlayer,
                letters: letters
            };
            var date = getTodaysDate();
            let matchData = {
                date: date,
                bluePlayer: data.bluePlayer,
                redPlayer: data.redPlayer,
                bluePoints: 0,
                redPoints: 0,
                count: 0
            };
            matches.push(matchData);
            sockets[data.bluePlayer].emit("startMatch", newData);
            sockets[data.redPlayer].emit("startMatch", newData);
        });
        socket.on("wordGameOver", data => {
            var i = 0;
            for (i = 0; i < matches.length; i++) {
                if (matches[i].bluePlayer == data.username || matches[i].redPlayer == data.username) {
                    break;
                }
            }
            matches[i].count++;
            words[data.username] = data.word;
            correctWords[data.username] = data.correct;
            if (matches[i].count == 2) {
                matches[i].count = 0;
                var blueWord = words[matches[i].bluePlayer];
                var redWord = words[matches[i].redPlayer];
                var blueWordCorrect = correctWords[matches[i].bluePlayer];
                var redWordCorrect = correctWords[matches[i].redPlayer];
                if (blueWordCorrect && redWordCorrect) {
                    if (blueWord.length > redWord.length) {
                        matches[i].bluePoints += blueWord.length * 2;
                    }
                    else if (blueWord.length < redWord.length) {
                        matches[i].redPoints += redWord.length * 2;
                    }
                    else {
                        matches[i].bluePoints += blueWord.length * 2;
                        matches[i].redPoints += redWord.length * 2;
                    }
                }
                else if (blueWordCorrect) {
                    matches[i].bluePoints += blueWord.length * 2;
                }
                else if (redWordCorrect) {
                    matches[i].redPoints += redWord.length * 2;
                }
                var numbers = generateNumbersCombination();
                const resultData = {
                    bluePoints: matches[i].bluePoints,
                    redPoints: matches[i].redPoints,
                    blueWord: blueWord,
                    redWord: redWord,
                    numbers: numbers
                };
                sockets[matches[i].bluePlayer].emit("startNumberGame", resultData);
                sockets[matches[i].redPlayer].emit("startNumberGame", resultData);
                //matches.splice(i, 1);
            }
        });
        socket.on("numberGameOver", data => {
            var i = 0;
            for (i = 0; i < matches.length; i++) {
                if (matches[i].bluePlayer == data.username || matches[i].redPlayer == data.username) {
                    break;
                }
            }
            matches[i].count++;
            numbers[data.username] = data.number;
            correctNumbers[data.username] = data.correct;
            if (matches[i].count == 2) {
                matches[i].count = 0;
                var blueNumber = numbers[matches[i].bluePlayer];
                var redNumber = numbers[matches[i].redPlayer];
                var blueDifference = Math.abs(data.numberToFind - blueNumber);
                var redDifference = Math.abs(data.numberToFind - redNumber);
                var blueNumberCorrect = correctNumbers[matches[i].bluePlayer];
                var redNumberCorrect = correctNumbers[matches[i].redPlayer];
                if (blueNumberCorrect && redNumberCorrect) {
                    if (blueDifference < redDifference) {
                        matches[i].bluePoints += 10;
                    }
                    else if (blueDifference > redDifference) {
                        matches[i].redPoints += 10;
                    }
                    else {
                        matches[i].bluePoints += 5;
                        matches[i].redPoints += 5;
                    }
                }
                else if (blueNumberCorrect) {
                    matches[i].bluePoints += 10;
                }
                else if (redNumberCorrect) {
                    matches[i].redPoints += 10;
                }
                //var numbers = generateNumbersCombination();
                var blueCombination = generateCombinations();
                var redCombination = generateCombinations();
                const resultData = {
                    bluePoints: matches[i].bluePoints,
                    redPoints: matches[i].redPoints,
                    blueNumber: blueNumber,
                    redNumber: redNumber,
                    blueCorrect: correctNumbers[matches[i].bluePlayer],
                    redCorrect: correctNumbers[matches[i].redPlayer],
                    blueCombination: blueCombination,
                    redCombination: redCombination
                };
                sockets[matches[i].bluePlayer].emit("startCombinationGame", resultData);
                sockets[matches[i].redPlayer].emit("startCombinationGame", resultData);
            }
        });
        socket.on("combinationGameTry", data => {
            if (data.isBlue) {
                sockets[data.redPlayer].emit("combinationGameTry", data);
            }
            else {
                sockets[data.bluePlayer].emit("combinationGameTry", data);
            }
        });
        socket.on("combinationGameOver", data => {
            var i = 0;
            for (i = 0; i < matches.length; i++) {
                if (matches[i].bluePlayer == data.bluePlayer || matches[i].redPlayer == data.redPlayer)
                    break;
            }
            //dodato pocetak
            if (data.isBlue) {
                pair_game_1.default.find({}, (err, pairs) => {
                    if (err)
                        console.log(err);
                    else {
                        var length = pairs.length;
                        var index1 = Math.floor(Math.random() * length);
                        if (index1 == length)
                            index1--;
                        var index2 = index1;
                        while (index2 == index1) {
                            index2 = Math.floor(Math.random() * length);
                            if (index2 == length)
                                index2--;
                        }
                        var pairGames = [];
                        var rightColumns = [];
                        pairGames[0] = pairs[index1];
                        pairGames[1] = pairs[index2];
                        rightColumns[0] = shuffleArray(getRightColumn(pairGames[0]));
                        rightColumns[1] = shuffleArray(getRightColumn(pairGames[1]));
                        allPairs[i] = pairGames;
                        allRightColumns[i] = rightColumns;
                        const newData = {
                            data: data,
                            pairs: pairGames,
                            rightColumns: rightColumns
                        };
                        sockets[data.redPlayer].emit("combinationGameOver", newData);
                        if (data.successfull)
                            matches[i].bluePoints += 10;
                    }
                });
            }
            else {
                const newData = {
                    data: data,
                    pairs: allPairs[i],
                    rightColumns: allRightColumns[i]
                };
                sockets[data.bluePlayer].emit("combinationGameOver", newData);
                if (data.successfull)
                    matches[i].redPoints += 10;
            }
        });
        socket.on("pairsGameTry", data => {
            if (data.isBlue) {
                sockets[data.redPlayer].emit("pairsGameTry", data);
            }
            else {
                sockets[data.bluePlayer].emit("pairsGameTry", data);
            }
        });
        socket.on("startNewPairsGame", data => {
            sockets[data.username].emit("startNewPairsGame", data);
        });
        socket.on("pairsGameOver", data => {
            var i = 0;
            for (i = 0; i < matches.length; i++)
                if (matches[i].redPlayer == data.redPlayer && matches[i].bluePlayer == data.bluePlayer)
                    break;
            matches[i].bluePoints += data.bluePoints;
            matches[i].redPoints += data.redPoints;
            sockets[data.bluePlayer].emit("pairsGameOver", data);
            sockets[data.redPlayer].emit("pairsGameOver", data);
            let matchData = {
                playerBlue: matches[i].bluePlayer,
                playerRed: matches[i].redPlayer,
                pointsBlue: matches[i].bluePoints,
                pointsRed: matches[i].redPoints,
                date: matches[i].date,
                winner: 0
            };
            //let match = new Match(matchData);
            matches.splice(i, 1); // ovo posle izostaviti!
            // match.save().
            // then(match=>{}).catch(err=>{
            //     console.log("Error saving match data!");
            // });
            // Match.create(matchData, function (err : any, small : any) {
            //     if (err) console.log(err);
            //     // saved!
            //     })
        });
        socket.on("continuePairsGame", data => {
            sockets[data.username].emit("continuePairsGame", data);
        });
    });
    Http.listen(3000, () => {
        console.log("Listening at port 3000");
    });
    function generateLettersCombination() {
        var letters = [];
        for (var i = 0; i < 9; i++) {
            var number = Math.floor(Math.random() * 30) + 1;
            switch (number) {
                case 1:
                    letters.push("a");
                    break;
                case 2:
                    letters.push("b");
                    break;
                case 3:
                    letters.push("v");
                    break;
                case 4:
                    letters.push("g");
                    break;
                case 5:
                    letters.push("d");
                    break;
                case 6:
                    letters.push("đ");
                    break;
                case 7:
                    letters.push("e");
                    break;
                case 8:
                    letters.push("ž");
                    break;
                case 9:
                    letters.push("z");
                    break;
                case 10:
                    letters.push("i");
                    break;
                case 11:
                    letters.push("j");
                    break;
                case 12:
                    letters.push("k");
                    break;
                case 13:
                    letters.push("l");
                    break;
                case 14:
                    letters.push("lj");
                    break;
                case 15:
                    letters.push("m");
                    break;
                case 16:
                    letters.push("n");
                    break;
                case 17:
                    letters.push("nj");
                    break;
                case 18:
                    letters.push("o");
                    break;
                case 19:
                    letters.push("p");
                    break;
                case 20:
                    letters.push("r");
                    break;
                case 21:
                    letters.push("s");
                    break;
                case 22:
                    letters.push("t");
                    break;
                case 23:
                    letters.push("ć");
                    break;
                case 24:
                    letters.push("u");
                    break;
                case 25:
                    letters.push("f");
                    break;
                case 26:
                    letters.push("h");
                    break;
                case 27:
                    letters.push("c");
                    break;
                case 28:
                    letters.push("č");
                    break;
                case 29:
                    letters.push("dž");
                    break;
                case 30:
                    letters.push("š");
                    break;
            }
        }
        for (var i = 0; i < 3; i++) {
            var number = Math.floor(Math.random() * 5) + 1;
            switch (number) {
                case 1:
                    letters.push("a");
                    break;
                case 2:
                    letters.push("e");
                    break;
                case 3:
                    letters.push("i");
                    break;
                case 4:
                    letters.push("o");
                    break;
                case 5:
                    letters.push("u");
                    break;
            }
        }
        return letters;
    }
    function generateNumbersCombination() {
        var numbers = [];
        var number;
        for (var i = 0; i < 4; i++) {
            number = Math.floor(Math.random() * 9) + 1;
            numbers.push(number);
        }
        number = Math.floor(Math.random() * 3) + 1;
        switch (number) {
            case 1:
                numbers.push(10);
                break;
            case 2:
                numbers.push(15);
                break;
            case 3:
                numbers.push(20);
                break;
        }
        number = Math.floor(Math.random() * 4) + 1;
        switch (number) {
            case 1:
                numbers.push(25);
                break;
            case 2:
                numbers.push(50);
                break;
            case 3:
                numbers.push(75);
                break;
            case 4:
                numbers.push(100);
                break;
        }
        number = Math.floor(Math.random() * 999) + 1;
        numbers.push(number);
        return numbers;
    }
    function generateCombinations() {
        var combination = [];
        for (var i = 0; i < 4; i++) {
            var number = Math.floor(Math.random() * 5);
            combination.push(number);
        }
        return combination;
    }
    function getRightColumn(pairGame) {
        var rightColumn = [];
        for (var i = 0; i < pairGame.pairs.length; i++)
            rightColumn[i] = pairGame.pairs[i].right;
        return rightColumn;
    }
    function shuffleArray(array) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            newArray[i] = array[i];
        }
        for (var i = newArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = temp;
        }
        return newArray;
    }
    function getTodaysDate() {
        var date = new Date();
        date.setHours(0);
        date.setUTCHours(0);
        date.setMinutes(0);
        date.setUTCMinutes(0);
        date.setSeconds(0);
        date.setUTCSeconds(0);
        date.setMilliseconds(0);
        date.setUTCMilliseconds(0);
        return date;
    }
}
exports.startSockets = startSockets;
//ovde se zavrsava kod za sockete
//# sourceMappingURL=sockets.js.map