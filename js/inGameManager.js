// INITIALISE

let gameSettings;   
let inGameState = { preload: loadAssets, create: initialiseGame, update: gameUpdate }

function loadAssets () {
    game.load.image("background", "imgs/bg.png");
    game.load.image("background_2", "imgs/bg_level_2.png");
    game.load.image("background_3", "imgs/bg_level_3.png");
    game.load.image("safeArea", "imgs/safeArea.png");
    game.load.image("bullet_handgun", "imgs/bullet_handgun.png");
    game.load.image("bullet_shotgun", "imgs/bullet_shotgun.png");
    game.load.image("bullet_rifle", "imgs/bullet_rifle.png");
    game.load.image("zone_buyAmmu", "imgs/decor_8.png");
    game.load.image("zone_reloadAmmu", "imgs/decor_2.png");
    
    game.load.spritesheet("zombie1", "imgs/zombie1.png", 287, 263);
    game.load.spritesheet("zombie2", "imgs/zombie2.png", 287, 263);
    game.load.spritesheet("zombie3", "imgs/zombie3.png", 287, 263);
    game.load.spritesheet("char_handgun", "imgs/char_handgun.png", 258, 220);
    game.load.spritesheet("char_rifle", "imgs/char_rifle.png", 259, 171);
    game.load.spritesheet("char_shotgun", "imgs/char_shotgun.png", 259, 175);
    game.load.spritesheet("explosion", "imgs/explosion.png", 64, 64);

    game.load.image("shopBullets", "imgs/shopBullets.png");
    game.load.image("returnButton", "imgs/return.png");
    game.load.image("paused", "imgs/game_paused.png")

    game.load.image("buy_ShopButton", "imgs/buy_shopAmmu.png");
    game.load.image("confirm_ShopButton", "imgs/confirm_shopAmmu.png");
    game.load.image("cancel_ShopButton", "imgs/cancel_shopAmmu.png");
    game.load.image("continueButton", "imgs/continue.png");
    game.load.image("restartButton", "imgs/restart.png");
    game.load.image("return_to_menuButton", "imgs/menu.png");
    game.load.image("currentMoney", "imgs/currentMoney.png");
    game.load.image("money", "imgs/money.png");
    game.load.image("healthSprite", "imgs/health.png")
    
    game.load.image("fence1", "imgs/fence1.png");
    game.load.image("fence2", "imgs/fence2.png");
    game.load.image("barrier_1_NextLevel", "imgs/barrier_nextlvl.png");
    game.load.image("barrier_1_NextLevel_collide", "imgs/barrier_nextlvl.png");
    game.load.image("unlockZone", "imgs/unlockZone.png");
    game.load.image("shopUnlockZone", "imgs/shopUnlockZone.png");

    game.load.image("decor_4", "imgs/decor_4.png");
    game.load.image("decor_5", "imgs/decor_5.png");
    game.load.image("decor_6", "imgs/decor_6.png");
    game.load.image("decor_7", "imgs/decor_7.png");
    game.load.image("greenery_3", "imgs/greenery_3.png");
    game.load.image("greenery_6", "imgs/greenery_6.png");
    game.load.image("stone", "imgs/stone.png");
    
    game.load.image("gem", "imgs/gem.png");
    game.load.image("healthPowerUp", "imgs/healhtPowerUp.png");
    game.load.image("attackPowerUp", "imgs/bullet_shotgun.png");
    

    game.load.text("setUpMap", "json/setup_MAP.json", true);
    game.load.text("easy_JSON", "json/easy.json", true);
    game.load.text("medium_JSON", "json/medium.json", true);
    game.load.text("hard_JSON", "json/hard.json", true);

    game.load.audio("reload","sounds/reload.wav");
    game.load.audio("handgun_shoot","sounds/handgunShoot.wav");
    game.load.audio("rifle_shoot","sounds/rifleShoot.wav");
    game.load.audio("shotgun_shoot","sounds/shotgunShoot.wav");
    game.load.audio("button","sounds/button.wav");
    game.load.audio("error","sounds/error.wav");
    game.load.audio("explosion","sounds/explosion.wav");
    game.load.audio("money","sounds/money.wav");
    game.load.audio("zombieSpawn","sounds/zombieSpawn.wav");
    game.load.audio("zombieAttack","sounds/zombieAttack.wav");
    game.load.audio("zombieDamage","sounds/zombieDamage.wav");
    game.load.audio("alarm","sounds/alarm.wav");
    game.load.audio("zombie-gameplay","sounds/zombie-gameplay.wav")
}

function initialiseGame () {
    switch(difficulty) {
        case 0:
            totalAmmu = 30;
            actuallyAmmu = 10;
            totalCapacityAmmu = 10;
            break;
        case 1:
            totalAmmu = 20;
            actuallyAmmu = 8;
            totalCapacityAmmu = 8;
            break;
        case 2:
            totalAmmu = 16;
            actuallyAmmu = 6;
            totalCapacityAmmu = 6;
            break;
        default:
            break;
    }
    ingameMusic = game.add.audio("zombie-gameplay");
    ingameMusic.loop = true;
    ingameMusic.play();

    activeSpriteGem = false;
    lost = false;
    zone = 1;
    checkButtonShop = true;
    checkButtonUnlockZone = true;
    money = true;
    justReloadWeapon = false;

    gamePaused = false;
    pause = false;
    remainingTime = 10.0;

    totalMoney = 0;
    totalGems = 0;
    totalGameMoney = 0;
    level_capacity = 0;

    setUp_JSON();
    createPNGs();
    spawnGems();
    spawnPowerHealth();
    spawnPowerAttack();
    setupHUD();
    setupInput();
    setGamePaused();
    configurationEnemy();
    createPlayerHealthBar();
    panelShopManager();
    panelUnlockNewArea();

}

function gameUpdate () {
    if(!gamePaused) {
        reloadingWeapon();
        collisionBulletEnemy();
        collisionEnemyCharacter();
        moveAndRotate();
        managerShopUnlockNewZone();
    }
    else {
        character.body.velocity.x = 0;
        character.body.velocity.y = 0;
        character.animations.stop();

        zombiesGroup.forEachAlive(function(enemy){
            enemy.animations.stop();
        });

        if (zombies2SetUpCalled) {
            zombies2Group.forEachAlive(function(enemy){
                enemy.animations.stop();
            });
        }

        if (zombies3SetUpCalled) {
            zombies3Group.forEachAlive(function(enemy){
                enemy.animations.stop();
            });
        }
    }

    //game.debug.body(fence2Right);
    //game.debug.body(character);
    
    collisionMap();
    gamePausedForReloadWeapon();
    shopManager();
    gamePausedManager();
    collisionMoneyCharacter();
    collisionCharacterGem();
    collisionCharacterHealhtPU();
    collisionCharacterAttackPU();

    // SAFE AREA
    if (character.y < setUpMap.game.safe_area.y) {
        inSafeArea = false;
        countdown = false;
        text_inSafeArea.visible = false;
        text_secondsInSafeArea.visible = false;
    }
    else {
        inSafeArea = true;
        tenSecondsInSafeArea();
        text_inSafeArea.visible = true;
        text_secondsInSafeArea.visible = true;
    }

    if (!game.physics.arcade.overlap(character, zone_reloadAmmu)) text_cantReload.visible = false;

    // END GAME FOR LIVE
    if(levelConfig.character.totalHealth <= 0){
        lost = true;
        game.state.start("inEndScreen");
        ingameMusic.stop();
    }

}

function setUp_JSON () {
    setUpMap = JSON.parse(game.cache.getText("setUpMap"));

    let array_JSON = [JSON.parse(game.cache.getText("easy_JSON")), 
                        JSON.parse(game.cache.getText("medium_JSON")), 
                        JSON.parse(game.cache.getText("hard_JSON"))];
    levelConfig = array_JSON[difficulty];
}

function setupInput () {
    cursors = game.input.keyboard.createCursorKeys();
    game.input.onDown.add(shootCharacter, this); 
    game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(calculateBullets, this)
    game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(showGamePaused, this)
}

