let inMenuState = {
    preload: preloadMenu,
    create: createMenu,
    update: updateMenu
};

let pagina = 0;
let linkText1;
let linkText2;
let linkText3;
let linkText4;
var menuMusic;

function preloadMenu () {
    game.load.image("buttonCredits", "imgs/credits.png");
    game.load.image("buttonInstructions", "imgs/instructions.png");
    game.load.image("buttonStart", "imgs/start.png");
    game.load.image("buttonReturn", "imgs/return.png");
    game.load.image("title","imgs/titulo.png");
    game.load.image("background","imgs/background.jpg");
    game.load.image("buttoneasy","imgs/easy.png");
    game.load.image("buttonmedium","imgs/medium.png");
    game.load.image("buttonhard","imgs/hard.png");
    game.load.image("easyelegido","imgs/easyelegido.png");
    game.load.image("mediumelegido","imgs/mediumelegido.png");
    game.load.image("hardelegido","imgs/hardelegido.png");
    game.load.image("buttonplay","imgs/play.png");
    game.load.image("cuadrodetexto","imgs/cuadrodetexto.png");
    game.load.image("next","imgs/next.png");
    game.load.image("back","imgs/back.png");
    game.load.image("wasd","imgs/wasd.png");
    game.load.image("creditsin","imgs/creditsin.png");
    game.load.image("FlipendoEnjoyers","imgs/FlipendoEnjoyers.png")
    game.load.image("R","imgs/R.png");
    game.load.image("F","imgs/F.png");
    game.load.image("clickizq","imgs/clickizq.png");
    game.load.image("decor8","imgs/decor_8.png");
    game.load.image("decor2","imgs/decor_2.png");
    game.load.image("artused","imgs/artused.png");
    game.load.image("esc","imgs/esc.png");
    game.load.image("unlockZone","imgs/unlockZone.png");

    game.load.audio("button","sounds/button.wav");
    game.load.audio("MenuZombies", "sounds/MenuZombies.wav");
}

