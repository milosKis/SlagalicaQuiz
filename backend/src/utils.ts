
function generateLettersCombination() {
    var letters = [];
    for (var i = 0; i < 12; i++) {
        var number = Math.floor(Math.random() * 30) + 1;
        switch(number) {
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
    return letters;
}

exports.utils = generateLettersCombination;