function createPNGs () {
    // Mapa
    background = game.add.image(setUpMap.world.background.level_1.x, setUpMap.world.background.level_1.y, "background");
    background.anchor.setTo(0.5, 0.5);

    background_2 = game.add.image(setUpMap.world.background.level_2.x, setUpMap.world.background.level_2.y, "background_2");
    background_2.anchor.setTo(0.5, 0.5);

    background_3 = game.add.image(setUpMap.world.background.level_3.x, setUpMap.world.background.level_3.y, "background_3");
    background_3.anchor.setTo(0.5, 0.5);

    // SafeArea
    safe_area = game.add.image(setUpMap.world.safe_area.x, setUpMap.world.safe_area.y, "safeArea");
    safe_area.anchor.setTo(0.5, 0.5);

    zone_buyAmmu = game.add.sprite(setUpMap.world.buy_ammu.x, setUpMap.world.buy_ammu.y, "zone_buyAmmu");
    zone_buyAmmu.anchor.setTo(0.5, 0.5);
    zone_buyAmmu.scale.setTo(1);
    game.physics.enable(zone_buyAmmu, Phaser.Physics.ARCADE);
    zone_buyAmmu.body.immovable = true;
    zone_buyAmmu.body.setSize(100, 30, 130, 100);
    
    zone_reloadAmmu = game.add.sprite(setUpMap.world.reload_ammu.x, setUpMap.world.reload_ammu.y, "zone_reloadAmmu");
    zone_reloadAmmu.anchor.setTo(0.5, 0.5);
    zone_reloadAmmu.scale.setTo(1);
    game.physics.enable(zone_reloadAmmu, Phaser.Physics.ARCADE);
    zone_reloadAmmu.body.immovable = true;
    zone_reloadAmmu.body.setSize(100, 30, 80, 200);

    //Decoracion
    collisionGroup = game.add.group();
    
    decor_4_1 = game.add.sprite(setUpMap.world.decoration.decor41.x, setUpMap.world.decoration.decor41.y, "decor_4");
    decor_4_1.scale.setTo(0.7);
    game.physics.arcade.enable(decor_4_1, Phaser.Physics.ARCADE);
    decor_4_1.body.immovable = true;
    collisionGroup.add(decor_4_1);

    decor_4_2 = game.add.sprite(setUpMap.world.decoration.decor42.x, setUpMap.world.decoration.decor42.y, "decor_4");
    decor_4_2.scale.setTo(0.7);
    game.physics.arcade.enable(decor_4_2, Phaser.Physics.ARCADE);
    decor_4_2.body.immovable = true;
    collisionGroup.add(decor_4_2);

    decor_5_1 = game.add.sprite(setUpMap.world.decoration.decor51.x, setUpMap.world.decoration.decor51.y, "decor_5");
    decor_5_1.scale.setTo(0.7);
    game.physics.arcade.enable(decor_5_1, Phaser.Physics.ARCADE);
    decor_5_1.body.immovable = true;
    collisionGroup.add(decor_5_1);

    decor_5_2 = game.add.sprite(setUpMap.world.decoration.decor52.x, setUpMap.world.decoration.decor52.y, "decor_5");
    decor_5_2.scale.setTo(0.7);
    game.physics.arcade.enable(decor_5_2, Phaser.Physics.ARCADE);
    decor_5_2.body.immovable = true;
    collisionGroup.add(decor_5_2);

    decor_6 = game.add.sprite(setUpMap.world.decoration.decor6.x, setUpMap.world.decoration.decor6.y, "decor_6");
    decor_6.scale.setTo(1);
    game.physics.arcade.enable(decor_6, Phaser.Physics.ARCADE);
    decor_6.body.immovable = true;
    collisionGroup.add(decor_6);

    decor_7 = game.add.sprite(setUpMap.world.decoration.decor7.x, setUpMap.world.decoration.decor7.y, "decor_7");
    decor_7.scale.setTo(0.5);
    game.physics.arcade.enable(decor_7, Phaser.Physics.ARCADE);
    decor_7.body.immovable = true;
    collisionGroup.add(decor_7);

    greenery_1 = game.add.sprite(setUpMap.world.decoration.greenery1.x, setUpMap.world.decoration.greenery1.y, "greenery_3");
    greenery_1.scale.setTo(1);
    game.physics.arcade.enable(greenery_1, Phaser.Physics.ARCADE);
    greenery_1.body.immovable = true;
    collisionGroup.add(greenery_1);

    greenery_6 = game.add.sprite(setUpMap.world.decoration.greenery6.x, setUpMap.world.decoration.greenery6.y, "greenery_6");
    greenery_6.scale.setTo(1);
    game.physics.arcade.enable(greenery_6, Phaser.Physics.ARCADE);
    greenery_6.body.immovable = true;
    collisionGroup.add(greenery_6);

    stone = game.add.sprite(setUpMap.world.decoration.stone.x, setUpMap.world.decoration.stone.y, "stone");
    stone.scale.setTo(1);
    game.physics.arcade.enable(stone, Phaser.Physics.ARCADE);
    stone.body.immovable = true;
    collisionGroup.add(stone);

    // Barreras
    fence1Left = game.add.sprite(setUpMap.world.fences.left1.x, setUpMap.world.fences.left1.y, "fence1");
    fence1Left.scale.setTo(1);
    fence1Left.alpha= 0;
    game.physics.arcade.enable(fence1Left, Phaser.Physics.ARCADE);
    fence1Left.body.immovable = true;
    collisionGroup.add(fence1Left);

    fence2Left = game.add.sprite(setUpMap.world.fences.left2.x, setUpMap.world.fences.left2.y, "fence2");
    fence2Left.scale.setTo(1);
    fence2Left.alpha = 0;
    game.physics.arcade.enable(fence2Left, Phaser.Physics.ARCADE);
    fence2Left.body.immovable = true;
    collisionGroup.add(fence2Left);

    fence1Right = game.add.sprite(setUpMap.world.fences.right1.x, setUpMap.world.fences.right1.y, "fence1");
    fence1Right.scale.setTo(1);
    fence1Right.alpha = 0;
    game.physics.arcade.enable(fence1Right, Phaser.Physics.ARCADE);
    fence1Right.body.immovable = true;
    collisionGroup.add(fence1Right);

    fence2Right = game.add.sprite(setUpMap.world.fences.right2.x, setUpMap.world.fences.right2.y, "fence2");
    fence2Right.scale.setTo(1);
    fence2Right.alpha = 0;
    game.physics.arcade.enable(fence2Right, Phaser.Physics.ARCADE);
    fence2Right.body.immovable = true;
    collisionGroup.add(fence2Right);

    barrier_1_nextlvl = game.add.sprite(setUpMap.world.unlock_zone_1.barrier.x, setUpMap.world.unlock_zone_1.barrier.y + 20, "barrier_1_NextLevel")
    barrier_1_nextlvl.anchor.setTo(0.5);
    game.physics.arcade.enable(barrier_1_nextlvl, Phaser.Physics.ARCADE);
    barrier_1_nextlvl.body.immovable = true;
    barrier_1_nextlvl.body.setSize(2048, 20, 0, 50);
    barrier_1_nextlvl.alpha = 0;

    barrier_1_nextlvl_collide = game.add.sprite(setUpMap.world.unlock_zone_1.barrier.x, setUpMap.world.unlock_zone_1.barrier.y - 10, "barrier_1_NextLevel_collide")
    barrier_1_nextlvl_collide.anchor.setTo(0.5);
    game.physics.arcade.enable(barrier_1_nextlvl_collide, Phaser.Physics.ARCADE);
    barrier_1_nextlvl_collide.body.immovable = true;
    barrier_1_nextlvl_collide.body.setSize(2048, 20, 0, 30);
    collisionGroup.add(barrier_1_nextlvl_collide);

    unlockZone_1 = game.add.sprite(setUpMap.world.unlock_zone_1.pleasure.x , setUpMap.world.unlock_zone_1.pleasure.y,"unlockZone");
    unlockZone_1.anchor.setTo(0.5);
    game.physics.arcade.enable(unlockZone_1, Phaser.Physics.ARCADE);
    unlockZone_1.scale.setTo(0.2);
    unlockZone_1.body.immovable = true;
    var scaleTween = game.add.tween(unlockZone_1.scale).to({ x: 0.4, y: 0.4 }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);

    barrier_2_nextlvl = game.add.sprite(setUpMap.world.unlock_zone_2.barrier.x, setUpMap.world.unlock_zone_2.barrier.y + 20, "barrier_1_NextLevel")
    barrier_2_nextlvl.anchor.setTo(0.5);
    game.physics.arcade.enable(barrier_2_nextlvl, Phaser.Physics.ARCADE);
    barrier_2_nextlvl.body.immovable = true;
    barrier_2_nextlvl.body.setSize(2048, 20, 0, 50);
    barrier_2_nextlvl.alpha = 0;

    barrier_2_nextlvl_collide = game.add.sprite(setUpMap.world.unlock_zone_2.barrier.x, setUpMap.world.unlock_zone_2.barrier.y - 10, "barrier_1_NextLevel_collide")
    barrier_2_nextlvl_collide.anchor.setTo(0.5);
    game.physics.arcade.enable(barrier_2_nextlvl_collide, Phaser.Physics.ARCADE);
    barrier_2_nextlvl_collide.body.immovable = true;
    barrier_2_nextlvl_collide.body.setSize(2048, 20, 0, 30);
    collisionGroup.add(barrier_2_nextlvl_collide);

    unlockZone_2 = game.add.sprite(setUpMap.world.unlock_zone_2.pleasure.x , setUpMap.world.unlock_zone_2.pleasure.y,"unlockZone");
    unlockZone_2.anchor.setTo(0.5);
    game.physics.arcade.enable(unlockZone_2, Phaser.Physics.ARCADE);
    unlockZone_2.scale.setTo(0.2);
    unlockZone_2.body.immovable = true;
    var scaleTween = game.add.tween(unlockZone_2.scale).to({ x: 0.4, y: 0.4 }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);

    winCostSprite = game.add.sprite(setUpMap.world.zone_win.pleasure.x , setUpMap.world.zone_win.pleasure.y,"unlockZone");
    winCostSprite.anchor.setTo(0.5);
    game.physics.arcade.enable(winCostSprite, Phaser.Physics.ARCADE);
    winCostSprite.scale.setTo(0.2);
    winCostSprite.body.immovable = true;
    var scaleTween = game.add.tween(winCostSprite.scale).to({ x: 0.4, y: 0.4 }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);

    // Character handgun
    character = game.add.sprite(setUpMap.world.character.x, setUpMap.world.character.y, "char_handgun");

    for (var i = 0; i < 58; i++) {
        if (i < 20) idleFramesHandgun.push(i);
        else if (i < 40) walkFramesHandgun.push(i);
        else if (i < 56) reloadFramesHandgun.push(i);
        else shootFramesHandgun.push(i);
    }

    character.animations.add('idleHandgun', idleFramesHandgun, 10, true);
    character.animations.add('walkHandgun', walkFramesHandgun, 40, true);
    character.animations.add('reloadHandgun', reloadFramesHandgun, 10, false);
    character.animations.add('shootHandgun', shootFramesHandgun, 10, false);

    // Character rifle y shotgun    
    for (var i = 0; i < 63; i++) {
        if (i < 20) idleFramesRifle.push(i);
        else if (i < 40) walkFramesRifle.push(i);
        else if (i < 60) reloadFramesRifle.push(i);
        else shootFramesRifle.push(i);
    }

    character.scale.setTo(0.5);
    character.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(character, Phaser.Physics.ARCADE);
    character.body.setSize(150, 150, 50, 50);
    character.body.collideWorldBounds = true;

    // Zombies
    for (var i = 0; i < (52); i++) {
        if (i < 17) idleFramesZombie.push(i);
        else if (i < (17*2)) walkFramesZombie.push(i);
        else if (i < (43)) runFramesZombie.push(i);
        else attackFramesZombie.push(i);
    }
    
    // Cámara
    game.camera.follow(character);
    game.world.setBounds(setUpMap.world.sizeMapBounds.level_1.upper_left_corner.x , 
                            setUpMap.world.sizeMapBounds.level_1.upper_left_corner.y, 
                            setUpMap.world.sizeMapBounds.level_1.lower_right_corner.x, 
                            setUpMap.world.sizeMapBounds.level_1.lower_right_corner.y);

    gameSettings = game.cache.getJSON('gameSettings');

    const shopText = game.add.text(zone_buyAmmu.x + 30, zone_buyAmmu.y - 70, "Press 'F' to open shop", {
        font: "28px Arial",
        backgroundColor: "#000000",
        fill: "#ffffff", 
        align: "center"
    });
    shopText.anchor.setTo(0.5);
    textTween = game.add.tween(shopText).to({ y: shopText.y + 20 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true); 

    const reloadText = game.add.text(zone_reloadAmmu.x + 10, zone_reloadAmmu.y - 60, "Press 'F' to reload", {
        font: "28px Arial",
        backgroundColor: "#000000",
        fill: "#ffffff", 
        align: "center"
    });
    reloadText.anchor.setTo(0.5);
    textTween = game.add.tween(reloadText).to({ y: reloadText.y + 20 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

    // Audios
    clickSound = game.add.audio("button");
    reloadSound = game.add.audio("reload");
    handgunSound = game.add.audio("handgun_shoot");
    rifleSound = game.add.audio("rifle_shoot");
    shotgunSound = game.add.audio("shotgun_shoot");
    errorSound = game.add.audio("error");
    explosionSound = game.add.audio("explosion");
    moneySound = game.add.audio("money");
    zombieSpawnSound = game.add.audio("zombieSpawn");
    zombieAttackSound = game.add.audio("zombieAttack");
    zombieDamageSound = game.add.audio("zombieDamage");
    alarmSound = game.add.audio("alarm");
}

// HUD

function setupHUD () {
    hudGroup = game.add.group();

    // Texto de la munición
    textTotalBullets = game.add.text(setUpMap.HUD.total_bullets.x, setUpMap.HUD.total_bullets.y, actuallyAmmu + "/" + totalAmmu, {
        fontSize: "32px",
        color: "white",
        align: "right",
        fixedWidth: 120
    });
    hudGroup.add(textTotalBullets);
    hudGroup.fixedToCamera = true;

    // Texto de recarga
    textReloading = game.add.text(setUpMap.HUD.R_to_reload.x, setUpMap.HUD.R_to_reload.y, "R to reload", {
        fontSize: "32px",
        color: "white",
        align: "left"
    });
    textReloading.anchor.setTo(0.5);
    textReloading.visible = false; 

    reloadingTextTween = game.add.tween(textReloading).to({ alpha: 0 }, 1000, "Linear", true, 0, -1); // Crear el efecto de parpadeo
    reloadingTextTween.yoyo(true); // Hace que el tween sea de ida y vuelta
    hudGroup.add(textReloading);

    text_inSafeArea = game.add.text(setUpMap.HUD.in_saferea.x, setUpMap.HUD.in_saferea.y, "You are in safe area, can't shoot", {
        fontSize: "40px",
        color: "white",
        align: "left"
    });
    text_inSafeArea.anchor.setTo(0.5);
    text_inSafeArea.visible = true; 

    safeAreaTextTween = game.add.tween(text_inSafeArea).to({ alpha: 0.5 }, 2000, "Linear", true, 0, -1); // Crear el efecto de parpadeo
    safeAreaTextTween.yoyo(true); // Hace que el tween sea de ida y vuelta
    hudGroup.add(text_inSafeArea);

    text_cantReload = game.add.text(setUpMap.HUD.cant_reload.x, setUpMap.HUD.cant_reload.y, "Can't reload. Full of ammunition.", {
        fontSize: "40px",
        color: "white",
        align: "left"
    });
    text_cantReload.anchor.setTo(0.5);
    text_cantReload.visible = false; 

    safeAreaTextTween = game.add.tween(text_cantReload).to({ alpha: 0.5 }, 2000, "Linear", true, 0, -1); // Crear el efecto de parpadeo
    safeAreaTextTween.yoyo(true); // Hace que el tween sea de ida y vuelta
    hudGroup.add(text_cantReload);

    // Barra de progreso de recarga
    progressBar = game.add.graphics();
    hudGroup.add(progressBar);

    // Texto de dinero total
    textTotalMoney = game.add.text(setUpMap.HUD.total_money.x+50, setUpMap.HUD.total_money.y, totalMoney, {
        fontSize: "32px",
        align: "right"
    })
    textTotalMoney.anchor.setTo(1, 0.5);
    hudGroup.add(textTotalMoney);

    textTotalGems = game.add.text(setUpMap.HUD.total_money.x+50, setUpMap.HUD.total_money.y+50, totalGems, {
        fontSize: "32px",
        align: "right"
    })
    textTotalGems.anchor.setTo(1, 0.5);
    hudGroup.add(textTotalGems);

    // Barra de progreso de vida
    playerHealthBar  = game.add.graphics();
    hudGroup.add(playerHealthBar );

    text_reloadWeapon = game.add.text(setUpMap.HUD.reload_weapon.x, setUpMap.HUD.reload_weapon.y,"Reload...", {
        fontSize: "60px",
        color: "white",
        align: "center"
    })
    text_reloadWeapon.anchor.setTo(0.5);
    text_reloadWeapon.visible = false;
    hudGroup.add(text_reloadWeapon);

    text_unlockNewHorizon = game.add.text(setUpMap.HUD.message.unlock_zone_1.x, setUpMap.HUD.message.unlock_zone_1.y,"Como se podrá ir a otra zona?", {
        fontSize: "40px",
        color: "white",
        align: "center"
    })
    text_unlockNewHorizon.anchor.setTo(0.5);
    text_unlockNewHorizon.visible = false;
    hudGroup.add(text_unlockNewHorizon);

    healthSprite = game.add.sprite(setUpMap.HUD.sprite.health.x, setUpMap.HUD.sprite.health.y, "healthSprite");
    healthSprite.anchor.setTo(0.5);
    healthSprite.scale.setTo(0.06);
    hudGroup.add(healthSprite);

    moneySprite = game.add.sprite(setUpMap.HUD.sprite.money.x, setUpMap.HUD.sprite.money.y, "money");
    moneySprite.anchor.setTo(0.5);
    moneySprite.scale.setTo(0.05);
    hudGroup.add(moneySprite);

    gemSprite = game.add.sprite(setUpMap.HUD.sprite.gem.x, setUpMap.HUD.sprite.gem.y, "gem");
    gemSprite.anchor.setTo(0.5);
    gemSprite.alpha = 0.8
    gemSprite.scale.setTo(0.25);
    hudGroup.add(gemSprite);

    text_secondsInSafeArea = game.add.text(setUpMap.HUD.seconds_in_saferea.x, setUpMap.HUD.seconds_in_saferea.y, "Remaining seconds in safe area: " + remainingTime.toFixed(1), {
        fontSize: "40px",
        color: "white",
        align: "left"
    });
    text_secondsInSafeArea.anchor.setTo(0.5);
    text_secondsInSafeArea.visible = true; 
    hudGroup.add(text_secondsInSafeArea);

    text_dmg = game.add.text(150, 100, "", {
        fontSize: "26px",
        color: "white",
        align: "left"
    });
    text_dmg.anchor.setTo(0.5);
    text_dmg.visible = false; 
    hudGroup.add(text_dmg);
}

function setGamePaused () {
    menuGamePaused = game.add.sprite(setUpMap.pause.background.x, setUpMap.pause.background.y, "paused");
    menuGamePaused.anchor.setTo(0.5);
    menuGamePaused.scale.setTo(0.5, 0.5);
    menuGamePaused.visible = false;
    hudGroup.add(menuGamePaused);

    continueButton = game.add.sprite(setUpMap.pause.button.continue.x, setUpMap.pause.button.continue.y, "continueButton");
    continueButton.anchor.setTo(0.5);
    continueButton.scale.setTo(0.13);
    continueButton.inputEnabled = true;
    continueButton.visible = false;
    hudGroup.add(continueButton);

    restartButton = game.add.sprite(setUpMap.pause.button.restart.x, setUpMap.pause.button.restart.y, "restartButton");
    restartButton.anchor.setTo(0.5);
    restartButton.scale.setTo(0.13);
    restartButton.inputEnabled = true;
    restartButton.visible = false;
    hudGroup.add(restartButton);

    return_to_menuButton = game.add.sprite(setUpMap.pause.button.return_to_menu.x, setUpMap.pause.button.return_to_menu.y, "return_to_menuButton");
    return_to_menuButton.anchor.setTo(0.5);
    return_to_menuButton.scale.setTo(0.13);
    return_to_menuButton.inputEnabled = true;
    return_to_menuButton.visible = false;
    hudGroup.add(return_to_menuButton);

    text_totalPoints = game.add.text(setUpMap.pause.text.totalPoints.x, setUpMap.pause.text.totalPoints.y, "Score: 0", {
        font: "bold 34px Arial",
        fill: "#632a2a", 
        align: "center"
    });
    text_totalPoints.anchor.set(0.5, 0.5);
    text_totalPoints.visible = false;
    hudGroup.add(text_totalPoints);
}

function showGamePaused () {
    if (canGamePaused) {
        clickSound.play();
        gamePaused = !gamePaused;

        if (gamePaused) {
            menuGamePaused.visible = true;
            continueButton.visible = true;
            return_to_menuButton.visible = true;
            restartButton.visible = true;
            text_totalPoints.visible = true;

            zombiesGroup.forEachAlive(function(enemy) {
                enemy.visible = false;
                enemy.healthBar.visible = false;
            });

            zombies2Group.forEachAlive(function(enemy) {
                enemy.visible = false;
                enemy.healthBar.visible = false;
            });

            zombies3Group.forEachAlive(function(enemy) {
                enemy.visible = false;
                enemy.healthBar.visible = false;
            });
            
            gemGroup.forEachAlive(function(gem) {
                gem.visible = false;
            });

            textTotalBullets.visible = false;
            textTotalMoney.visible = false;
            textTotalGems.visible = false;
            playerHealthBar.visible = false;
            progressBar.visible = false;
            healthSprite.visible = false;
            moneySprite.visible = false;
            gemSprite.visible = false;

            pause = true;
            text_secondsInSafeArea.visible = false;
        }
        else {
            menuGamePaused.visible = false;
            continueButton.visible = false;
            return_to_menuButton.visible = false;
            restartButton.visible = false;
            text_totalPoints.visible = false;

            zombiesGroup.forEachAlive(function(enemy) {
                enemy.visible = true;
                enemy.healthBar.visible = true;
            });

            zombies2Group.forEachAlive(function(enemy) {
                enemy.visible = true;
                enemy.healthBar.visible = true;
            });

            zombies3Group.forEachAlive(function(enemy) {
                enemy.visible = true;
                enemy.healthBar.visible = true;
            });

            gemGroup.forEachAlive(function(gem) {
                gem.visible = true;
            });

            textTotalBullets.visible = true;
            textTotalMoney.visible = true;
            textTotalGems.visible = true;
            playerHealthBar.visible = true;
            progressBar.visible = true;
            healthSprite.visible = true;
            moneySprite.visible = true;
            gemSprite.visible = true;
            
            pause = false;
            text_secondsInSafeArea.visible = true;
        }
    }
}

function gamePausedManager() {
    continueButton.events.onInputDown.add(() =>{
        clickSound.play();

        menuGamePaused.visible = false;
        continueButton.visible = false;
        return_to_menuButton.visible = false;
        restartButton.visible = false;
        text_totalPoints.visible = false;

        zombiesGroup.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        zombies2Group.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        zombies3Group.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        gemGroup.forEachAlive(function(gem) {
            gem.visible = true;
        });

        textTotalBullets.visible = true;
        textTotalMoney.visible = true;
        textTotalGems.visible = true;
        playerHealthBar.visible = true;
        progressBar.visible = true;
        healthSprite.visible = true;
        moneySprite.visible = true;
        gemSprite.visible = true;

        gamePaused = false;
        
        pause = false;
        text_secondsInSafeArea.visible = true;
    });

    restartButton.events.onInputDown.add(() =>{
        clickSound.play();
        ingameMusic.stop();
        gamePaused = false;
        game.state.restart();
    });

    return_to_menuButton.events.onInputDown.add(() =>{
        ingameMusic.stop();
        clickSound.play();
        game.state.start('inMenu');
    });
}

function panelShopManager () {
    shopBullets = game.add.sprite(setUpMap.shop.background.x, setUpMap.shop.background.y, "shopBullets");
    shopBullets.anchor.setTo(0.5);
    shopBullets.scale.setTo(0.5, 0.5);
    shopBullets.visible = false;
    hudGroup.add(shopBullets);

    returnButton = game.add.sprite(setUpMap.shop.button.return.x, setUpMap.shop.button.return.y, "returnButton");
    returnButton.anchor.setTo(0.5);
    returnButton.scale.setTo(0.065);
    returnButton.inputEnabled = true;
    returnButton.visible = false;
    hudGroup.add(returnButton);

    buy_shopButton = game.add.sprite(setUpMap.shop.button.buy.x, setUpMap.shop.button.buy.y, "buy_ShopButton");
    buy_shopButton.anchor.setTo(0.5);
    buy_shopButton.scale.setTo(0.6);
    buy_shopButton.inputEnabled = true;
    buy_shopButton.visible = false;
    hudGroup.add(buy_shopButton);

    confirm_shopButton = game.add.sprite(setUpMap.shop.button.confirm.x, setUpMap.shop.button.confirm.y, "confirm_ShopButton");
    confirm_shopButton.anchor.setTo(0.5);
    confirm_shopButton.scale.setTo(0.6);
    confirm_shopButton.inputEnabled = true;
    confirm_shopButton.visible = false;
    hudGroup.add(confirm_shopButton);

    cancel_shopButton = game.add.sprite(setUpMap.shop.button.cancel.x, setUpMap.shop.button.cancel.y, "cancel_ShopButton");
    cancel_shopButton.anchor.setTo(0.5);
    cancel_shopButton.scale.setTo(0.6);
    cancel_shopButton.inputEnabled = true;
    cancel_shopButton.visible = false;
    hudGroup.add(cancel_shopButton);

    text_ammuInCharger = game.add.text(setUpMap.shop.text.ammu_in_charger.x, setUpMap.shop.text.ammu_in_charger.y, " ", {
        font: "bold 34px Arial",
        fill: "#8B0000", 
        align: "center"
    });
    text_ammuInCharger.visible = false;
    hudGroup.add(text_ammuInCharger);
    
    text_ammuInChargerBuy = game.add.text(setUpMap.shop.text.ammu_in_charger_buy.x, setUpMap.shop.text.ammu_in_charger_buy.y, " ", {
        font: "bold 34px Arial",
        fill: "#8B0000", 
        align: "center"
    });
    text_ammuInChargerBuy.visible = false;
    hudGroup.add(text_ammuInChargerBuy);

    text_ammuInPocket = game.add.text(setUpMap.shop.text.ammu_in_pocket.x, setUpMap.shop.text.ammu_in_pocket.y, " ", {
        font: "bold 34px Arial",
        fill: "#8B0000", 
        align: "center"
    });
    text_ammuInPocket.visible = false;
    hudGroup.add(text_ammuInPocket);

    text_ammuInPocketBuy = game.add.text(setUpMap.shop.text.ammu_in_pocket_buy.x, setUpMap.shop.text.ammu_in_pocket_buy.y, " ", {
        font: "bold 34px Arial",
        fill: "#8B0000", 
        align: "center"
    });
    text_ammuInPocketBuy.visible = false;
    hudGroup.add(text_ammuInPocketBuy);

    text_cost = game.add.text(setUpMap.shop.text.costMoney.x, setUpMap.shop.text.costMoney.y,"", {
        font: "bold 34px Arial",
        fill: "#8B0000", 
        align: "right"
    });
    text_cost.anchor.setTo(1, 0.5);
    text_cost.visible = false;
    hudGroup.add(text_cost);

    text_costGem = game.add.text(setUpMap.shop.text.costGem.x, setUpMap.shop.text.costGem.y,"", {
        font: "bold 34px Arial",
        fill: "#8B0000", 
        align: "right"
    });
    text_costGem.anchor.setTo(1, 0.5);
    text_costGem.visible = false;
    hudGroup.add(text_costGem);

    shop_currentMoney = game.add.sprite(setUpMap.shop.panel_current_money.x, setUpMap.shop.panel_current_money.y, "currentMoney");
    shop_currentMoney.visible = false;
    shop_currentMoney.anchor.setTo(0.5);
    shop_currentMoney.scale.setTo(0.5);
    hudGroup.add(shop_currentMoney);

    text_currentMoney = game.add.text(setUpMap.shop.text.current_money.x, setUpMap.shop.text.current_money.y, totalMoney + " $", {
        font: "bold 34px Arial",
        fill: "#006400", 
        align: "center"
    });
    text_currentMoney.visible = false;
    text_currentMoney.anchor.setTo(0.5);
    hudGroup.add(text_currentMoney);
    
    moneySpriteShop = game.add.sprite(setUpMap.shop.sprites.money.x, setUpMap.shop.sprites.money.y, "money");
    moneySpriteShop.scale.setTo(0.05);
    moneySpriteShop.visible = false;
    hudGroup.add(moneySpriteShop);

    gemSpriteShop = game.add.sprite(setUpMap.shop.sprites.gems.x, setUpMap.shop.sprites.gems.y, "gem");
    gemSpriteShop.alpha = 0.8
    gemSpriteShop.scale.setTo(0.25);
    gemSpriteShop.visible = false;
    hudGroup.add(gemSpriteShop);
}

function showShop () {
    if (game.input.keyboard.isDown(Phaser.Keyboard.F)) {
        if (!gamePaused) clickSound.play();

        active = true;
        shopBullets.visible = true;
        returnButton.visible = true;
        buy_shopButton.visible = true;
        text_ammuInCharger.visible = true;
        text_ammuInChargerBuy.visible = true;
        text_ammuInPocket.visible = true;
        text_ammuInPocketBuy.visible = true;
        text_cost.visible = true;
        text_costGem.visible = true;
        text_currentMoney.visible = true;
        shop_currentMoney.visible = true;
        moneySpriteShop.visible = true;

        if(activeSpriteGem){
            gemSpriteShop.visible = true;
        }

        textTotalBullets.visible = false;
        textTotalMoney.visible = false;
        textTotalGems.visible = false;
        playerHealthBar.visible = false;
        progressBar.visible = false;
        healthSprite.visible = false;
        moneySprite.visible = false;
        gemSprite.visible = false;

        gamePaused = true;
        canGamePaused = false;
    }
}

function shopManager () {
    returnButton.events.onInputDown.add(() =>{
        clickSound.play();
        
        active = false;
        shopBullets.visible = false;
        returnButton.visible = false;
        buy_shopButton.visible = false;
        confirm_shopButton.visible = false;
        cancel_shopButton.visible = false;
        text_ammuInCharger.visible = false;
        text_ammuInChargerBuy.visible = false;
        text_ammuInPocket.visible = false;
        text_ammuInPocketBuy.visible = false;
        text_cost.visible = false;
        text_costGem.visible = false;
        text_currentMoney.visible = false;
        shop_currentMoney.visible = false;
        menuGamePaused.visible = false;
        continueButton.visible = false;
        return_to_menuButton.visible = false;
        restartButton.visible = false;
        moneySpriteShop.visible = false;
        gemSpriteShop.visible = false;

        textTotalBullets.visible = true;
        textTotalMoney.visible = true;
        textTotalGems.visible = true;
        playerHealthBar.visible = true;
        progressBar.visible = true;
        healthSprite.visible = true;
        moneySprite.visible = true;
        gemSprite.visible = true;



        gamePaused = false;
        canGamePaused = true;
        
    });

    buy_shopButton.events.onInputDown.add(() => {
        if(checkButtonShop){
            if(totalMoney < levelConfig.cost_money[level_capacity] || totalGems < levelConfig.cost_gems[level_capacity] || level_capacity == 7){
                errorSound.play();

                const shakeTween = game.add.tween(buy_shopButton);
                checkButtonShop = false;
                // Definir la duración y las propiedades del temblor
                const duration = 50; // Duración de la animación en milisegundos
                const offsetX = 5; // Cantidad de movimiento horizontal
                const offsetY = 0; // No hay movimiento vertical en este caso
    
                // Configurar el tween para el temblor de lado a lado
                shakeTween.to({ x: buy_shopButton.x + offsetX, y: buy_shopButton.y + offsetY }, duration, Phaser.Easing.Linear.None, true, 0, 5, true);
    
                shakeTween.onComplete.add(() => {
                    // Cuando el temblor haya finalizado, establecer checkButtonShop en true
                    checkButtonShop = true;
                });
    
                // Iniciar el tween
                shakeTween.start();
            }
            else{
                clickSound.play();

                confirm_shopButton.visible = true;
                cancel_shopButton.visible = true;
                buy_shopButton.visible = false;
                returnButton.visible = false;

                money = true;
            }
        }
        totalAmmu = levelConfig.total_in_pocket_ammu_buy[level_capacity];
        actuallyAmmu = levelConfig.total_in_charger_ammu_buy[level_capacity];
        totalCapacityAmmu = levelConfig.total_in_charger_ammu_buy[level_capacity];
        textTotalBullets.setText(actuallyAmmu + "/" + totalAmmu);
    });
    
    confirm_shopButton.events.onInputDown.add(() => {
        clickSound.play();

        confirm_shopButton.visible = false;
        cancel_shopButton.visible = false;
        buy_shopButton.visible = true;
        returnButton.visible = true;

        if(money == true){
            level_capacity += 1;
            totalMoney -= levelConfig.cost_money[level_capacity-1];
            totalGems -= levelConfig.cost_gems[level_capacity-1];


            money = false;
            updateCharacterSprite();

            if (textReloading.visible) textReloading.visible = false;

        }
        totalAmmu = levelConfig.total_in_pocket_ammu_buy[level_capacity];
        actuallyAmmu = levelConfig.total_in_charger_ammu_buy[level_capacity];
        totalCapacityAmmu = levelConfig.total_in_charger_ammu_buy[level_capacity];
        textTotalBullets.setText(actuallyAmmu + "/" + totalAmmu);
    });

    cancel_shopButton.events.onInputDown.add(() => {
        clickSound.play();

        confirm_shopButton.visible = false;
        cancel_shopButton.visible = false;
        buy_shopButton.visible = true;
        returnButton.visible = true;

        money = false;
    });

    text_ammuInCharger.setText(levelConfig.total_in_charger_ammu_buy[level_capacity]);
    text_ammuInChargerBuy.setText(levelConfig.total_in_charger_ammu_buy[level_capacity + 1]);
    text_ammuInPocket.setText(levelConfig.total_in_pocket_ammu_buy[level_capacity]);
    text_ammuInPocketBuy.setText(levelConfig.total_in_pocket_ammu_buy[level_capacity + 1]);
    text_cost.setText(levelConfig.cost_money[level_capacity]);
    textTotalMoney.setText(totalMoney);
    textTotalGems.setText(totalGems);
    text_currentMoney.setText(totalMoney + " $");

    if(levelConfig.cost_gems[level_capacity] != 0 && active == true){
        text_costGem.setText(levelConfig.cost_gems[level_capacity]);
        activeSpriteGem = true;
        gemSpriteShop.visible = true;
    } 
    else{
        text_costGem.setText("");
    }
    
    if(level_capacity == 7){
        text_ammuInChargerBuy.setText("MAX");
        text_ammuInPocketBuy.setText("MAX");
        text_cost.setText("MAX");
        text_cost.x = setUpMap.shop.text.costMoney.x + 40;
        text_costGem.setText("MAX");
        text_costGem.x = setUpMap.shop.text.costGem.x + 40;
        moneySpriteShop.visible = false;
        gemSpriteShop.visible = false;
    }
}

function textUnlock () {
    text_unlockNewHorizon.setText("How to go to another area?");
    text_unlockNewHorizon.visible = true;
}

function pleasureToUnlock () {
    if(zone == 3){
        text_unlockNewHorizon.setText("Press 'F' to end the game");
    }
    else{
        text_unlockNewHorizon.setText("Press 'F' to buy the new zone");
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.F)){
        if (!gamePaused) clickSound.play();

        shopNewArea.visible = true;
        text_shopNewZoneTitle.visible = true;
        button_shopNewZoneReturn.visible = true;
        button_shopNewZoneBuy.visible = true;
        text_shopNewZoneDescription.visible = true;
        text_shopNewZoneCost.visible = true;
        text_currentMoney.visible = true;
        shop_currentMoney.visible = true;
        text_shopNewZoneCostMoney.visible = true;
        text_shopNewZoneCostGem.visible = true;
        moneySpriteZone_1.visible = true;
        gemSpriteZone_1.visible = true;

        textTotalBullets.visible = false;
        textTotalMoney.visible = false;
        textTotalGems.visible = false;
        playerHealthBar.visible = false;
        text_unlockNewHorizon.visible = false;
        progressBar.visible = false;
        healthSprite.visible = false;
        moneySprite.visible = false;
        gemSprite.visible = false;

        gamePaused = true;
        canGamePaused = false;

        zombiesGroup.forEachAlive(function(enemy) {
            enemy.visible = false;
            enemy.healthBar.visible = false;
        });

        zombies2Group.forEachAlive(function(enemy) {
            enemy.visible = false;
            enemy.healthBar.visible = false;
        });

        zombies3Group.forEachAlive(function(enemy) {
            enemy.visible = false;
            enemy.healthBar.visible = false;
        });

        gemGroup.forEachAlive(function(gem) {
            gem.visible = false;
        });

        if(zone == 1){
            text_shopNewZoneCostMoney.setText(levelConfig.cost.level_1.money);
            text_shopNewZoneCostGem.setText(levelConfig.cost.level_1.gem);
        }
        if(zone == 2){
            text_shopNewZoneCostMoney.setText(levelConfig.cost.level_2.money);
            text_shopNewZoneCostGem.setText(levelConfig.cost.level_2.gem);
            moneySpriteZone_1.x = setUpMap.unlock_new_area.sprites.money.x + 10;
            gemSpriteZone_1.x = setUpMap.unlock_new_area.sprites.gem.x + 10;
        }
        if(zone == 3){
            text_shopNewZoneTitle.setText("You can end the game");
            text_shopNewZoneDescription.setText("In order to win the game you \nmust have a series of requirements \nthat I will tell you below:");
            text_shopNewZoneCostMoney.setText(levelConfig.cost.win.money);
            text_shopNewZoneCostGem.setText(levelConfig.cost.win.gem);
        }
    }

    if(gamePaused == true) text_unlockNewHorizon.visible = false;
    else text_unlockNewHorizon.visible = true;
}

function panelUnlockNewArea () {
    shopNewArea = game.add.sprite(setUpMap.unlock_new_area.background.x, setUpMap.unlock_new_area.background.y, "shopUnlockZone");
    shopNewArea.anchor.setTo(0.5);
    shopNewArea.scale.setTo(0.5);
    shopNewArea.visible = false;
    hudGroup.add(shopNewArea);

    text_shopNewZoneTitle = game.add.text(setUpMap.unlock_new_area.title.x, setUpMap.unlock_new_area.title.y, "Shop New Zone", {
        fontSize: "38px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 120
    });
    text_shopNewZoneTitle.anchor.setTo(0.5);
    text_shopNewZoneTitle.visible = false;
    hudGroup.add(text_shopNewZoneTitle);

    text_shopNewZoneDescription = game.add.text(setUpMap.unlock_new_area.description.x, setUpMap.unlock_new_area.description.y, 
                    "To unlock a new zone you must\ndeposit a certain amount of money.\nThis is the cost to move to the new zone:", {
        fontSize: "26px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 120
    });
    text_shopNewZoneDescription.anchor.setTo(0.5);
    text_shopNewZoneDescription.visible = false;
    hudGroup.add(text_shopNewZoneDescription);

    text_shopNewZoneCost = game.add.text(setUpMap.unlock_new_area.cost.x, setUpMap.unlock_new_area.cost.y, "Cost: ", {
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 120
    });
    text_shopNewZoneCost.anchor.setTo(0.5);
    text_shopNewZoneCost.visible = false;
    hudGroup.add(text_shopNewZoneCost);

    button_shopNewZoneReturn = game.add.sprite(setUpMap.unlock_new_area.button.return.x, setUpMap.unlock_new_area.button.return.y, "returnButton")
    button_shopNewZoneReturn.inputEnabled = true;
    button_shopNewZoneReturn.anchor.setTo(0.5);
    button_shopNewZoneReturn.scale.setTo(0.065);
    button_shopNewZoneReturn.visible = false;
    hudGroup.add(button_shopNewZoneReturn);

    button_shopNewZoneBuy = game.add.sprite(setUpMap.unlock_new_area.button.buy.x, setUpMap.unlock_new_area.button.buy.y, "buy_ShopButton")
    button_shopNewZoneBuy.inputEnabled = true;
    button_shopNewZoneBuy.anchor.setTo(0.5);
    button_shopNewZoneBuy.scale.setTo(0.5);
    button_shopNewZoneBuy.visible = false;
    hudGroup.add(button_shopNewZoneBuy);

    button_shopNewZoneConfirm = game.add.sprite(setUpMap.unlock_new_area.button.confirm.x, setUpMap.unlock_new_area.button.confirm.y, "confirm_ShopButton")
    button_shopNewZoneConfirm.inputEnabled = true;
    button_shopNewZoneConfirm.anchor.setTo(0.5);
    button_shopNewZoneConfirm.scale.setTo(0.5);
    button_shopNewZoneConfirm.visible = false;
    hudGroup.add(button_shopNewZoneConfirm);

    button_shopNewZoneCancel = game.add.sprite(setUpMap.unlock_new_area.button.cancel.x, setUpMap.unlock_new_area.button.cancel.y, "cancel_ShopButton")
    button_shopNewZoneCancel.inputEnabled = true;
    button_shopNewZoneCancel.anchor.setTo(0.5);
    button_shopNewZoneCancel.scale.setTo(0.5);
    button_shopNewZoneCancel.visible = false;
    hudGroup.add(button_shopNewZoneCancel);

    text_shopNewZoneCostMoney = game.add.text(setUpMap.unlock_new_area.money.x, setUpMap.unlock_new_area.money.y, "", {
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 120
    });
    text_shopNewZoneCostMoney.anchor.setTo(0.5);
    text_shopNewZoneCostMoney.visible = false;
    hudGroup.add(text_shopNewZoneCostMoney);

    text_shopNewZoneCostGem = game.add.text(setUpMap.unlock_new_area.gem.x, setUpMap.unlock_new_area.gem.y, "", {
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 120
    });
    text_shopNewZoneCostGem.anchor.setTo(0.5);
    text_shopNewZoneCostGem.visible = false;
    hudGroup.add(text_shopNewZoneCostGem);

    moneySpriteZone_1 = game.add.sprite(setUpMap.unlock_new_area.sprites.money.x, setUpMap.unlock_new_area.sprites.money.y, "money");
    moneySpriteZone_1.anchor.setTo(0.5);
    moneySpriteZone_1.scale.setTo(0.05);
    moneySpriteZone_1.visible = false;
    hudGroup.add(moneySpriteZone_1);

    gemSpriteZone_1 = game.add.sprite(setUpMap.unlock_new_area.sprites.gem.x, setUpMap.unlock_new_area.sprites.gem.y, "gem");
    gemSpriteZone_1.anchor.setTo(0.5);
    gemSpriteZone_1.alpha = 0.8
    gemSpriteZone_1.scale.setTo(0.25);
    gemSpriteZone_1.visible = false;
    hudGroup.add(gemSpriteZone_1);
}

function managerShopUnlockNewZone () {
    button_shopNewZoneReturn.events.onInputDown.add(() =>{
        clickSound.play();

        shopNewArea.visible = false;
        text_shopNewZoneTitle.visible = false;
        button_shopNewZoneReturn.visible = false;
        button_shopNewZoneBuy.visible = false;
        button_shopNewZoneConfirm.visible = false;
        button_shopNewZoneCancel.visible = false;
        text_shopNewZoneDescription.visible = false;
        text_shopNewZoneCost.visible = false;
        text_currentMoney.visible = false;
        shop_currentMoney.visible = false;
        text_shopNewZoneCostMoney.visible = false;
        text_shopNewZoneCostGem.visible = false;
        moneySpriteZone_1.visible = false;
        gemSpriteZone_1.visible = false;

        textTotalBullets.visible = true;
        textTotalMoney.visible = true;
        textTotalGems.visible = true;
        playerHealthBar.visible = true;
        progressBar.visible = true;
        healthSprite.visible = true;
        moneySprite.visible = true;
        gemSprite.visible = true;

        gamePaused = false;
        canGamePaused = true;

        zombiesGroup.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        zombies2Group.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        zombies3Group.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        gemGroup.forEachAlive(function(gem) {
            gem.visible = true;
        });
    });

    button_shopNewZoneBuy.events.onInputDown.add(() =>{
        if(zone == 1) {
            if(checkButtonUnlockZone){
                if(totalMoney < levelConfig.cost.level_1.money || 
                    totalGems < levelConfig.cost.level_1.gem){
                    errorSound.play();
    
                    const shakeTween = game.add.tween(button_shopNewZoneBuy);
                    checkButtonUnlockZone = false;
                    // Definir la duración y las propiedades del temblor
                    const duration = 50; // Duración de la animación en milisegundos
                    const offsetX = 5; // Cantidad de movimiento horizontal
                    const offsetY = 0; // No hay movimiento vertical en este caso
        
                    // Configurar el tween para el temblor de lado a lado
                    shakeTween.to({ x: button_shopNewZoneBuy.x + offsetX, y: button_shopNewZoneBuy.y + offsetY }, duration, Phaser.Easing.Linear.None, true, 0, 5, true);
        
                    shakeTween.onComplete.add(() => {
                        checkButtonUnlockZone = true;
                    });
        
                    // Iniciar el tween
                    shakeTween.start();
                }
                else{
                    clickSound.play();
    
                    button_shopNewZoneReturn.visible = false;
                    button_shopNewZoneBuy.visible = false;
                    button_shopNewZoneConfirm.visible = true;
                    button_shopNewZoneCancel.visible = true;
    
                    money = true;
                }
            }
        }
        if(zone == 2){
            if(checkButtonUnlockZone){
                if(totalMoney < levelConfig.cost.level_2.money || 
                    totalGems < levelConfig.cost.level_2.gem){
                    errorSound.play();
    
                    const shakeTween = game.add.tween(button_shopNewZoneBuy);
                    checkButtonUnlockZone = false;
                    // Definir la duración y las propiedades del temblor
                    const duration = 50; // Duración de la animación en milisegundos
                    const offsetX = 5; // Cantidad de movimiento horizontal
                    const offsetY = 0; // No hay movimiento vertical en este caso
        
                    // Configurar el tween para el temblor de lado a lado
                    shakeTween.to({ x: button_shopNewZoneBuy.x + offsetX, y: button_shopNewZoneBuy.y + offsetY }, duration, Phaser.Easing.Linear.None, true, 0, 5, true);
        
                    shakeTween.onComplete.add(() => {
                        checkButtonUnlockZone = true;
                    });
        
                    // Iniciar el tween
                    shakeTween.start();
                }
                else{
                    clickSound.play();
    
                    button_shopNewZoneReturn.visible = false;
                    button_shopNewZoneBuy.visible = false;
                    button_shopNewZoneConfirm.visible = true;
                    button_shopNewZoneCancel.visible = true;
    
                    money = true;
                }
            }
        }
        if(zone == 3){
            if(checkButtonUnlockZone){
                if(totalMoney < levelConfig.cost.win.money || 
                    totalGems < levelConfig.cost.win.gem){
                    errorSound.play();
    
                    const shakeTween = game.add.tween(button_shopNewZoneBuy);
                    checkButtonUnlockZone = false;
                    // Definir la duración y las propiedades del temblor
                    const duration = 50; // Duración de la animación en milisegundos
                    const offsetX = 5; // Cantidad de movimiento horizontal
                    const offsetY = 0; // No hay movimiento vertical en este caso
        
                    // Configurar el tween para el temblor de lado a lado
                    shakeTween.to({ x: button_shopNewZoneBuy.x + offsetX, y: button_shopNewZoneBuy.y + offsetY }, duration, Phaser.Easing.Linear.None, true, 0, 5, true);
        
                    shakeTween.onComplete.add(() => {
                        checkButtonUnlockZone = true;
                    });
        
                    // Iniciar el tween
                    shakeTween.start();
                }
                else{
                    clickSound.play();
    
                    button_shopNewZoneReturn.visible = false;
                    button_shopNewZoneBuy.visible = false;
                    button_shopNewZoneConfirm.visible = true;
                    button_shopNewZoneCancel.visible = true;
    
                    money = true;
                }
            }
        }
        
    });

    button_shopNewZoneConfirm.events.onInputDown.add(() =>{
        clickSound.play();

        shopNewArea.visible = false;
        text_shopNewZoneTitle.visible = false;
        button_shopNewZoneReturn.visible = false;
        button_shopNewZoneBuy.visible = false;
        button_shopNewZoneConfirm.visible = false;
        button_shopNewZoneCancel.visible = false;
        text_shopNewZoneDescription.visible = false;
        text_shopNewZoneCost.visible = false;
        text_currentMoney.visible = false;
        shop_currentMoney.visible = false;
        text_shopNewZoneCostMoney.visible = false;
        text_shopNewZoneCostGem.visible = false;
        moneySpriteZone_1.visible = false;
        gemSpriteZone_1.visible = false;

        if (!zombies2SetUpCalled) {
            money2Group = game.add.group();
            zombies2SetUp();
            zombies2SetUpCalled = true;
        }

        if (!zombies3SetUpCalled) {
            money3Group = game.add.group();
            zombies3SetUp();
            zombies3SetUpCalled = true;
        }

        zombiesGroup.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        zombies2Group.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        zombies3Group.forEachAlive(function(enemy) {
            enemy.visible = true;
            enemy.healthBar.visible = true;
        });

        gemGroup.forEachAlive(function(gem) {
            gem.visible = true;
        });

        textTotalBullets.visible = true;
        textTotalMoney.visible = true;
        textTotalGems.visible = true;
        playerHealthBar.visible = true;
        progressBar.visible = true;
        healthSprite.visible = true;
        moneySprite.visible = true;
        gemSprite.visible = true;

        gamePaused = false;
        canGamePaused = true;

        if(zone == 1 && money == true){
            totalMoney -= levelConfig.cost.level_1.money;;
            totalGems -= levelConfig.cost.level_1.gem;

            money = false;
            if (textReloading.visible) textReloading.visible = false;
            zone = 2;

            var tween_barrier_1_nextlvl = game.add.tween(barrier_1_nextlvl).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_barrier_1_nextlvl.onComplete.add(function() {
                barrier_1_nextlvl.destroy();
            }, this);
    
            var tween_barrier_1_nextlvl_collide = game.add.tween(barrier_1_nextlvl_collide).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_barrier_1_nextlvl_collide.onComplete.add(function() {
                barrier_1_nextlvl_collide.destroy();
            }, this);
    
            var tween_unlockZone_1 = game.add.tween(unlockZone_1).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_unlockZone_1.onComplete.add(function() {
                unlockZone_1.destroy();
            }, this);
    
            game.world.setBounds(setUpMap.world.sizeMapBounds.level_2.upper_left_corner.x , 
                setUpMap.world.sizeMapBounds.level_2.upper_left_corner.y, 
                setUpMap.world.sizeMapBounds.level_2.lower_right_corner.x, 
                setUpMap.world.sizeMapBounds.level_2.lower_right_corner.y);
        }
        if(zone == 2 && money == true){
            totalMoney -= levelConfig.cost.level_2.money;;
            totalGems -= levelConfig.cost.level_2.gem;

            money = false;
            zone = 3;
            if (textReloading.visible) textReloading.visible = false;
    
            var tween_barrier_2_nextlvl = game.add.tween(barrier_2_nextlvl).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_barrier_2_nextlvl.onComplete.add(function() {
                barrier_2_nextlvl.destroy();
            }, this);
    
            var tween_barrier_2_nextlvl_collide = game.add.tween(barrier_2_nextlvl_collide).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_barrier_2_nextlvl_collide.onComplete.add(function() {
                barrier_2_nextlvl_collide.destroy();
            }, this);
    
            var tween_unlockZone_2 = game.add.tween(unlockZone_2).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_unlockZone_2.onComplete.add(function() {
                unlockZone_2.destroy();
            }, this);
    
            game.world.setBounds(setUpMap.world.sizeMapBounds.level_3.upper_left_corner.x , 
                setUpMap.world.sizeMapBounds.level_3.upper_left_corner.y, 
                setUpMap.world.sizeMapBounds.level_3.lower_right_corner.x, 
                setUpMap.world.sizeMapBounds.level_3.lower_right_corner.y);
        }
        if(zone == 3 && money == true){
            totalMoney -= levelConfig.cost.win.money;;
            totalGems -= levelConfig.cost.win.gem;

            money = false;
            zone = 4;
            if (textReloading.visible) textReloading.visible = false;
            
            var tween_winCostSprite = game.add.tween(winCostSprite).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_winCostSprite.onComplete.add(function() {
                winCostSprite.destroy();
            }, this);
            
            game.state.start("inEndScreen");
            ingameMusic.stop();
        }
    });

    button_shopNewZoneCancel.events.onInputDown.add(() =>{
        clickSound.play();

        button_shopNewZoneReturn.visible = true;
        button_shopNewZoneBuy.visible = true;
        button_shopNewZoneConfirm.visible = false;
        button_shopNewZoneCancel.visible = false;

        var tween_unlockZone_2 = game.add.tween(unlockZone_2).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween_unlockZone_2.onComplete.add(function() {
                unlockZone_2.destroy();
            }, this);
    });
}

function tenSecondsInSafeArea() {
    if (!countdown) {
        countdown = true;
        text_secondsInSafeArea.setText("Remaining seconds in safe area: 10.0");
        remainingTime = 10.0;

        const intervalId = setInterval(() => {
            if (!inSafeArea || !countdown) {
                remainingTime = 0.0;
                clearInterval(intervalId);
                alarmSound.stop();
                countdown = false;
                return;
            }

            if (!pause) {
                remainingTime -= 0.1;
                text_secondsInSafeArea.setText("Remaining seconds in safe area: " + remainingTime.toFixed(1));

                if (remainingTime >= 3.0 && remainingTime < 3.1) { 

                    alarmSound.play();
                }

                if (remainingTime <= 0.1) {
                    clearInterval(intervalId);
                    countdown = false;
                    lost = true;
                    game.state.start("inEndScreen");
                    ingameMusic.stop();
                }
            }
        }, 100);
    }
}

// CHARACTER

function moveAndRotate () {
    // Obtener las coordenadas del mouse en relación con el mundo del juego
    const mouseX = game.input.x + game.camera.x;
    const mouseY = game.input.y + game.camera.y;

    // Calcular el ángulo entre la posición del personaje y las coordenadas del mouse
    const dx = mouseX - character.x;
    const dy = mouseY - character.y;
    const angle = game.math.angleBetween(0, 0, dx, dy);

    // Rotar el personaje hacia el ángulo calculado
    character.angle = game.math.radToDeg(angle);

    // Controla la reproducción de la animación basada en el movimiento del personaje
    const isMoving = cursors.right.isDown || cursors.left.isDown || cursors.up.isDown || cursors.down.isDown ||
                     game.input.keyboard.addKey(Phaser.Keyboard.D).isDown || game.input.keyboard.addKey(Phaser.Keyboard.A).isDown ||
                     game.input.keyboard.addKey(Phaser.Keyboard.W).isDown || game.input.keyboard.addKey(Phaser.Keyboard.S).isDown;

    if (level_capacity < change_rifle){
        if (isReloading) character.animations.play('reloadHandgun');
        else if (isShooting) character.animations.play('shootHandgun');
        else if (isMoving) character.animations.play('walkHandgun');
        else character.animations.play('idleHandgun');
    }
    else if (level_capacity < change_shotgun){
        if (isReloading) character.animations.play('reloadRifle');
        else if (isShooting) character.animations.play('shootRifle');
        else if (isMoving) character.animations.play('walkRifle');
        else character.animations.play('idleRifle');
    }
    else {
        if (isReloading) character.animations.play('reloadShotgun');
        else if (isShooting) character.animations.play('shootShotgun');
        else if (isMoving) character.animations.play('walkShotgun');
        else character.animations.play('idleShotgun');
    }
    
    // Gestión de entrada de teclado para controlar el character
    if (cursors.right.isDown || game.input.keyboard.addKey(Phaser.Keyboard.D).isDown) { 
        character.body.velocity.x = levelConfig.character.velocity;
    }
    else if (cursors.left.isDown || game.input.keyboard.addKey(Phaser.Keyboard.A).isDown) {
        character.body.velocity.x = -levelConfig.character.velocity;
    }
    else {
        character.body.velocity.x = 0;
    }
    
    if (cursors.up.isDown || game.input.keyboard.addKey(Phaser.Keyboard.W).isDown) {
        character.body.velocity.y = -levelConfig.character.velocity;
    }
    else if (cursors.down.isDown || game.input.keyboard.addKey(Phaser.Keyboard.S).isDown) {
        character.body.velocity.y = levelConfig.character.velocity;
    }
    else {
        character.body.velocity.y = 0;
    }
}

function shootCharacter () {
    if (actuallyAmmu > 0 && !gamePaused && !isReloading && !inSafeArea && canShoot){
        isShooting = true;
        canShoot = false;
        
        const angle = character.angle - 5; // Ajustar el ángulo para que sea consistente con Phaser 2.20

        if (level_capacity < change_rifle){
            game.time.events.add(Phaser.Timer.SECOND, function() {
                canShoot = true;
            }, this);

            const offsetX = Math.cos(Phaser.Math.degToRad(angle + 36)) * 50; // Convertir el ángulo a radianes
            const offsetY = Math.sin(Phaser.Math.degToRad(angle + 36)) * 50;
            const bulletX = character.x + offsetX;
            const bulletY = character.y + offsetY;

            this.bala = game.add.sprite(bulletX, bulletY, "bullet_handgun");
            game.physics.enable(this.bala, Phaser.Physics.ARCADE);
            this.bala.anchor.setTo(0.42, 1.07); // Establecer el punto de anclaje en la punta del arma
            this.bala.scale.setTo(0.025);

            character.animations.play('shootHandgun').onComplete.add(function() {
                isShooting = false;
            }, this);

            handgunSound.play();
        }
        else if (level_capacity < change_shotgun){
            game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
                canShoot = true; 
            }, this);

            const offsetX = Math.cos(Phaser.Math.degToRad(angle + 22)) * 50; // Convertir el ángulo a radianes
            const offsetY = Math.sin(Phaser.Math.degToRad(angle + 22)) * 50;
            const bulletX = character.x + offsetX;
            const bulletY = character.y + offsetY;

            this.bala = game.add.sprite(bulletX, bulletY, "bullet_rifle");
            game.physics.enable(this.bala, Phaser.Physics.ARCADE);
            this.bala.anchor.setTo(0.42, 0.9); // Establecer el punto de anclaje en la punta del arma
            this.bala.scale.setTo(0.02);

            character.animations.play('shootRifle').onComplete.add(function() {
                isShooting = false;
            }, this);

            rifleSound.play();
        }
        else {
            canShoot = true;

            const offsetX = Math.cos(Phaser.Math.degToRad(angle + 19)) * 50; // Convertir el ángulo a radianes
            const offsetY = Math.sin(Phaser.Math.degToRad(angle + 19)) * 50;
            const bulletX = character.x + offsetX;
            const bulletY = character.y + offsetY;

            this.bala = game.add.sprite(bulletX, bulletY, "bullet_shotgun");
            game.physics.enable(this.bala, Phaser.Physics.ARCADE);
            this.bala.anchor.setTo(0.42, 0.87); // Establecer el punto de anclaje en la punta del arma
            this.bala.scale.setTo(0.03);

            character.animations.play('shootShotgun').onComplete.add(function() {
                isShooting = false;
            }, this);

            shotgunSound.play();
        }

        bulletGroup.add(this.bala);

        game.physics.arcade.enable(this.bala);

        // Configurar la velocidad y dirección de la bala
        this.bala.body.velocity.x = Math.cos(Phaser.Math.degToRad(angle)) * levelConfig.bullet.velocity; // Usar la propiedad body.velocity para configurar la velocidad
        this.bala.body.velocity.y = Math.sin(Phaser.Math.degToRad(angle)) * levelConfig.bullet.velocity;
        this.bala.angle = angle + 90; // Ajustar el ángulo para que sea consistente con Phaser 2.20
        
        actuallyAmmu--;
        textTotalBullets.setText(actuallyAmmu + "/" + totalAmmu);
    }
}

