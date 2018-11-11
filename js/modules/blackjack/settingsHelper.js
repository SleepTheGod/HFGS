var HFBJSettings = localStorage.getItem('hf-bj-settings');

function appendSettings() {
    var fieldSetCSS = { "margin": "8 px", "border": "1px solid #0e0e0e", "padding": "8px", "border-radius": "4px" };

    // TODO: Snag Settings before appending
    $('td:contains("Disclaimer:  This blackjack table uses HF Bytes points which is our internal rewards system.")').parent()
        .before($("<tr>").append($("<td>").attr("colspan", "2").addClass("trow1").append($("<div>")
            .append($("<fieldset>").css(fieldSetCSS)
                .append($("<legend>").text("HF Gambler Suite: General Settings"))
                .append($("<label>").attr("for", "initialWagerInput").text("Initial Wager:")
                    .append($("<input>").attr({ "type": "number", "min": "2", "step": "1", "value": "", "id": "initialWagerInput" })
                        .addClass("textbox").css(
                            { "width": "75px", "min-width": "75px", "margin": "2px 5px" })
                    )
                )
                .append("<br>")
                .append($("<label>").attr("for", "runContinuously").text("Run continuously?").append($("<span>").text(" (Dangerous)").css("color", "red"))
                    .append($("<input>").attr({ "type": "checkbox", "id": "runContinuously" })
                    )
                )
                .append("<br>")
                .append($("<label>").attr("for", "gamesPerSession").text("Games per Session:")
                    .append($("<input>").attr({ "type": "number", "min": "1", "step": "1", "value": "", "id": "gamesPerSession" })
                        .addClass("textbox").css(
                            { "width": "75px", "min-width": "75px", "margin": "2px 5px" })
                    )
                )
                .append("<br>")
                .append($("<label>").attr("for", "manuallyConfirmGame").text("Manually confirm each game?")
                    .append($("<input>").attr({ "type": "checkbox", "id": "manuallyConfirmGame" })
                    )
                )
            ))))
        // Martingale Strategy
        .before($("<tr>").append($("<td>").attr("colspan", "2").addClass("trow1")
            .append($("<div>")
                .append($("<fieldset>").css(fieldSetCSS)
                    .append($("<legend>").text("HF Gambler Suite: Martingale Strategy"))
                    .append($("<span>").text("Martingale multiplies your wager after each consecutive loss. " +
                        "The wager will reset to your initial wager amount once you win. ").css("color", "red"))
                    .append("<br>")
                    .append($("<span>").text("This strategy can lead to BIG losses if you are unlucky or have a small amount of bytes." +
                        " USE AT YOUR OWN RISK!").css("color", "red"))
                    .append("<br>")
                    .append($("<label>").attr("for", "enableMartingaleStrategy").text("Enable")
                        .append($("<input>").attr({ "type": "checkbox", "id": "enableMartingaleStrategy" }))
                    ).append("<br>")
                    .append($("<label>").attr("for", "wagerMultiplier").text("Wager Multiplier:")
                        .append($("<input>").attr({ "type": "number", "min": "2", "step": ".01", "value": "", "id": "wagerMultiplier" })
                            .addClass("textbox").css(
                                { "width": "75px", "min-width": "75px", "margin": "2px 5px" })
                        )
                    )
                )
            )
        )
        );
    loadSettings();
    /* Event handlers */
    // Wager amount
    $("#initialWagerInput").change(function () {
        // Set variable
        wagerAmt = $(this).val();
        // Save Settings
        saveSettings();
    });
    // Run continuously
    $("#runContinuously").change(function () {
        // Set variable
        runContinuously = $(this).is(':checked');
        if (runContinuously) {
            $("#gamesPerSession").prop("disabled", true).css("display", "none");
        } else {
            $("#gamesPerSession").prop("disabled", false).css("display", "");
        }
        // Save Settings
        saveSettings();
    });
    // Games per session
    $("#gamesPerSession").change(function () {
        // Set variable
        gamesPerSession = $(this).val();
        // Save Settings
        saveSettings();
    });
    // Manually confirm each game
    $("#manuallyConfirmGame").change(function () {
        // Set variable
        confirmEachGame = $(this).is(':checked');
        // Save Settings
        saveSettings();
    });
    // Martingale strategy
    $("#enableMartingaleStrategy").change(function () {
        // Set variable
        useMartingaleStrat = $(this).is(':checked');
        if (useMartingaleStrat) {
            $("#wagerMultiplier").prop("disabled", true).css("display", "none");
        } else {
            $("#wagerMultiplier").prop("disabled", false).css("display", "");
        }
        // Save Settings
        saveSettings();
    });
    // Wager multiplier
    $("#wagerMultiplier").change(function () {
        // Set variable
        wagerMultiplier = $(this).val();
        // Save Settings
        saveSettings();
    });
}

function loadSettings() {
    if (HFBJSettings === null) {
        HFBJSettings = {
            initialWagerInput: 2,
            runContinuously: false,
            gamesPerSession: 5,
            manuallyConfirmGame: true,
            enableMartingaleStrategy: false,
            wagerMultiplier: 2.25
        }
        setSettings(HFBJSettings);

    } else {
        HFBJSettings = JSON.parse(HFBJSettings);
        setSettings(HFBJSettings);
    }
    wagerAmt = parseInt(HFBJSettings.initialWagerInput);
    confirmEachGame = HFBJSettings.manuallyConfirmGame;
    gamesPerSession = HFBJSettings.gamesPerSession;
    runContinuously = HFBJSettings.runContinuously;
    useMartingaleStrat = HFBJSettings.enableMartingaleStrategy;
    wagerMultiplier = HFBJSettings.wagerMultiplier;
}

function setSettings(settings) {
    $("#initialWagerInput").val(settings.initialWagerInput);
    $("#runContinuously").prop('checked', settings.runContinuously);
    $("#gamesPerSession").val(settings.gamesPerSession);
    $("#manuallyConfirmGame").prop('checked', settings.manuallyConfirmGame);
    $("#enableMartingaleStrategy").prop('checked', settings.enableMartingaleStrategy);
    $("#wagerMultiplier").val(settings.wagerMultiplier);
}

function saveSettings() {
    // Set UI
    HFBJSettings.initialWagerInput = $("#initialWagerInput").val();
    HFBJSettings.runContinuously = $("#runContinuously").is(':checked');
    HFBJSettings.gamesPerSession = $("#gamesPerSession").val();
    HFBJSettings.manuallyConfirmGame = $("#manuallyConfirmGame").is(':checked');
    HFBJSettings.enableMartingaleStrategy = $("#enableMartingaleStrategy").is(':checked');
    HFBJSettings.wagerMultiplier = $("#wagerMultiplier").val();
    // Save to local storage
    localStorage.setItem('hf-bj-settings', JSON.stringify(HFBJSettings));
}