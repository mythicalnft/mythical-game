
// Lógica para conectar Eternl Wallet y verificar NFTs de la colección

let userNFTs = [];
let playerRarity = "Base"; // valor por defecto

const POLICY_ID = "0af26c4f3a8d3223c5fc22c666da02473c8c39d1b29a36723f3eb4b5";

// Función para conectar Eternl Wallet
async function connectWallet() {
    if (!window.cardano || !window.cardano.eternl) {
        alert("Eternl wallet no detectada. Por favor instálala o actívala.");
        return;
    }

    const api = await window.cardano.eternl.enable();
    const rawUtxos = await api.getUtxos();

    const utxosHex = rawUtxos.map(utxo => utxo).join('');
    const utxosDecoded = window.CryptoProvider.decodeUtxos(utxosHex);

    userNFTs = utxosDecoded.filter(utxo => {
        return utxo.assets.some(asset =>
            asset.policyId === POLICY_ID
        );
    });

    if (userNFTs.length === 0) {
        alert("No se encontraron NFTs de la colección.");
        return;
    }

    // Extraer rareza desde metadata (simulación básica)
    const nft = userNFTs[0];
    const assetName = nft.assets[0].assetName || "Base";

    if (assetName.includes("Epic")) playerRarity = "Epic";
    else if (assetName.includes("Super")) playerRarity = "Super rare";
    else if (assetName.includes("Very")) playerRarity = "Very rare";
    else if (assetName.includes("Rare")) playerRarity = "Rare";
    else playerRarity = "Base";

    alert("NFT detectado. Rareza: " + playerRarity);
}



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: '#f4c07a',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let obstacles;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('obstacle', 'https://labs.phaser.io/assets/sprites/block.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create() {
    this.add.text(10, 10, 'Desafío Mítico', { fontSize: '20px', fill: '#000' });

    const ground = this.physics.add.staticGroup();
    ground.create(400, 380, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 300, 'player').setScale(1.5);
    player.setCollideWorldBounds(true);

    obstacles = this.physics.add.group();

    this.time.addEvent({
        delay: 1500,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    scoreText = this.add.text(650, 10, 'Puntaje: 0', { fontSize: '18px', fill: '#000' });
}

function update() {
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }

    obstacles.children.iterate(function (child) {
        if (child.x < -50) {
            child.destroy();
            score += 1;
            scoreText.setText('Puntaje: ' + score);
        }
    });
}

function spawnObstacle() {
    const obstacle = obstacles.create(850, 340, 'obstacle');
    obstacle.setVelocityX(-200);
    obstacle.setImmovable(true);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.pause();
    scoreText.setText('¡Fin del juego! Puntaje: ' + score);
}