function calculateBullets () {
    if (actuallyAmmu < totalCapacityAmmu && totalAmmu > 0 && !isReloading) {
        reloadSound.play();
        let subtraction = Math.min(totalCapacityAmmu - actuallyAmmu, totalAmmu);
        totalAmmu -= subtraction;
        actuallyAmmu += subtraction;
        isReloading = true;
        reloadTimer = reloadTime;
        textReloading.visible = false; 
    }
}

function reloadingWeapon () {
    if (isReloading) {
        reloadTimer -= game.time.elapsed; // Restar el tiempo transcurrido desde la última actualización

        let progress = Math.max(0, 1 - (reloadTimer / reloadTime));

        // Actualiza la longitud de la barra de progreso según el progreso
        let progressBarWidth = 100 * progress; // El ancho de la barra será de 100 píxeles, ajusta según sea necesario
        progressBar.clear();
        progressBar.beginFill(0x00FF00);
        progressBar.drawRect(630, 530, progressBarWidth, 10);
        progressBar.endFill();

        if (reloadTimer <= 0) {
            isReloading = false; // Recargar una vez que el tiempo de recarga haya terminado
            textTotalBullets.setText(actuallyAmmu + "/" + totalAmmu);
            reloadTimer = 0;
            progressBar.clear();
        }
    }
    
    if(actuallyAmmu == 0 && totalAmmu != 0) {
        textReloading.visible = true; 
    }
}

