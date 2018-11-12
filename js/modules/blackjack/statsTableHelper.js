function initialStats() {
    const buttonCSS = { "margin": "5px 5px" };
    const hrAttribute = { "width": "175px", "align": "left" };
    const centerCSS = { "display": "flex", "justify-content": "center" };
    const tableCSS = { "display": "inline-block", "width": "175px", "text-align": "left" };
    overallTotalNet = (HFBJ.totalWon - HFBJ.totalBet) + HFBJ.totalWon;

    $("#PageContainer").parent().css("width", "800px");
    $("#PageContainer").parent().after($("<td>").addClass("trow1")
        .append($("<div>").css("height", $("#PageContainerInner").css("height"))
            .append($("<div>").attr("id", "hfbjStatsContainer"))));
    $('td:contains("This blackjack table uses HF Bytes points which is our internal rewards system.")').attr("colspan", "2");

    $("#hfbjStatsContainer").append($("<span>").attr("id", "currentBalanceLabel").text("Credits: ").css(tableCSS))
        .append($("<span>").attr("id", "currentBalance").text(currentBalance)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "wagerAmtLabel").text("Wager Amount: ").css(tableCSS))
        .append($("<span>").attr("id", "wagerAmt").text(wagerAmt)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "latestWinAmtLabel").text("Latest Win: ").css(tableCSS))
        .append($("<span>").attr("id", "latestWinAmt").text(latestWinAmt)).append("<br>");
    // Session
    $("#hfbjStatsContainer").append($("<hr>").attr(hrAttribute));
    $("#hfbjStatsContainer").append($("<b>").attr("id", "sessionLabel").text("Session").css(tableCSS)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "sessionTotalGamesLabel").text("Games Played (Session): ").css(tableCSS))
        .append($("<span>").attr("id", "sessionTotalGames").text(sessionTotalGames)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "sessionTotalBetLabel").text("Total Bet (Session): ").css(tableCSS))
        .append($("<span>").attr("id", "sessionTotalBet").text(sessionTotalBet)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "sessionTotalWonLabel").text("Total Won (Session): ").css(tableCSS))
        .append($("<span>").attr("id", "sessionTotalWon").css("color", getAmountColor(sessionTotalWon)).text(sessionTotalWon)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "sessionNetLabel").text("Net Gain (Session): ").css(tableCSS))
        .append($("<span>").attr("id", "sessionNet").css("color", getAmountColor(sessionNet)).text(sessionNet)).append("<br>");
    // Overall
    $("#hfbjStatsContainer").append($("<hr>").attr(hrAttribute));
    $("#hfbjStatsContainer").append($("<b>").attr("id", "overallLabel").text("Overall").css(tableCSS)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "overallTotalGamesLabel").text("Games Played (Overall): ").css(tableCSS))
        .append($("<span>").attr("id", "overallTotalGames").text(overallTotalGames)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "overallTotalBetLabel").text("Total Bet (Overall): ").css(tableCSS))
        .append($("<span>").attr("id", "overallTotalBet").text(overallTotalBet)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "overallTotalWonLabel").text("Total Won (Overall): ").css(tableCSS))
        .append($("<span>").attr("id", "overallTotalWon").css("color", getAmountColor(overallTotalWon)).text(overallTotalWon)).append("<br>");
    $("#hfbjStatsContainer").append($("<span>").attr("id", "overallTotalNetLabel").text("Net Gain (Overall): ").css(tableCSS))
        .append($("<span>").attr("id", "overallTotalNet").css("color", getAmountColor(overallTotalNet)).text(overallTotalNet)).append("<br>");

    // Buttons
    $("#hfbjStatsContainer").append($("<div>").css({ "padding-left": "40px" }).append($("<button>").attr("id", "toggleBJBot").text("Start Bot").css(buttonCSS))
        .append($("<button>").attr("id", "setBJBotMemory").text("Reset Logs").css(buttonCSS)));
    $("#hfbjStatsContainer").append("<br><br>");

    // History log
    const tableAttributes = { "border": "0", "cellspacing": "0", "cellpadding": "5", "class": "tborder", "id": "historyTable" };
    const tbodyCSS = {
        "overflow-y": "auto",
        "overflow-x": "hidden !important", "display": "block", "height": "250px"
    };
    const trCSS = {};
    $("#hfbjStatsContainer").after($("<table>").attr(tableAttributes)
        .append($("<tbody>").attr("id", "historyTabletbody").css(tbodyCSS)
            .append($("<tr>").css(trCSS)
                .append($("<td>").addClass("thead").attr("colspan", "4")
                    .append($("<strong>").text("HF BlackJack Bot History"))))
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
    updateHistoryTable();
}

function clearStats() {
    latestWinAmt = 0;
    sessionTotalGames = 0;
    sessionTotalBet = 0;
    sessionTotalWon = 0;
    sessionNet = 0;
    overallTotalGames = 0;
    overallTotalBet = 0;
    overallTotalWon = 0;
    overallTotalNet = 0;
    HFBJ = {
        totalGames: 0,
        totalBet: 0,
        totalWon: 0,
        logs: [],
    };
    updateStats(true);
}

function updateStats(clearValues) {
    if (!clearValues) {
        sessionNet = (sessionTotalWon - sessionTotalBet) + sessionTotalWon;
        overallTotalNet = (HFBJ.totalWon - HFBJ.totalBet) + HFBJ.totalWon;
    }
    // Update stats table
    $("#wagerAmt").text(wagerAmt);
    $("#latestWinAmt").text(latestWinAmt);
    $("#sessionTotalGames").text(sessionTotalGames);
    $("#sessionTotalBet").text(sessionTotalBet);
    $("#sessionTotalWon").text(sessionTotalWon).css("color", getAmountColor(sessionTotalWon));
    $("#sessionNet").text(sessionNet).css("color", getAmountColor(sessionNet));
    $("#overallTotalGames").text(overallTotalGames);
    $("#overallTotalBet").text(overallTotalBet);
    $("#overallTotalWon").text(overallTotalWon).css("color", getAmountColor(overallTotalWon));
    $("#overallTotalNet").text(overallTotalNet).css("color", getAmountColor(overallTotalNet));
    updateHistoryTable();
}

function updateTableUI() {
    // Player1
    $("#playerHand1").find(".cardsContainer").empty();
    $("#playerHand1").find(".cardsValueSign").attr("style", "display: none;");
    $("#playerHand1").find(".cardsOutcomeSign").attr("style", "display: none;");
    // Player 2
    $("#playerHand2").find(".cardsContainer").empty();
    // Dealer
    $("#dealerHand").find(".cardsContainer").empty();
    $("#dealerHand").find(".cardsValueSign").attr("style", "display: none;");
    $("#playerHand1").find(".handOutcomeSign").attr("style", "display: none;");
}