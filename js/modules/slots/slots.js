/* Global Constants */
const myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
const hfActionSlotsURL = "https://hackforums.net/slots/spin.php";
const gameDelayInMillis = 1000;
// Reel Math
const numIconsPerReel = 6; // Number of icons per reel
const stripHeight = 720; // Height of reel image in pixels
const alignmentOffset = 86; // Offset for reel to match container
// Reel Animations
const positioningTime = 0; // default: 200
const bounceHeight = 0; // default: 200
const bounceTime = 0; // default: 1000

var spinHandBody = "";
/* Global Variables */
var gamesPerSession = 25; // how many games to play automatically
var confirmEachGame = false; // confirm before each game
var slotsResponse;
var windowID;
var gamesPlayed = 0;
var currentBalance = 0;
var HFGS = localStorage.getItem('hf-gs');
var betAmount = parseInt($("#bet").text());
//initializeLogFromMemory(); // Init Log
// Current Game Stats
var isBotRunning = false;

initializeLogFromMemory();
appendSlotsUI();

// Toggle Bot click event
$("#toggleSlotBot").click(function () {
    if (!isBotRunning) {
        isBotRunning = true;
        $("#toggleSlotBot").text("Stop Bot");
        if (confirm("Are you sure you want to start the slots bot?")) {
            gameLogic(true);
        }
    } else {
        isBotRunning = false;
        $("#toggleSlotBot").text("Start Bot");
    }
});

$("#setSlotBotMemory").click(function () {
    if (confirm("Are you sure you want to clear all log history?")) {
        localStorage.removeItem('hf-gs');
        HFGS = {
            totalGames: 0,
            totalBet: 0,
            totalWon: 0,
            totalLost: 0,
            logs: [],
        };
        updateHistoryTable();
    }
});

function clearHistoryTable(isFreshClear) {
    $("#historyTabletbody").find("tr").each(function (index) {
        if (index > 1) {
            $(this).remove();
        }
    });
    if (isFreshClear) {
        $("#historyTabletbody").append($("<tr>").append($("<td>").addClass("trow1").attr("colspan", "4")
            .append($("<strong>").text("No History Found"))));
    }
}

function appendSlotsUI() {
    // Append UI Changes
    console.clear();
    // Shrink slots UI td
    $("#PageContainer").parent().css("width", $("#PageContainer").css("width"));
    // Append warning
    $('strong:contains("Risk your Bytes for a chance to win more!")').parent().parent()
        .after($("<tr>").css("color", "red").text("HF Gambling Suite: USE AT YOUR OWN RISK!"));
    // Append stats td
    $("#PageContainer").parent().after($("<td>").addClass("trow1")
        .append($("<div>").css("height", $("#PageContainerInner").css("height"))
            .append($("<div>").attr("id", "hfgsStatsContainer"))));
    // Append buttons
    const buttonCSS = { "margin": "5px 5px" };
    $("#hfgsStatsContainer").append($("<div>").css({ "padding-left": "40px" }).append($("<button>").attr("id", "toggleSlotBot").text("Start Bot").css(buttonCSS))
        .append($("<button>").attr("id", "setSlotBotMemory").text("Reset Logs").css(buttonCSS)));
    $("#hfgsStatsContainer").append("<br><br>");
    // Append slots history table
    const tableAttributes = { "border": "0", "cellspacing": "0", "cellpadding": "5", "class": "tborder", "id": "historyTable" };
    const tbodyCSS = {
        "overflow-y": "auto",
        "overflow-x": "hidden !important", "display": "block", "height": "250px"
    };
    const trCSS = {};
    $("#hfgsStatsContainer").after($("<table>").attr(tableAttributes)
        .append($("<tbody>").attr("id", "historyTabletbody").css(tbodyCSS)
            .append($("<tr>").css(trCSS)
                .append($("<td>").addClass("thead").attr("colspan", "4")
                    .append($("<strong>").text("HF Slots Bot History"))))
            .append($("<tr>").css(trCSS)
                .append($("<td>").addClass("tcat").attr("colspan", "1")
                    .append($("<strong>").text("Result")))
                .append($("<td>").addClass("tcat").attr("colspan", "1")
                    .append($("<strong>").text("Date")))
                .append($("<td>").addClass("tcat").attr("colspan", "1")
                    .append($("<strong>").text("Wagered")))
                .append($("<td>").addClass("tcat").attr("colspan", "1")
                    .append($("<strong>").text("Received")))
            )
        )
    );
    //clearHistoryTable(true);
    updateHistoryTable();
}