function reloadWeapon () {
    if (game.input.keyboard.isDown(Phaser.Keyboard.F) 
        && (actuallyAmmu != levelConfig.total_in_charger_ammu_buy[level_capacity] || totalAmmu != levelConfig.total_in_pocket_ammu_buy[level_capacity])){
            clickSound.play();  
            justReloadWeapon = true;
    }
    
    if (actuallyAmmu == levelConfig.total_in_charger_ammu_buy[level_capacity] && totalAmmu == levelConfig.total_in_pocket_ammu_buy[level_capacity])
        text_cantReload.visible = true;
    else text_cantReload.visible = false;
}

function gamePausedForReloadWeapon () {
    if (justReloadWeapon == true) {
        let counter = 0;
        justReloadWeapon = false;

        // Función que devuelve una promesa que se resuelve después de 1 segundo
        function waitOneSecond() {
            return new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Función para actualizar el contador y realizar acciones cuando llegue a 10
        async function reload() {
            if (level_capacity < change_rifle) character.animations.play('idleHandgun');
            else if (level_capacity < change_shotgun) character.animations.play('idleRifle');
            else character.animations.play('idleShotgun');

            while (counter < 3) { // Esperar 1 segundo
                counter++;
                text_reloadWeapon.visible = true;
                text_reloadWeapon.setText("Reloading: " + counter);
                
                
                gamePaused = true;
                canGamePaused = false;
                await waitOneSecond();
            }
            text_reloadWeapon.visible = false;
            totalAmmu = levelConfig.total_in_pocket_ammu_buy[level_capacity];
            actuallyAmmu = levelConfig.total_in_charger_ammu_buy[level_capacity];
            totalCapacityAmmu = levelConfig.total_in_charger_ammu_buy[level_capacity];
            textTotalBullets.setText(actuallyAmmu + "/" + totalAmmu);
            gamePaused = false;
            canGamePaused = true;
        }

        reload();
    }
}

function createPlayerHealthBar () {
    playerHealthBar.beginFill(0x00ff00); // Color verde para la parte de la barra que representa la salud restante
    playerHealthBar.drawRect(60, 40, 200, 20); // Dibuja la parte verde de la barra de vida
    playerHealthBar.endFill();
}

function updatePlayerHealthBar () {
    const playerHealthRatio = Math.max(levelConfig.character.totalHealth , 0) / levelConfig.character.totalHealthMAX; // Calcula la relación de salud actual del personaje

    // Limpia la barra de vida anterior y dibuja la nueva barra de vida
    playerHealthBar.clear();
    playerHealthBar.beginFill(0xff0000); // Color rojo para la parte de la barra que representa la salud perdida
    playerHealthBar.drawRect(60, 40, 200, 20); // Dibuja la barra de vida en la posición deseada
    playerHealthBar.endFill();

    // Dibuja la parte de la barra de vida que representa la salud restante
    playerHealthBar.beginFill(0x00ff00); // Color verde para la parte de la barra que representa la salud restante
    playerHealthBar.drawRect(60, 40, 200 * playerHealthRatio, 20); // Dibuja la parte verde de la barra de vida
    playerHealthBar.endFill();
}

function updateCharacterSprite () {
    if (level_capacity < change_rifle){
        character.loadTexture('char_handgun', 0);
    }
    else if (level_capacity < change_shotgun){
        character.loadTexture('char_rifle', 0);
    }
    else {
        character.loadTexture('char_shotgun', 0);
    }

    if (level_capacity == change_rifle){
        character.animations.add('idleRifle', idleFramesRifle, 10, true);
        character.animations.add('walkRifle', walkFramesRifle, 40, true);
        character.animations.add('reloadRifle', reloadFramesRifle, 9, false);
        character.animations.add('shootRifle', shootFramesRifle, 10, false);

        character.scale.setTo(0.6);
        character.anchor.setTo(0.6, 0.6);
    }
    else if (level_capacity == change_shotgun){
        character.animations.add('idleShotgun', idleFramesRifle, 10, true);
        character.animations.add('walkShotgun', walkFramesRifle, 40, true);
        character.animations.add('reloadShotgun', reloadFramesRifle, 9, false);
        character.animations.add('shootShotgun', shootFramesRifle, 10, false);
    }
}

// ENEMY

function configurationEnemy () {
    zombies3Group = game.add.group();
    zombies2Group = game.add.group();
    zombiesGroup = game.add.group();
    bulletGroup = game.add.group();
    money1Group = game.add.group();
    gemGroup = game.add.group();
    healhtPUGroup = game.add.group();
    attackPUGroup = game.add.group();
    
    zombiesSetUp();
}

function zombiesSetUp () {
    const addZombie = () => {
        if(!gamePaused){
            good = false;
            randomX = game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
            randomY = game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
            while (!good) {
                if (randomX < 250 && randomX > -150 && randomY < 250 && randomY > -150 ||
                    randomX < -180 && randomX > -330 && randomY < 1000 && randomY > 770 ||
                    randomX < 1180 && randomX > 1030 && randomY < -330 && randomY > -480) {
                        randomX = game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                        randomY = game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
                }
                else good = true;
            }

            zombieSpawnSound.play();

            const enemy = game.add.sprite(randomX, randomY, "zombie1");
            game.physics.arcade.enable(enemy);
    
            enemy.animations.add('idleZombie1', idleFramesZombie, 10, true);
            enemy.animations.add('walkZombie1', walkFramesZombie, 10, true);
            enemy.animations.add('runZombie1', runFramesZombie, 15, true);
            enemy.animations.add('attackZombie1', attackFramesZombie, 10, true);
            enemy.animations.play('idleZombie1');
    
            enemy.scale.setTo(0.5);
            enemy.anchor.setTo(0.5, 0.5);
            enemy.alpha = 0;
            enemy.body.setSize(245, 245, 14, 10);

            zombiesGroup.add(enemy);

            enemy.health = levelConfig.enemy.totalHealth;
            createHealthBar(enemy);

            game.add.tween(enemy).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
            game.time.events.loop(TIMER_RHYTHM, moveToEnemy, this);
        }        
    };

    const createHealthBar = (enemy) => {
        // Crear la barra de vida
        enemy.healthBar = game.add.graphics(enemy.x, enemy.y - 20);
    
        // Dibujar la barra de vida verde
        enemy.healthBar.beginFill(0x2ecc71); // Verde
        enemy.healthBar.drawRect(0, 0, levelConfig.enemy.totalHealth, 10); // Tamaño inicial de la barra de vida
        enemy.healthBar.endFill();
        enemy.healthBar.alpha = 0;
    
        // Agregar la barra de salud al juego y al enemigo
        game.world.add(enemy.healthBar);
        
        game.add.tween(enemy.healthBar).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
    };

    const enemySpawnInterval = game.rnd.between(setUpMap.game.enemy.level_1.spawn_ms.lower, setUpMap.game.enemy.level_1.spawn_ms.upper);
    game.time.events.loop(enemySpawnInterval, addZombie, this);
}

function zombies2SetUp () {
    const addZombie2 = () => {
        if(!gamePaused){
            good2 = false;
            randomX2 = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_2.lower_right_corner.x);
            randomY2 = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_2.lower_right_corner.y);
            while (!good2) {
                if (randomX2 < 600 && randomX2 > 420 && randomY2 < -1510 && randomY2 > -1630 ||
                    randomX2 < 1150 && randomX2 > 970 && randomY2 < -1190 && randomY2 > -1330) {
                        randomX2 = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_2.lower_right_corner.x);
                        randomY2 = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_2.lower_right_corner.y);
                }
                else good2 = true;
            }

            zombieSpawnSound.play();

            const enemy = game.add.sprite(randomX2, randomY2, "zombie2");
            game.physics.arcade.enable(enemy);
    
            enemy.animations.add('idleZombie2', idleFramesZombie, 10, true);
            enemy.animations.add('walkZombie2', walkFramesZombie, 10, true);
            enemy.animations.add('runZombie2', runFramesZombie, 15, true);
            enemy.animations.add('attackZombie2', attackFramesZombie, 10, true);
            enemy.animations.play('idleZombie2');
    
            enemy.scale.setTo(0.65);
            enemy.anchor.setTo(0.5, 0.5);
            enemy.alpha = 0;
            enemy.body.setSize(245, 245, 20, 18);

            zombies2Group.add(enemy);
    
            enemy.health = levelConfig.enemy.totalHealth;
            createHealthBarNextLevel(enemy);
            
            game.add.tween(enemy).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
            game.time.events.loop(TIMER_RHYTHM, moveToEnemy, this);
        }        
    };

    const createHealthBarNextLevel = (enemy) => {
        // Crear la barra de vida
        enemy.healthBar = game.add.graphics(enemy.x, enemy.y - 100);
    
        // Dibujar la barra de vida verde
        enemy.healthBar.beginFill(0x2ecc71); // Verde
        enemy.healthBar.drawRect(0, 20, levelConfig.enemy2.totalHealth, 10); // Tamaño inicial de la barra de vida
        enemy.healthBar.endFill();
        enemy.healthBar.alpha = 0;
    
        // Agregar la barra de salud al juego y al enemigo
        game.world.add(enemy.healthBar);
        
        game.add.tween(enemy.healthBar).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
    };

    const enemySpawnInterval = game.rnd.between(setUpMap.game.enemy.level_2.spawn_ms.lower, setUpMap.game.enemy.level_2.spawn_ms.upper);
    game.time.events.loop(enemySpawnInterval, addZombie2, this);
}

