function updateHistoryTable() {
    if (HFBJ.logs.length > 0) {
        const trCSS = {};
        const tdRightAlignAttribute = { "align": "right" };
        const dateFormat = {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        };
        clearHistoryTable(false);
        // http://www.javascripttutorial.net/javascript-array-sort/
        var tempLog = HFBJ.logs.sort(function (x, y) {
            return y.Date - x.Date;
        });
        $.each(HFBJ.logs, function (index, value) {
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
        HFBJ.logs = tempLog;
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