function gameLogic(isFreshStart) {
    if (gamesPlayed < gamesPerSession && isBotRunning) {
        var startGame = true;
        if (confirmEachGame && !isFreshStart) {
            if (!confirm("Play slots again?")) {
                startGame = false;
                isBotRunning = false;
                $("#toggleSlotBot").text("Start Bot");
            }
        }
        if (startGame) {
            startReel(1, 0);
            startReel(2, 0);
            startReel(3, 0);
            hfSlotsPostRequest(hfActionSlotsURL, setSpinHandBody());
        }
    } else {
        isBotRunning = false;
        $("#toggleSlotBot").text("Start Bot");
    }
}

function hfSlotsPostRequest(url, data) {
    //
    setTimeout(function () {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: false,
            success: function (data) {
                // {"reels":["5.0","3.0","3.5"],"prize":null,"success":true,"credits":1771,"dayWinnings":0,"lifetimeWinnings":1201}
                var jsonObj = jQuery.parseJSON(data);
                console.log(jsonObj);
                gamesPlayed++;
                // Stop Reels
                stopReels(jsonObj);
                // Set current bytes
                currentBalance = jsonObj.credits;
                $("#credits").text(currentBalance);
                // Determine Game Outcome
                determineGameOutcome(jsonObj);
                // Next Game
                gameLogic(false);
            }
        });
    }, gameDelayInMillis);
}

function determineGameOutcome(jsonObj) {
    var result;
    var bytesGained;
    /*
    HFGS = {
            totalGames: 0,
            totalBet: 0,
            totalWon: 0,
            totalLost: 0,
            logs: [],

        }
        */
    // If Loss
    if (jsonObj.prize == null) {
        result = "LOSS";
        bytesGained = -1 * betAmount;
    } else {
        result = "WIN";
        bytesGained = jsonObj.prize.payoutWinnings;
        // TODO: Highlight winning row? #trPrize_ + jsonObj.prize.id (returns row won) add whatever win class is
        // TODO: Also remove win once next game starts
    }
    // Add log entry
    var dateTimeNow = new Date().getTime();
    var logEntry = { "Date": dateTimeNow, "Result": result, "AmountWon": bytesGained, "AmountWagered": betAmount };
    HFGS.logs.push(logEntry);
    localStorage.setItem('hf-gs', JSON.stringify(HFGS));
    updateHistoryTable();
}

function updateHistoryTable() {
    if (HFGS.logs.length > 0) {
        const trCSS = {};
        const tdRightAlignAttribute = { "align": "right" };
        const dateFormat = {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        };
        clearHistoryTable(false);
        // http://www.javascripttutorial.net/javascript-array-sort/
        var tempLog = HFGS.logs.sort(function (x, y) {
            return y.Date - x.Date;
        });
        $.each(HFGS.logs, function (index, value) {
            $("#historyTabletbody").append($("<tr>").css(trCSS)
                .append($("<td>").addClass("trow1").attr("colspan", "1")
                    .append($("<strong>").text(value.Result).css("color", getResultColor(value.Result))))
                .append($("<td>").addClass("trow1").attr("colspan", "1")
                    .append($("<strong>").text(new Date(value.Date).toLocaleTimeString([], dateFormat))))
                .append($("<td>").addClass("trow1").attr("colspan", "1").attr(tdRightAlignAttribute)
                    .append($("<strong>").text(value.AmountWagered)))
                .append($("<td>").addClass("trow1").attr("colspan", "1").attr(tdRightAlignAttribute)
                    .append($("<strong>").text(value.AmountWon).css("color", getAmountColor(value.AmountWon))))
            )
        });
        HFGS.logs = tempLog;
    } else {
        clearHistoryTable(true);
    }
}