function zombies3SetUp () {
    const addZombie3 = () => {
        if(!gamePaused){
            randomX3 = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_3.lower_right_corner.x);
            randomY3 = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_3.lower_right_corner.y);
            
            zombieSpawnSound.play();

            const enemy = game.add.sprite(randomX3, randomY3, "zombie3");
            game.physics.arcade.enable(enemy);
    
            enemy.animations.add('idleZombie3', idleFramesZombie, 10, true);
            enemy.animations.add('walkZombie3', walkFramesZombie, 10, true);
            enemy.animations.add('runZombie3', runFramesZombie, 15, true);
            enemy.animations.add('attackZombie3', attackFramesZombie, 10, true);
            enemy.animations.play('idleZombie3');
    
            enemy.scale.setTo(0.8);
            enemy.anchor.setTo(0.5, 0.5);
            enemy.alpha = 0;
            enemy.body.setSize(245, 245, 24, 22);

            zombies3Group.add(enemy);
    
            enemy.health = levelConfig.enemy.totalHealth;
            createHealthBarNextLevel(enemy);
            
            game.add.tween(enemy).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
            game.time.events.loop(TIMER_RHYTHM, moveToEnemy, this);
        }        
    };

    const createHealthBarNextLevel = (enemy) => {
        // Crear la barra de vida
        enemy.healthBar = game.add.graphics(enemy.x, enemy.y - 100);
    
        // Dibujar la barra de vida verde
        enemy.healthBar.beginFill(0x2ecc71); // Verde
        enemy.healthBar.drawRect(0, 40, levelConfig.enemy2.totalHealth, 10); // Tamaño inicial de la barra de vida
        enemy.healthBar.endFill();
        enemy.healthBar.alpha = 0;
    
        // Agregar la barra de salud al juego y al enemigo
        game.world.add(enemy.healthBar);
        
        game.add.tween(enemy.healthBar).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
    };

    const enemySpawnInterval = game.rnd.between(setUpMap.game.enemy.level_3.spawn_ms.lower, setUpMap.game.enemy.level_3.spawn_ms.upper);
    game.time.events.loop(enemySpawnInterval, addZombie3, this);
}

