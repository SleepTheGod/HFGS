function hfPostRequest(url, data, cont) {
    setTimeout(function () {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: false,
            success: function (data) {
                var jsonObj = jQuery.parseJSON(data);
                updateTableUI(); // ?
                if (jsonObj.balance) {
                    updatenewBytes(jsonObj);
                    // Update dealer's ahnd
                    setDealerHand(parseHFDealerHand(jsonObj));
                    // Update your hands
                    setYourHand(jsonObj.data.hand1.hand_cards);
                    // Update your hand total
                    updateYourHandTotal(jsonObj.data.hand1.hand_value);
                }
                // HF Response
                if (jsonObj.balance && cont) {
                    gameID = jsonObj.data.game_id;
                    actionID = jsonObj.data.action_id;
                    console.log("SINGLE GAME RESULT: " + getSingleGameResult(jsonObj));
                    if (getSingleGameResult(jsonObj) == "FOLD"
                        || getSingleGameResult(jsonObj) == "TIE"
                        || getSingleGameResult(jsonObj) == "WIN-BLACKJACK"
                        || getSingleGameResult(jsonObj) == "WIN"
                        || getSingleGameResult(jsonObj) == "LOSE"
                        || getSingleGameResult(jsonObj) == "SURRENDER") {
                        setGameResult(getSingleGameResult(jsonObj));
                        updateWagerAmount(jsonObj);
                        startNextGame();
                    } else {
                        advisorPostRequest(bjAdvisorURL, generateRawData(data));
                    }
                } else {
                    console.log("Result: " + getSingleGameResult(jsonObj) + " (" + getSingleGamePayout(jsonObj) + ")");
                    setGameResult(getSingleGameResult(jsonObj));
                    updateWagerAmount(jsonObj);
                    startNextGame();
                }

            },
        });
    }, 500);
}

function advisorPostRequest(url, data) {
    //
    $.ajax({
        type: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            'Accept': "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest"
        },
        url: url,
        data: data,
        crossDomain: true,
        async: false,
        success: function (result, textStatus, jqXHR) {
            console.log("result: ", result);
            var jsonObj = jQuery.parseJSON(result);
            console.log("BEST OPTION: " + jsonObj.best);
            setHandResult(jsonObj.best);
            setOddsDisplay(getActionOdds(jsonObj));
            // Set hand total value
            updateYourHandTotal(jsonObj.sum);
            // Desired Action - On HF
            bestAction = jsonObj.best;
            if (bestAction == "stand") {
                hfPostRequest(hfActionStandURL, generateHFRawData(), false);
            } else if (bestAction == "hit") {
                hfPostRequest(hfActionHitURL, generateHFRawData(), true);
            } else if (bestAction == "double") {
                hfPostRequest(hfActionDoubleURL, generateHFRawData(), true);
            } else if (bestAction == "split") {
                // TODO: Additional Logic for actual split
                hfPostRequest(hfActionStandURL, generateHFRawData(), false);
            } else if (bestAction == "surrender") {
                hfPostRequest(hfActionSurrenderURL, generateHFRawData(), false);
            }
        }
    });
}

function getActionOdds(jsonObj) {
    return jsonObj.a;
}

function getSingleGamePayout(jsonObj) {
    return parseInt(jsonObj.data.payout) / wagerAmt;
}

function getSingleGameResult(jsonObj) {
    return jsonObj.data.outcome1;
}

function generateHFRawData() {
    return "gameId=" + gameID + "&actionId=" + actionID + "&my_post_key=" + myPostKey;
}

function generateRawData(json) {
    var rawDataString = "dealerCard=" + parseHand(getDealerHand(json))
        + "&playerCards=" + parseHand(getMyHand(json))
        + "&numDecks=" + numDecks
        + "&hitSoft17=" + hitSoft17
        + "&double=" + double
        + "&doubleSoft=" + doubleSoft
        + "&doubleAfterHit=" + doubleAfterHit
        + "&doubleAfterSplit=" + doubleAfterSplit
        + "&resplit=" + resplit
        + "&lateSurrender=" + lateSurrender;

    return rawDataString;
}