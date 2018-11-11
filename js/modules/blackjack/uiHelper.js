function updateYourHandTotal(sum) {
    $("#playerHand1").find(".cardsValueSign").attr("style", "display:").text(sum.replace(/\D/g, ''));
}

function getAmountColor(amount) {
    var color = "#C3C3C3";
    if (amount > 0) {
        color = "#00B500";
    } else if (amount < 0) {
        color = "#FF2121";
    }
    return color;
}

function getResultColor(result) {
    var color = "#C3C3C3";
    switch (result) {
        case "WIN": color = "#C5B358";
            break;
        case "WIN-BLACKJACK": color = "#C5B358";
            break;
        case "TIE": color = "#586ac5";
            break;
        case "FOLD": color = "#ff1919";
            break;
        case "LOSE": color = "#ff1919";
            break;
        case "SURRENDER": color = "#EEE9E9";
            break;
        default: color = "#949494";
    }
    return color;
}

function updatenewBytes(jsonObj) {
    $("#currentBalance").text(jsonObj.balance);
}

function setYourHand(array) {
    $("#playerHand1").find(".cardsContainer").empty();
    // Set hand - cards
    for (var i = 0; i < array.length; i++) {
        // Sets hand card
        $("#playerHand1").find(".cardsContainer").append(createCard(array[i], i));
    }
}

function setDealerHandTotal(jsonObj) {
    $("#dealerHand").find(".cardsValueSign").attr("style", "display:").text(jsonObj.data.dealer.hand_value);
}

function setWagerTotal() {
    $("#playerHand1").find(".betValueSign").attr("style", "display:").text(wagerAmt);
}

function setDealerHand(array) {
    $("#dealerHand").find(".cardsContainer").empty();
    // Set hand - cards
    for (var i = 0; i < array.length; i++) {
        // Sets hand card
        $("#dealerHand").find(".cardsContainer").append(createCard(array[i], i));
    }
}

function setHandResult(result) {
    $("#playerHand1").find(".cardsOutcomeSign").attr("style", "display:").text(result);
}

function setOddsDisplay(array) {
    $("#rules > ul").empty();
    for (var key in array) {
        if (array.hasOwnProperty(key)) {
            $("#rules > ul").append($("<li>").text(key + ": " + array[key]));
        }
    }
}

function getCardSuit(card) {
    return card.substr(card.length - 1);
}

function getCardValue(card) {
    return card.substr(0, card.length - 1);
}

function createCard(card, index) {
    var offset = calcOffset(card);
    return '<div class="card" style="background-position: ' + offset.x + 'px ' + offset.y +
        'px; display: block; text-indent: 0px; transform: rotateY(0deg); left: ' + (4 + (13 * index)) + 'px" data-card="' + card + '"></div>';
}

function calcOffset(card) {
    var x = -949, y = 0; // Back of cards
    if (card != "back" && card != "XX") {
        var suits = { 'c': 0, 's': 1, 'h': 2, 'd': 3 }; // Order of the suits in the sprites file
        x = -(getCardValue(card) - 1) * 73;
        y = -suits[getCardSuit(card)] * 98;
    }
    return { x: x, y: y };
}

function setGameResult(result) {
    $("#playerHand1").find(".handOutcomeSign").attr("style", "display:").text(result);
    var bytesGained;
    const winBlackJackMultiplier = 2.5;
    const winMultiplier = 1;
    const tieMultiplier = 0;
    const loseMultiplier = -1;
    const surrenderMultiplier = -.5;
    switch (result) {
        case "WIN-BLACKJACK":
            bytesGained = wagerAmt * winBlackJackMultiplier;
            break;
        case "WIN":
            bytesGained = wagerAmt * winMultiplier;
            break;
        case "TIE":
            bytesGained = wagerAmt * tieMultiplier;
            break;
        case "FOLD":
            bytesGained = wagerAmt * loseMultiplier;
            break;
        case "LOSE":
            bytesGained = wagerAmt * loseMultiplier;
            break;
        case "SURRENDER":
            bytesGained = wagerAmt * surrenderMultiplier;
            break;
        default:
            bytesGained = 0;
    }
    // Add log entry
    var dateTimeNow = new Date().getTime();
    var logEntry = { "Date": dateTimeNow, "Result": result, "AmountWon": bytesGained, "AmountWagered": wagerAmt };
    HFBJ.logs.push(logEntry);
    // Session
    latestWinAmt = bytesGained;
    sessionTotalGames++;
    sessionTotalBet += wagerAmt;
    if (bytesGained > 0) {
        sessionTotalWon += bytesGained;
    }
    sessionNet = (sessionTotalWon - sessionTotalBet) + sessionTotalWon;
    // Overall
    overallTotalGames++
    HFBJ.totalGames = overallTotalGames;
    overallTotalBet += parseInt(wagerAmt);
    HFBJ.totalBet = overallTotalBet;

    if (bytesGained > 0) {
        overallTotalWon += bytesGained
        HFBJ.totalWon = overallTotalWon;
    }
    overallTotalNet = (HFBJ.totalWon - HFBJ.totalBet) + HFBJ.totalWon;
    localStorage.setItem('hf-bj', JSON.stringify(HFBJ));
    updateStats(false);
}