function clearHistoryTable(isFreshClear) {
    $("#historyTabletbody").find("tr").each(function (index) {
        if (index > 1) {
            $(this).remove();
        }
    });
    if (isFreshClear) {
        $("#historyTabletbody").append($("<tr>").append($("<td>").addClass("trow1").attr("colspan", "4")
            .append($("<strong>").text("No History Found"))));
    }
}

function setSpinHandBody() {
    // Bet
    const betStr = "bet=";
    betAmount = parseInt($("#bet").text())
    var betVal = betAmount;
    // Window ID
    const windowIDStr = "&windowID=";
    var windowIDVal = retrieveWindowVariables(["windowID"]);
    // Machine Name
    const machineName = "&machine_name=default";
    // My Post Key
    const myPostKeyStr = "&my_post_key=";
    // Spin Hand Body
    spinHandBody = betStr + betVal + windowIDStr + windowIDVal + machineName + myPostKeyStr + myPostKey;
    return spinHandBody;
}

function startReel(index, timeOffset) {
    const reelSpeed1Time = 0;
    const reelSpeed1Delta = 100;
    const reelSpeed2Delta = 100;
    const reelSpeedDifference = 0;

    var startTime = Date.now();
    var elReel = $('#reel' + index); // cache for performance
    elReel.css({ top: -(Math.random() * stripHeight * 2) }); // Change the initial position so that, if a screenshot is taken mid-spin, reels are mis-aligned
    var curPos = parseInt(elReel.css("top"), 10);

    var fnAnimation = function () {
        elReel.css({ top: curPos });

        if (Date.now() < startTime + reelSpeed1Time + timeOffset) {
            curPos += reelSpeed1Delta;
        } else {
            curPos += reelSpeed2Delta;
        }
        curPos += index * reelSpeedDifference;
        if (curPos > 0) { curPos = -stripHeight * 2; }

    };
    var timerID = window.setInterval(fnAnimation, 20);
    elReel.data("spinTimer", timerID);
}

function stopReels(jsonObj) {
    stopReel(1, jsonObj.reels[0]);
    stopReel(2, jsonObj.reels[1]);
    stopReel(3, jsonObj.reels[2]);
}

function stopReel(index, outcome) {
    var elReel = $('#reel' + index); // cache for performance
    var timerID = elReel.data("spinTimer");
    window.clearInterval(timerID);
    elReel.data("spinTimer", null);

    if (outcome != null) {
        // the whole strip repeats thrice, so we don't have to care about looping
        // alignmentOffset is kind of empirical...
        var distanceBetweenIcons = stripHeight / numIconsPerReel;
        var finalPosition = -stripHeight - ((outcome - 1) * distanceBetweenIcons) + alignmentOffset;


        // Animation two: Elastic Easing
        elReel.css({ top: finalPosition - stripHeight })
            .animate({ top: finalPosition + bounceHeight }, positioningTime, 'linear', function () {
                elReel.animate({ top: finalPosition }, bounceTime, 'easeOutElastic');
            });
    }
}

function retrieveWindowVariables(variables) {
    // Source: https://stackoverflow.com/a/24344154/2694643
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = $("body").attr("tmp_" + currVariable);
        $("body").removeAttr("tmp_" + currVariable);
    }

    $("#tmpScript").remove();

    return ret;
}

function getResultColor(result) {
    var color = "#C3C3C3";
    switch (result) {
        case "WIN": color = "#C5B358";
            break;
        case "LOSS": color = "#ff1919";
            break;
        default: color = "#949494";
    }
    return color;
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

function initializeLogFromMemory() {
    if (HFGS === null) {
        HFGS = {
            totalGames: 0,
            totalBet: 0,
            totalWon: 0,
            totalLost: 0,
            logs: [],

        }
    } else {
        HFGS = JSON.parse(HFGS);
    }
}