function moveToEnemy () {
    zombiesGroup.forEachAlive(function(enemy) {
        enemy.healthBar.x = enemy.x - 50;
        enemy.healthBar.y = enemy.y + 50;
        const distanceToPlayer = game.physics.arcade.distanceBetween(character, enemy);

        if (distanceToPlayer <= levelConfig.enemy.stop_to_player || gamePaused) {
            enemy.body.velocity.setTo(0, 0); 
            enemy.animations.play('attackZombie1'); 

            soundZombieAttack();
        } 
        else {
            if (distanceToPlayer < levelConfig.character.radius_detected) {
                enemy.animations.play('runZombie1'); 

                let angle = Phaser.Math.angleBetween(enemy.x, enemy.y, character.x, character.y);
                angle = Phaser.Math.radToDeg(angle);
                enemy.body.moveTo(5000, levelConfig.character.radius_detected, angle);
                enemy.angle = angle;
    
                if (character.y < setUpMap.game.safe_area.y) {
                    enemy.body.moveTo(5000, levelConfig.character.radius_detected, angle);
                    enemy.body.velocity.x *= 2;
                    enemy.body.velocity.y *= 2;
                } 
                else {
                    if (!enemy.changedDirection) {
                        enemy.body.velocity.x *= -1;
                        enemy.body.velocity.y *= -1;
                        enemy.angle += 180;
                    }
                }
            } 
            else {
                if (Math.random() > 0.2) {
                    const randomNum = game.rnd.between(1, levelConfig.enemy.probability);
                    if (randomNum == 1) {
                        enemy.animations.play('walkZombie1');

                        let randomX, randomY;
                        if (zombies3SetUpCalled) {
                            randomX = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                            randomY = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
                        }
                        else if (zombies2SetUpCalled) {
                            randomX = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                            randomY = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
                        } 
                        else {
                            randomX = game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                            randomY = game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
                        }

                        let angle = Phaser.Math.angleBetween(enemy.x, enemy.y, randomX, randomY);
                        angle = Phaser.Math.radToDeg(angle);

                        enemy.body.moveTo(10000, 500, angle);
                        enemy.angle = angle;
                    }
                } 
                else {
                    enemy.animations.play('idleZombie1');
                }
            }
        }
    });

    zombies2Group.forEachAlive(function(enemy) {
        enemy.healthBar.x = enemy.x - 50;
        enemy.healthBar.y = enemy.y + 50;
        const distanceToPlayer = game.physics.arcade.distanceBetween(character, enemy);

        if (distanceToPlayer <= levelConfig.enemy.stop_to_player || gamePaused) {
            enemy.body.velocity.setTo(0, 0);
            enemy.animations.play('attackZombie2');

            soundZombieAttack();
        } 
        else {
            isZombieAttacking = false;

            if (distanceToPlayer < levelConfig.character.radius_detected) {
                enemy.animations.play('runZombie2'); 

                let angle = Phaser.Math.angleBetween(enemy.x, enemy.y, character.x, character.y);
                angle = Phaser.Math.radToDeg(angle);
                enemy.body.moveTo(5000, levelConfig.character.radius_detected, angle);
                enemy.angle = angle;

                if (character.y < setUpMap.game.safe_area.y) {
                    enemy.body.moveTo(5000, levelConfig.character.radius_detected, angle);
                    enemy.body.velocity.x *= 2;
                    enemy.body.velocity.y *= 2;
                } 
                else {
                    if (!enemy.changedDirection) {
                        enemy.body.velocity.x *= -1;
                        enemy.body.velocity.y *= -1;
                        enemy.angle += 180;
                    }
                }
            } 
            else {
                if (Math.random() > 0.2) {
                    const randomNum = game.rnd.between(1, levelConfig.enemy2.probability);
                    if (randomNum == 1) {
                        enemy.animations.play('walkZombie2'); 

                        let randomX, randomY;
                        if (zombies3SetUpCalled) {
                            randomX = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                            randomY = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
                        }
                        else {
                            randomX = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                            randomY = game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);
                        }
                        let angle = Phaser.Math.angleBetween(enemy.x, enemy.y, randomX, randomY);
                        angle = Phaser.Math.radToDeg(angle);

                        enemy.body.moveTo(10000, 500, angle);
                        enemy.angle = angle;
                    }
                } 
                else {
                    enemy.animations.play('idleZombie2'); 
                }
            }
        }
    });

    zombies3Group.forEachAlive(function(enemy) {
        enemy.healthBar.x = enemy.x - 50;
        enemy.healthBar.y = enemy.y + 50;
        const distanceToPlayer = game.physics.arcade.distanceBetween(character, enemy);

        if (distanceToPlayer <= levelConfig.enemy.stop_to_player || gamePaused) {
            enemy.body.velocity.setTo(0, 0);
            enemy.animations.play('attackZombie3');

            soundZombieAttack();
        } 
        else {
            isZombieAttacking = false;

            if (distanceToPlayer < levelConfig.character.radius_detected) {
                enemy.animations.play('runZombie3'); 

                let angle = Phaser.Math.angleBetween(enemy.x, enemy.y, character.x, character.y);
                angle = Phaser.Math.radToDeg(angle);
                enemy.body.moveTo(5000, levelConfig.character.radius_detected, angle);
                enemy.angle = angle;

                if (character.y < setUpMap.game.safe_area.y) {
                    enemy.body.moveTo(5000, levelConfig.character.radius_detected, angle);
                    enemy.body.velocity.x *= 2;
                    enemy.body.velocity.y *= 2;
                } 
                else {
                    if (!enemy.changedDirection) {
                        enemy.body.velocity.x *= -1;
                        enemy.body.velocity.y *= -1;
                        enemy.angle += 180;
                    }
                }
            } 
            else {
                if (Math.random() > 0.2) {
                    const randomNum = game.rnd.between(1, levelConfig.enemy3.probability);
                    if (randomNum == 1) {
                        enemy.animations.play('walkZombie3'); 

                        let randomX, randomY;
                        randomX = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x);
                        randomY = game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y);

                        let angle = Phaser.Math.angleBetween(enemy.x, enemy.y, randomX, randomY);
                        angle = Phaser.Math.radToDeg(angle);

                        enemy.body.moveTo(10000, 500, angle);
                        enemy.angle = angle;
                    }
                } 
                else {
                    enemy.animations.play('idleZombie3'); 
                }
            }
        }
    });
}

