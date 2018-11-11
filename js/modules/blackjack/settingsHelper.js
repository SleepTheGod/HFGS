function appendSettings() {
    var fieldSetCSS = { "margin": "8 px", "border": "1px solid #0e0e0e", "padding": "8px", "border-radius": "4px" };

    // Snag Settings before appending
    $('td:contains("Disclaimer:  This blackjack table uses HF Bytes points which is our internal rewards system.")').parent()
        .before($("<tr>").append($("<td>").attr("colspan", "2").addClass("trow1").append($("<div>")
            .append($("<fieldset>").css(fieldSetCSS)
                .append($("<legend>").text("HF Gambler Suite: General Settings"))
                .append($("<label>").attr("for", "initialWagerInput").text("Initial Wager")
                    .append($("<input>").attr({ "type": "number", "min": "2", "step": "1", "value": "2", "id": "initialWagerInput" })
                        .addClass("textbox").css(
                            { "width": "75px", "min-width": "75px", "margin": "2px 5px" })
                    )
                )
            ))))
        .before($("<tr>").append($("<td>").attr("colspan", "2").addClass("trow1")
            .append($("<div>")
                .append($("<fieldset>").css(fieldSetCSS)
                    .append($("<legend>").text("HF Gambler Suite: Martingale Strategy"))
                    .append($("<span>").text("Martingale multiplies your wager after each consecutive loss. " +
                        "The wager will reset to your initial wager amount once you win. ").css("color", "red"))
                    .append("<br>")
                    .append($("<span>").text("This strategy can lead to BIG losses if you are unlucky." +
                        " USE AT YOUR OWN RISK!").css("color", "red"))
                    .append("<br>")
                    .append($("<label>").attr("for", "enableMartingaleStrategy")
                        .append($("<input>").attr({ "type": "checkbox", "id": "enableMartingaleStrategy" }))
                        .append("Enable")
                    ).append("<br>")
                    .append($("<label>").attr("for", "wagerMultiplier").text("Wager Multiplier")
                        .append($("<input>").attr({ "type": "number", "min": "2", "step": "1", "value": "2", "id": "wagerMultiplier" })
                            .addClass("textbox").css(
                                { "width": "75px", "min-width": "75px", "margin": "2px 5px" })
                        )
                    )
                )
            )
        )
        );
    // 

}