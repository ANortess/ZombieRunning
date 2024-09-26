const config = {
    parent: "game",
    type: Phaser.AUTO,
    scale: {
        width: 800,
        height: 600
    },
    physics: {
        default: "arcade",
        arcade:{
            debug: true
        }
    }
}

let game = new Phaser.Game(config);
let mainState = { preload: preload, create: create, update: update };

game.state.add('inEndScreen', inEndScreenState);
game.state.add('inGame', inGameState);
game.state.add('inMenu', inMenuState);
game.state.add('main', mainState);
game.state.start('inMenu');

function preload () {}
function create () {}
function update() {}

// Cosas que no van al JSON

const TIMER_RHYTHM = 0.1 * Phaser.Timer.SECOND;

let cursors;
let character;
var background;
var background_2;
var background_3;
var safe_area;

var zombiesGroup;
var zombies2Group;
var zombies3Group;
var bulletGroup;
var collisionGroup;
var gemGroup;
var healhtPUGroup;
var attackPUGroup;

var textTotalBullets;
var textReloading;
var textTotalMoney;
var textTotalGems;

var isShooting = false;
var canShoot = true;
var isReloading = false;
var isZombieAttackSoundPlaying = false;

var progressBar;

var reloadTime = 1500; // Tiempo de recarga en milisegundos
var reloadTimer = 0; 

var idleFramesHandgun = [];
var walkFramesHandgun = [];
var reloadFramesHandgun = [];
var shootFramesHandgun = [];

var idleFramesRifle = [];
var walkFramesRifle = [];
var reloadFramesRifle = [];
var shootFramesRifle = [];

var idleFramesZombie = [];
var walkFramesZombie = [];
var runFramesZombie = [];
var attackFramesZombie = [];

var explosionFrames = [];

var playerHealthBar;
var collisionTimer;

var difficulty;
var textoInstrucciones;

var zone_buyAmmu;
var zone_reloadAmmu;
var shopBullets;
var returnButton;
var gamePaused = false; 
var canGamePaused = true; 

var zombies2SetUpCalled = false;
var zombies3SetUpCalled = false;

var textShopTitle;
var buy_shopButton;
var confirm_shopButton;
var cancel_shopButton;

var text_ammuInCharger;
var text_ammuInChargerBuy;
var text_ammuInPocket;
var text_ammuInPocketBuy;

var text_cost;
var text_costGem;
var text_currentMoney;
var shop_currentMoney;

var moneySpriteShop;
var gemSpriteShop;
var activeSpriteGem;

var checkButtonShop;
var checkButtonUnlockZone;
var money;

var level_capacity;

const change_rifle = 3;
const change_shotgun = 6;

var justReloadWeapon;

var text_reloadWeapon;
var reloadinterval;
var inSafeArea = false;

var levelConfig;
var setUpMap;

var text_inSafeArea;

var barrier_1_nextlvl;
var barrier_1_nextlvl_collide;
var text_unlockNewHorizon;
var unlockZone_1;
var shopNewArea;

var barrier_2_nextlvl;
var barrier_2_nextlvl_collide;
var unlockZone_2;

var text_shopNewZoneTitle;
var text_shopNewZoneDescription;
var text_shopNewZoneCost;
var button_shopNewZoneReturn;
var button_shopNewZoneConfirm;
var button_shopNewZoneCancel;
var button_shopNewZoneBuy;
var text_shopNewZoneCostMoney;
var text_shopNewZoneCostGem;
var moneySpriteZone_1;
var gemSpriteZone_1;

var moneySprite;
var money1Group;
var money2Group;

var zone;
var lost;

var winCostSprite;

var totalMoney;
var totalGameMoney;
var totalGems;

var totalAmmu;
var actuallyAmmu;
var totalCapacityAmmu;

var text_secondsInSafeArea;
var remainingTime = 10.0;
var pause;
var countdown;

var text_dmg;

var counterActive = false;
var counterValue = 10;
var otherVariable = false;

var tool = false;