function soundZombieAttack () {
    if (!isZombieAttackSoundPlaying && !gamePaused) {
        isZombieAttackSoundPlaying = true;
        zombieAttackSound.play();
        
        game.time.events.add(Phaser.Timer.SECOND, function() {
            isZombieAttackSoundPlaying = false; 
        }, this);
    }
}

// COLLISIONS

function collisionBulletEnemy () {
    bulletGroup.forEachAlive(function(bullet) {
        zombiesGroup.forEachAlive(function(enemy) {
            const distance = game.physics.arcade.distanceBetween(bullet, enemy);
            
            if (distance < setUpMap.game.bullet.collision_detected) {
                handleCollision(bullet, enemy, 1);
            }
        });

        zombies2Group.forEachAlive(function(enemy) {
            const distance = game.physics.arcade.distanceBetween(bullet, enemy);
            
            if (distance < setUpMap.game.bullet.collision_detected) {
                handleCollision(bullet, enemy, 2);
            }
        });

        zombies3Group.forEachAlive(function(enemy) {
            const distance = game.physics.arcade.distanceBetween(bullet, enemy);
            
            if (distance < setUpMap.game.bullet.collision_detected) {
                handleCollision(bullet, enemy, 3);
            }
        });
    });
}

function handleCollision (bullet, enemy, tipe) {
    zombieDamageSound.play();

    // Reducir la vida del enemigo
    if (tipe == 1) enemy.health -= levelConfig.bullet.damage1;
    else if (tipe == 2) enemy.health -= levelConfig.bullet.damage2;
    else enemy.health -= levelConfig.bullet.damage3;
    
    // Actualizar la barra de vida del enemigo
    const newWidth = (enemy.health / levelConfig.enemy.totalHealth) * 100;
    enemy.healthBar.clear();

    enemy.healthBar.beginFill(0xff0000); // Rojo
    enemy.healthBar.drawRect(0, 0, 100, 10); // Tamaño del fondo de la barra de vida
    enemy.healthBar.endFill();

    enemy.healthBar.beginFill(0x2ecc71); // Color verde
    enemy.healthBar.drawRect(0, 0, newWidth, 10);
    enemy.healthBar.endFill();
    
    // Verificar si la vida del enemigo llega a 0 y eliminarlo si es así
    if (enemy.health <= 0) {
        enemy.healthBar.destroy();
        enemy.destroy();

        explosionSound.play();

        explosion = game.add.sprite(enemy.x - 75, enemy.y - 70, "explosion");
        explosion.scale.setTo(2.5);
        explosion.animations.add('explosion', null, 16, false);
        explosion.animations.play('explosion');
        explosion.animations.currentAnim.onComplete.add(() => {
            explosion.destroy();
        }, this);

        spawnMoney(enemy, tipe);
    }
    
    // Destruir la bala después de impactar
    bullet.destroy();
}

