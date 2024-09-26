let inEndScreenState = { preload: loadAssets, create: initialiseGame, update: gameUpdate }

function loadAssets () {
    game.load.image("youWin", "imgs/gameOver_win.png");
    game.load.image("youLost", "imgs/gameOver_lost.png");
    game.load.image("menu", "imgs/menu.png");
}

function initialiseGame () {
    if(zone == 4){
        var spriteEndScreen = game.add.sprite(400, 300, "youWin");
        spriteEndScreen.anchor.setTo(0.5);
    }
    if(lost == true){
        var spriteEndScreen = game.add.sprite(400, 300, "youLost");
        spriteEndScreen.anchor.setTo(0.5);
    }

    var text_money = game.add.text(400, 300, "Total money: " + totalMoney, {
        fontSize: "32px",
        color: "#000000",
        align: "center",
        fixedWidth: 120
    });
    text_money.anchor.setTo(0.5);

    var text_gems = game.add.text(400, 350, "Total gems: " + totalGems, {
        fontSize: "32px",
        color: "#000000",
        align: "center",
        fixedWidth: 120
    });
    text_gems.anchor.setTo(0.5);

    var text_score = game.add.text(400, 400, "Score: " + totalGameMoney, {
        fontSize: "32px",
        color: "#000000",
        align: "center",
        fixedWidth: 120
    });
    text_score.anchor.setTo(0.5);

    var button_goMenu = game.add.sprite(400, 500, "menu")
    button_goMenu.anchor.setTo(0.5);
    button_goMenu.inputEnabled = true;
    button_goMenu.scale.setTo(0.2);

    button_goMenu.events.onInputDown.add(() => {
        clickSound.play();
        game.state.start("inMenu");
    });
}

function gameUpdate () {

}