function createMenu () {
    let background = game.add.sprite(0,0,"background");
    let buttonInstructions = game.add.sprite(400, 350, "buttonInstructions");
    let buttonCredits = game.add.sprite(400, 480, "buttonCredits");
    let buttonReturnMenu = game.add.sprite(750, 550, "buttonReturn");
    let buttonStart = game.add.sprite(400, 220, "buttonStart");
    let buttoneasy = game.add.sprite(400, 120, "buttoneasy");
    let buttonmedium = game.add.sprite(400, 250, "buttonmedium");
    let buttonhard = game.add.sprite(400, 380, "buttonhard");
    let buttonplay = game.add.sprite(400, 520,"buttonplay");

    let title = game.add.sprite(400, 80, "title");
    let cuadrodetexto = game.add.sprite(400,300,"cuadrodetexto");
    let creditsin = game.add.sprite(400,150,"creditsin");
    let FlipendoEnjoyers = game.add.sprite(400, 100,"FlipendoEnjoyers");
    let artused = game.add. sprite(400,300,"artused");

    let wasd = game.add.sprite(340,280,"wasd")
    let next = game.add.sprite(600, 550,"next");
    let back = game.add.sprite(200,550,"back");
    let R = game.add.sprite(330,300,"R");
    let F = game.add.sprite(450,318,"F");
    let clickizq = game.add.sprite(280,300,"clickizq");
    let esc = game.add.sprite(290,300,"esc");

    let decor8 = game.add.sprite(220,90,"decor8");
    let decor2 = game.add.sprite(400,430,"decor2");
    let unlockZone = game.add.sprite(400,180,"unlockZone");
    menuMusic = game.add.audio("MenuZombies");
    menuMusic.loop = true;
    menuMusic.play();

    let nextTimer = null;
    let backTimer = null;

    var elementsToScale = [
        { element: buttonplay, scale: 0.12 },
        { element: buttoneasy, scale: 0.2 },
        { element: buttonmedium, scale: 0.2 },
        { element: buttonhard, scale: 0.2 },
        { element: buttonStart, scale: 0.2 },
        { element: buttonCredits, scale: 0.2 },
        { element: buttonInstructions, scale: 0.2 },
        { element: buttonReturnMenu, scale: 0.1 },
        { element: cuadrodetexto, scale: 0.5 },
        { element: next, scale: 0.15 },
        { element: back, scale: 0.15 },
        { element: wasd, scale: 0.4 },
        { element: creditsin, scale: 0.4 },
        { element: artused, scale: 0.5 },
        { element: FlipendoEnjoyers, scale: 1 },
        { element: R, scale: 1 },
        { element: F, scale: 1 },
        { element: clickizq, scale: 1 },
        { element: esc, scale: 1 },
        { element: decor2, scale: 0.5 },
        { element: unlockZone, scale: 0.5 }
    ];

    textoInstrucciones = game.add.text(420,300,"To move",{
        font: "28px Arial",
        fill: "#000000",
        align:"center"
    });
    const originalTextPosition = { x: 420, y: 300 };
    let clickSound = game.add.audio("button");

buttonInstructions.events.onInputOver.add(onOver, this);
buttonInstructions.events.onInputOut.add(onOut, this);

function onOver() {
    if (this.shakeTween) {
        this.shakeTween.stop();
    }


    buttonInstructions.originalX = buttonInstructions.x;
    buttonInstructions.originalY = buttonInstructions.y;


    this.shakeTween = this.add.tween(buttonInstructions)
        .to({ x: buttonInstructions.originalX - 2 }, 50, Phaser.Easing.Bounce.InOut, true, 0, -1, true)
        .to({ x: buttonInstructions.originalX + 2 }, 50, Phaser.Easing.Bounce.InOut, true, 0, -1, true);
}

function onOut() {

    if (this.shakeTween) {
        this.shakeTween.stop();
    }

    buttonInstructions.x = buttonInstructions.originalX;
    buttonInstructions.y = buttonInstructions.originalY;
}


buttonInstructions.originalX = buttonInstructions.x;
buttonInstructions.originalY = buttonInstructions.y;
var buttons = [buttonStart, buttonCredits, buttonInstructions, buttonReturnMenu, buttoneasy, buttonmedium, buttonhard, buttonplay];
var textObjects = [title, cuadrodetexto, textoInstrucciones, next, back, wasd, creditsin, artused, FlipendoEnjoyers, R, clickizq, F, esc, decor2, unlockZone];

buttons.forEach(function(button) {
    button.anchor.setTo(0.5);
});

textObjects.forEach(function(textObject) {
    textObject.anchor.setTo(0.5);
});

    background.width = game.width;
    background.height = game.height;

    
    function setScale(element) {
        element.element.scale.setTo(element.scale);
    }
    
    elementsToScale.forEach(setScale);

    buttonStart.inputEnabled = true;
    buttonCredits.inputEnabled = true;
    buttonInstructions.inputEnabled = true;
    buttonReturnMenu.inputEnabled = true;
    buttoneasy.inputEnabled = true;
    buttonmedium.inputEnabled = true;
    buttonhard.inputEnabled = true;
    buttonplay.inputEnabled = true;

    next.inputEnabled = true;
    back.inputEnabled = true;
    
    buttoneasy.visible = false;
    buttonmedium.visible = false;
    buttonhard.visible = false;
    buttonReturnMenu.visible = false;
    buttonplay.visible = false;

    cuadrodetexto.visible = false;
    textoInstrucciones.visible = false;

    next.visible = false;
    back.visible = false;
    wasd.visible = false;
    creditsin.visible = false;
    FlipendoEnjoyers.visible = false;
    artused.visible = false;
    R.visible = false;
    clickizq.visible = false;
    F.visible = false;
    decor8.visible = false;
    decor2.visible = false;
    esc.visible = false;
    unlockZone.visible = false;

    buttonplay.events.onInputDown.add(() => {
        clickSound.play();
        menuMusic.stop();
        game.state.start("inGame")
    });

    buttonStart.events.onInputOver.add(onStartOver, this);
    buttonStart.events.onInputOut.add(onStartOut, this);
    
    function onStartOver() {

        if (this.shakeTweenStart) {
            this.shakeTweenStart.stop();
        }
    
   
        buttonStart.originalX = buttonStart.x;
        buttonStart.originalY = buttonStart.y;
    
        this.shakeTweenStart = this.add.tween(buttonStart)
            .to({ x: buttonStart.originalX - 2 }, 50, Phaser.Easing.Bounce.InOut, true, 0, -1, true)
            .to({ x: buttonStart.originalX + 2 }, 50, Phaser.Easing.Bounce.InOut, true, 0, -1, true);
    }
    
    function onStartOut() {
   
        if (this.shakeTweenStart) {
            this.shakeTweenStart.stop();
        }
    
    
        buttonStart.x = buttonStart.originalX;
        buttonStart.y = buttonStart.originalY;
    }
    
  
    buttonStart.originalX = buttonStart.x;
    buttonStart.originalY = buttonStart.y;
    
   
    buttonStart.events.onInputDown.add(() => {
        clickSound.play();
        buttoneasy.visible = true;
        buttonmedium.visible = true;
        buttonhard.visible = true;
    
        buttonStart.visible = false;
        buttonInstructions.visible = false;
        buttonCredits.visible = false;
    
        buttonReturnMenu.visible = true;
        title.visible = false;
    });

    buttoneasy.events.onInputDown.add(() => {
        clickSound.play();
        buttoneasy.loadTexture("easyelegido");
        buttonhard.loadTexture("buttonhard");
        buttonmedium.loadTexture("buttonmedium");
        buttonplay.visible = true;

        difficulty = 0;
    });

    buttonmedium.events.onInputDown.add(() => {
        clickSound.play();
        buttonmedium.loadTexture("mediumelegido");
        buttoneasy.loadTexture("buttoneasy");
        buttonhard.loadTexture("buttonhard");
        buttonplay.visible = true;

        difficulty = 1;
    });
    
    buttonhard.events.onInputDown.add(() => {
        clickSound.play();
        buttonhard.loadTexture("hardelegido");
        buttoneasy.loadTexture("buttoneasy");
        buttonmedium.loadTexture("buttonmedium");
        buttonplay.visible = true;

        difficulty = 2;
    });
    
buttonCredits.events.onInputOver.add(onCreditsOver, this);
buttonCredits.events.onInputOut.add(onCreditsOut, this);

function onCreditsOver() {

    if (this.shakeTweenCredits) {
        this.shakeTweenCredits.stop();
    }


    buttonCredits.originalX = buttonCredits.x;
    buttonCredits.originalY = buttonCredits.y;

 
    this.shakeTweenCredits = this.add.tween(buttonCredits)
        .to({ x: buttonCredits.originalX - 2 }, 50, Phaser.Easing.Bounce.InOut, true, 0, -1, true)
        .to({ x: buttonCredits.originalX + 2 }, 50, Phaser.Easing.Bounce.InOut, true, 0, -1, true);
}

function onCreditsOut() {

    if (this.shakeTweenCredits) {
        this.shakeTweenCredits.stop();
    }


    buttonCredits.x = buttonCredits.originalX;
    buttonCredits.y = buttonCredits.originalY;
}

buttonCredits.originalX = buttonCredits.x;
buttonCredits.originalY = buttonCredits.y;

buttonCredits.events.onInputDown.add(() => {
    clickSound.play();
    title.visible = false;
    buttonStart.visible = false;
    buttonCredits.visible = false;
    buttonInstructions.visible = false;
    buttonReturnMenu.visible = true;
    creditsin.visible = true;
    artused.visible = true;
    FlipendoEnjoyers.visible = true;

    createLinkTexts();
});

    buttonInstructions.events.onInputDown.add(() => {
        clickSound.play();
        buttonStart.visible = false;
        buttonInstructions.visible = false;
        buttonCredits.visible = false;
        title.visible = false;
        textoInstrucciones.visible = true;
        pagina = 1;
        console.log(pagina);
        if (pagina==1){
            clickizq.visible = false;
            textoInstrucciones.setText("To move");
            textoInstrucciones.position.set(460, 300);
            wasd.visible = true;
        }

        cuadrodetexto.visible = true;
        buttonReturnMenu.visible = true;
        next.visible = true;
        back.visible = false;
    });

    next.events.onInputDown.add(() => {
        clickSound.play();
        if(next.inputEnabled){
            next.inputEnabled = false;
            back.inputEnabled = false;
            buttonReturnMenu.inputEnabled = false;
            nextTimer = setTimeout(() => {
                next.inputEnabled = true;
                back.inputEnabled = true;
                buttonReturnMenu.inputEnabled = true;
                nextTimer = null;
                pagina++;
                wasd.visible= false;
            
                switch(pagina) {
                    case 2:
                        textoInstrucciones.setText("Left click to shoot");
                        textoInstrucciones.position.set(420,300);
                        back.visible = true;
                        clickizq.visible = true;
                        break;
                    case 3:
                        textoInstrucciones.setText("To reload");
                        R.visible = true;
                        clickizq.visible = false;
                        break;
                    case 4:
                        textoInstrucciones.setText("Find the shop or the ammo station \n and press        to buy \n dont stay more than 10s!");
                        textoInstrucciones.position.set(430, 310);
                        F.visible = true;
                        F.position.set(453,312);
                        R.visible = false;
                        decor8.visible = true;
                        decor2.visible = true;
                        break;
                    case 5:
                        textoInstrucciones.setText("Find the new area with a new enemy \n and press key       to unlock");
                            F.visible = true;
                            F.position.set(453,318);
                            decor8.visible = false;
                            decor2.visible = false;
                            unlockZone.visible = true;
                            textoInstrucciones.position.set(originalTextPosition.x, originalTextPosition.y);
                            break;
                    case 6:
                        textoInstrucciones.setText("Press        to open the in-game menu");
                        F.visible = false;
                        esc.visible = true;
                        unlockZone.visible = false;
                        next.visible = false;
                        break;
                    default:
                        break;
                }
            }, 2000);
        }
    });

    next.events.onInputUp.add(() => {
        if (!nextEnabled && nextTimer !== null) {
            clearTimeout(nextTimer); 
            nextEnabled = true; 
            backEnabled = true;
        }
    });
    
    back.events.onInputDown.add(() => {
        clickSound.play();
        if(back.inputEnabled){
            back.inputEnabled = false;
            next.inputEnabled = false;
            buttonReturnMenu.inputEnabled = false;
            backTimer = setTimeout(() => {
                back.inputEnabled = true;
                next.inputEnabled = true;
                buttonReturnMenu.inputEnabled = true;
                backTimer = null;
                pagina--;
                console.log(textoInstrucciones);
            
                switch(pagina) {
                    case 1:
                        textoInstrucciones.setText("To move");
                        back.visible = false;
                        wasd.visible = true;
                        clickizq.visible = false;
                        break;
                    case 2:
                        textoInstrucciones.setText("Left click to shoot");
                        back.visible = true;
                        clickizq.visible = true;
                        R.visible = false;
                        break;
                    case 3:
                        textoInstrucciones.setText("To reload");
                        R.visible = true;
                        clickizq.visible = false;
                        F.visible = false;
                        decor8.visible = false;
                        decor2.visible = false;
                        next.visible = true;
                        textoInstrucciones.position.set(originalTextPosition.x, originalTextPosition.y);
                        break;
                    case 4:
                        textoInstrucciones.setText("Find the shop or the ammo station \n and Press        to buy \n dont stay more than 10 seconds!");
                        textoInstrucciones.position.set(430, 310);
                        F.visible = true;
                        F.position.set(453,312);
                        R.visible = false;
                        next.visible = true;
                        decor8.visible = true;
                        decor2.visible = true;
                        esc.visible = false;
                        unlockZone.visible = false;
                        break;
                    case 5:
                        textoInstrucciones.setText("Find the new area with a new enemy \n and press key       to unlock");
                        F.position.set(453,318);
                        F.visible = true;
                        esc.visible = false;
                        decor8.visible = false;
                        decor2.visible = false;
                        unlockZone.visible = true;
                        next.visible = true;
                        break;
                    case 6:
                        textoInstrucciones.setText("Press        to open the in-game menu");
                        F.visible = false;
                        esc.visible = true;
                        unlockZone.visible = false;
                        next.visible = false;
                        break;
                    default:
                        break;
                }
            },2000);
        }
    });

    back.events.onInputUp.add(() => {
        if (!backEnabled && backTimer !== null) {
            clearTimeout(backTimer); 
            backEnabled = true; 
            nextEnabled = true;
        }
    });

    buttonReturnMenu.events.onInputDown.add(() => {
        clickSound.play();
        
        buttonhard.loadTexture("buttonhard");
        buttoneasy.loadTexture("buttoneasy");
        buttonmedium.loadTexture("buttonmedium");
        
        buttonStart.visible = true;
        buttonInstructions.visible = true;
        buttonCredits.visible = true;

        buttonReturnMenu.visible = false;

        buttoneasy.visible = false;
        buttonmedium.visible = false;
        buttonhard.visible = false;
        buttonplay.visible = false;
        cuadrodetexto.visible = false;
        next.visible = false;
        back.visible = false;
        wasd.visible = false;
        creditsin.visible = false;
        artused.visible = false;
        FlipendoEnjoyers.visible = false;
        title.visible = true;
        textoInstrucciones.visible = false;
        R.visible = false;
        clickizq.visible = false;
        F.visible = false;
        decor8.visible = false;
        decor2.visible = false;
        esc.visible = false;
        unlockZone.visible = false;
        linkText1.visible = false;
        linkText2.visible = false;
        linkText3.visible = false;
        linkText4.visible = false;
        if (linkText1) {
            linkText1.destroy();
            linkText2.destroy();
            linkText3.destroy();
            linkText4.destroy();
        }
    });
}
function createLinkTexts() {
    linkText1 = game.add.text(300, 350, 'Visit CraftPix.net', { fill: '#0f0', fontSize: '18px', fontWeight: 'bold' });
    linkText1.inputEnabled = true;
    linkText1.events.onInputUp.add(function () {
        window.open("https://craftpix.net/freebies/free-2d-rpg-desert-tileset/?num=8&count=253&sq=tiles&pos=1", "_blank");
    });

    linkText2 = game.add.text(300, 400, 'Animated zombie', { fill: '#0f0', fontSize: '18px', fontWeight: 'bold' });
    linkText2.inputEnabled = true;
    linkText2.events.onInputUp.add(function () {
        window.open("https://opengameart.org/content/animated-top-down-zombie", "_blank");
    });

    linkText3 = game.add.text(300, 450, 'Animated Survivor Player', { fill: '#0f0', fontSize: '18px', fontWeight: 'bold' });
    linkText3.inputEnabled = true;
    linkText3.events.onInputUp.add(function () {
        window.open("https://opengameart.org/content/animated-top-down-survivor-player", "_blank");
    });

    linkText4 = game.add.text(300, 500, 'Explosion animation', { fill: '#0f0', fontSize: '18px', fontWeight: 'bold' });
    linkText4.inputEnabled = true;
    linkText4.events.onInputUp.add(function () {
        window.open("https://opengameart.org/content/explosion", "_blank");
    });
}

function updateMenu () {
  
}