function collisionEnemyCharacter () {
    let enemiesInRangeCollision = [];

    zombiesGroup.forEachAlive(function(enemy) {
        const distance = game.physics.arcade.distanceBetween(enemy, character);
        
        if (distance < levelConfig.enemy.do_damage) {
            enemiesInRangeCollision.push(enemy);
        } 
    });

    zombies2Group.forEachAlive(function(enemy) {
        const distance = game.physics.arcade.distanceBetween(enemy, character);
        
        if (distance < levelConfig.enemy.do_damage) {
            enemiesInRangeCollision.push(enemy);
        }
    });

    zombies3Group.forEachAlive(function(enemy) {
        const distance = game.physics.arcade.distanceBetween(enemy, character);
        
        if (distance < levelConfig.enemy.do_damage) {
            enemiesInRangeCollision.push(enemy);
        }
    });

    enemiesInRangeCollision.forEach(function(enemy) {
        if (!collisionTimer || collisionTimer < game.time.now) {
            levelConfig.character.totalHealth -= 2 * enemiesInRangeCollision.length;
            updatePlayerHealthBar();
            collisionTimer = game.time.now + 1000;
        }
    });
}

function collisionMap () {
    game.physics.arcade.overlap(character, zone_buyAmmu, showShop, null, this);
    game.physics.arcade.overlap(character, zone_reloadAmmu, reloadWeapon, null, this);

    // Zone 2
    if(zone == 1){
        if(game.physics.arcade.overlap(character, barrier_1_nextlvl, textUnlock, null, this) == true ||
        game.physics.arcade.overlap(character, unlockZone_1, pleasureToUnlock, null, this) == true){
            if(game.physics.arcade.overlap(character, unlockZone_1, pleasureToUnlock, null, this) == true){
                game.physics.arcade.overlap(character, unlockZone_1, pleasureToUnlock, null, this);
            }
            else{
                game.physics.arcade.overlap(character, barrier_1_nextlvl, textUnlock, null, this);
            }
        }
        else{
            text_unlockNewHorizon.visible = false;
        }
    }
    

    // Zone 3
    if(zone == 2){
        if(game.physics.arcade.overlap(character, barrier_2_nextlvl, textUnlock, null, this) == true ||
        game.physics.arcade.overlap(character, unlockZone_2, pleasureToUnlock, null, this) == true){
            if(game.physics.arcade.overlap(character, unlockZone_2, pleasureToUnlock, null, this) == true){
                game.physics.arcade.overlap(character, unlockZone_2, pleasureToUnlock, null, this);
            }
            else{
                game.physics.arcade.overlap(character, barrier_2_nextlvl, textUnlock, null, this);
            }
        }
        else{
            text_unlockNewHorizon.visible = false;
        }
    }
    if(zone == 3){
        if(game.physics.arcade.overlap(character, winCostSprite, pleasureToUnlock, null, this) == true){
            game.physics.arcade.overlap(character, barrier_2_nextlvl, pleasureToUnlock, null, this);
        }
        else{
            text_unlockNewHorizon.visible = false;
        }
    }

    game.physics.arcade.collide(character, collisionGroup);
    game.physics.arcade.collide(zombiesGroup, collisionGroup);
    game.physics.arcade.collide(zombies2Group, collisionGroup);
    game.physics.arcade.collide(zombies3Group, collisionGroup);
}

// GEMS AND MONEY

function spawnGems() {
    function getRandomPosition() {
        if(zone == 1){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
        if(zone == 2){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
        if(zone == 3){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
    }

    function isValidPosition(x, y) {
        return !(
            (x < 600 && x > 420 && y < -1510 && y > -1630) ||
            (x < 1150 && x > 970 && y < -1190 && y > -1330)||
            (x < 250 && x > -150 && y < 250 && y > -150) ||
            (x < -180 && x > -330 && y < 1000 && y > 770) ||
            (x < 1180 && x > 1030 && y < -330 && y > -480));
    }

    function generateGem() {
        if(!gamePaused == true){
            let position = getRandomPosition();
            while (!isValidPosition(position.x, position.y)) {
                position = getRandomPosition();
            }
    
            const gem = game.add.sprite(position.x, position.y, "gem");
            gem.anchor.setTo(0.5);
            gem.scale.setTo(0.5);
            gemGroup.add(gem);
        }
        
    }

    if(!gamePaused){
        setInterval(() => {
            generateGem();
        }, game.rnd.between(levelConfig.gems_ms.lower, levelConfig.gems_ms.upper));
    }
    
}

function collisionCharacterGem () {
    gemGroup.forEachAlive(function(gem) {
        const distance = game.physics.arcade.distanceBetween(character, gem);
        if (distance < setUpMap.game.gem.collision_detected) {
            moneySound.play();
            gem.destroy();

            totalGems += 1;
            textTotalGems.setText(totalGems);

            const text = game.add.text(gem.x-10, gem.y, "+1", {
                fontSize: "32px",
                fill: "white",
                align: "center"
            });
            text.anchor.setTo(0.5, 0.5);
            const tween = game.add.tween(text).to({ y: gem.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function() {
                text.destroy();
            }, this);

            var img = game.add.sprite(gem.x+25, gem.y, "gem");
                img.scale.setTo(0.2);
                img.anchor.setTo(0.5);
            const tweenImg = game.add.tween(img).to({ y: gem.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tweenImg.onComplete.add(function() {
                img.destroy();
            }, this);
        }
    });
}

function spawnMoney (enemy, tipe) {
    moneySprite = game.add.sprite(enemy.x, enemy.y, "money");
    moneySprite.anchor.setTo(0.5);
    moneySprite.scale.setTo(0.1);

    if (tipe == 1) money1Group.add(moneySprite);
    else if (tipe == 2) money2Group.add(moneySprite);
    else money3Group.add(moneySprite);
}

function collisionMoneyCharacter () {
    money1Group.forEachAlive(function(money) {
        const distance = game.physics.arcade.distanceBetween(character, money);
        if (distance < setUpMap.game.money.collision_detected) {
            moneySound.play();
            money.destroy();

            totalMoney += levelConfig.bullet.money_for_kill_1;
            totalGameMoney += levelConfig.bullet.money_for_kill_1;

            textTotalMoney.setText(totalMoney);
            text_totalPoints.setText("Score: " + totalGameMoney);

            const text = game.add.text(money.x, money.y, "+" + levelConfig.bullet.money_for_kill_1, {
                fontSize: "32px",
                fill: "white",
                align: "center"
            });
            text.anchor.setTo(0.5, 0.5);
            const tween = game.add.tween(text).to({ y: money.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function() {
                text.destroy();
            }, this);

            var img = game.add.sprite(money.x+35, money.y-5, "money");
                img.scale.setTo(0.04);
                img.anchor.setTo(0.5);
            const tweenImg = game.add.tween(img).to({ y: money.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tweenImg.onComplete.add(function() {
                img.destroy();
            }, this);
        }
    });

    if (zombies2SetUpCalled){
        money2Group.forEachAlive(function(money) {
        const distance = game.physics.arcade.distanceBetween(character, money);
            if (distance < setUpMap.game.money.collision_detected) {
                moneySound.play();
                money.destroy();

                totalMoney += levelConfig.bullet.money_for_kill_2;
                totalGameMoney += levelConfig.bullet.money_for_kill_2;

                textTotalMoney.setText(totalMoney);
                text_totalPoints.setText("Score: " + totalGameMoney);

                const text = game.add.text(money.x, money.y, "+" + levelConfig.bullet.money_for_kill_2, {
                    fontSize: "32px",
                    fill: "white",
                    align: "center"
                });
    
                text.anchor.setTo(0.5, 0.5);
    
                const tween = game.add.tween(text).to({ y: money.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    
                tween.onComplete.add(function() {
                    text.destroy();
                }, this);
            }
        });
    }

    if (zombies3SetUpCalled){
        money3Group.forEachAlive(function(money) {
        const distance = game.physics.arcade.distanceBetween(character, money);
            if (distance < setUpMap.game.money.collision_detected) {
                moneySound.play();
                money.destroy();

                totalMoney += levelConfig.bullet.money_for_kill_3;
                totalGameMoney += levelConfig.bullet.money_for_kill_3;

                textTotalMoney.setText(totalMoney);
                text_totalPoints.setText("Score: " + totalGameMoney);

                const text = game.add.text(money.x, money.y, "+" + levelConfig.bullet.money_for_kill_3, {
                    fontSize: "32px",
                    fill: "white",
                    align: "center"
                });
    
                text.anchor.setTo(0.5, 0.5);
    
                const tween = game.add.tween(text).to({ y: money.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    
                tween.onComplete.add(function() {
                    text.destroy();
                }, this);
            }
        });
    }
}

// POWERUPS

function spawnPowerHealth () {
    function getRandomPosition() {
        if(zone == 1){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
        if(zone == 2){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
        if(zone == 3){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
    }

    function generateHealth() {
        if(!gamePaused == true){
            let position = getRandomPosition();
            const healthPU = game.add.sprite(position.x, position.y, "healthPowerUp");
            healthPU.anchor.setTo(0.5);
            healthPU.scale.setTo(0.1);
            healhtPUGroup.add(healthPU);

            const moveUp = game.add.tween(healthPU).to({ y: healthPU.y - 20 }, 2000, Phaser.Easing.Linear.None);
            const moveDown = game.add.tween(healthPU).to({ y: healthPU.y + 20 }, 2000, Phaser.Easing.Linear.None);

            moveUp.chain(moveDown);
            moveDown.chain(moveUp);
            moveUp.start();
        }
        
    }

    if(!gamePaused){
        setInterval(() => {
            generateHealth();
        }, game.rnd.between(levelConfig.health_power_up_ms.lower, levelConfig.health_power_up_ms.upper));
    }
}

function collisionCharacterHealhtPU () {
    healhtPUGroup.forEachAlive(function(health) {
        const distance = game.physics.arcade.distanceBetween(character, health);
        if (distance < setUpMap.game.health.collision_detected) {
            if(levelConfig.character.totalHealth != levelConfig.character.totalHealthMAX){
                if(levelConfig.character.totalHealth + 30 <= levelConfig.character.totalHealthMAX){
                    levelConfig.character.totalHealth += 30;
                }
                else{
                    levelConfig.character.totalHealth = levelConfig.character.totalHealthMAX;
                }

                const text = game.add.text(health.x-10, health.y, "+30", {
                    fontSize: "32px",
                    fill: "white",
                    align: "center"
                });
                text.anchor.setTo(0.5, 0.5);
    
                var img = game.add.sprite(health.x+35, health.y, "healthPowerUp");
                img.scale.setTo(0.05);
                img.anchor.setTo(0.5);
    
                const tween = game.add.tween(text).to({ y: health.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function() {
                    text.destroy();
                }, this);
    
                const tweenImg = game.add.tween(img).to({ y: health.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                tweenImg.onComplete.add(function() {
                    img.destroy();
                }, this);
                moneySound.play();
                health.destroy();

                updatePlayerHealthBar();
            }
        }
    });
}

function spawnPowerAttack () {
    function getRandomPosition() {
        if(zone == 1){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_1.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
        if(zone == 2){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_2.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
        if(zone == 3){
            return {
                x: game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.x, setUpMap.game.enemy.level_1.lower_right_corner.x),
                y: game.rnd.between(setUpMap.game.enemy.level_3.upper_left_corner.y, setUpMap.game.enemy.level_1.lower_right_corner.y)
            };
        }
    }

    function generateAttack() {
        if(!gamePaused == true){
            let position = getRandomPosition();
            const attackPU = game.add.sprite(position.x, position.y, "attackPowerUp");
            attackPU.anchor.setTo(0.5);
            attackPU.scale.setTo(0.1);
            attackPUGroup.add(attackPU);

            const rotateTween = game.add.tween(attackPU).to({ angle: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, -1);
        }
        
    }

    if(!gamePaused){
        setInterval(() => {
            generateAttack();
        }, game.rnd.between(levelConfig.attack_power_up_ms.lower, levelConfig.attack_power_up_ms.upper));
    }
}

function collisionCharacterAttackPU () {
    attackPUGroup.forEachAlive(function(attack) {
        const distance = game.physics.arcade.distanceBetween(character, attack);
        if (distance < setUpMap.game.attack.collision_detected) {
            const text = game.add.text(attack.x-10, attack.y, "¡BONUS!", {
                fontSize: "32px",
                fill: "white",
                align: "center"
            });
            text.anchor.setTo(0.5, 0.5);

            const tween = game.add.tween(text).to({ y: attack.y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function() {
                text.destroy();
            }, this);

            if(tool == false){
                startCounter();
            }
            moneySound.play();
            attack.destroy();
        }
    });
}

function startCounter() {
    if (counterActive) return;
    tool = true;
    counterActive = true;
    counterValue = 20;
    text_dmg.visible = true;
    text_dmg.setText("BONUS ATTACK: " + counterValue);
    levelConfig.bullet.damage1 += 20;
    levelConfig.bullet.damage2 += 20;

    var interval = setInterval(function() {
        counterValue--;
        text_dmg.setText("BONUS ATTACK: " + counterValue);

        if (counterValue <= 0) {
            clearInterval(interval);
            text_dmg.visible = false;
            counterActive = false;
            otherVariable = true;
            levelConfig.bullet.damage1 = 20;
            levelConfig.bullet.damage2 = 10;
            tool = false;
        }
    }, 1000);
}