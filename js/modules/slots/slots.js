/* Global Constants */
const myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
const hfActionSlotsURL = "https://hackforums.net/slots/spin.php";
/* Global Variables */
var gamesPerSession; // how many games to play automatically
var slotsResponse;
var windowID;
var gamesPlayed = 0;
var origByteBalance;
var currentBalance = 0;
var newByteBalance;
var HFGS = localStorage.getItem('hf-gs');
var betAmount = parseInt($("#bet").text());
//initializeLogFromMemory(); // Init Log
// Current Game Stats
var isBotRunning = false;

appendSlotsUI();

// Toggle Bot click event
$("#toggleSlotBot").click(function () {
    if (!isBotRunning) {
        isBotRunning = true;
        $("#toggleSlotBot").text("Stop Bot");
        if (confirm("Are you sure you want to start the script?")) {
            setWagerTotal();
            initialWager = wagerAmt;
            hfPostRequest(hfActionDealURL, dealHandBody, true);
        }
    } else {
        isBotRunning = false;
        $("#toggleBJBot").text("Start Bot");
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

// Append UI Changes
console.clear();

function appendSlotsUI() {
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
    clearHistoryTable(true);
}