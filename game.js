var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var obstacles;
var cursors;

function preload() {
    this.load.image('player', 'player.png');
    this.load.image('obstacle', 'obstacle.png');
}

function create() {
    // Crear el jugador
    player = this.physics.add.sprite(100, 500, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0.2); // Agrega rebote para interacción con obstáculos

    // Configuración de los obstáculos
    obstacles = this.physics.add.group();

    // Generación de obstáculos aleatorios
    this.time.addEvent({
        delay: 2000,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });

    // Configurar controles
    cursors = this.input.keyboard.createCursorKeys();

    // Colisiones entre el jugador y los obstáculos
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

function update() {
    // Movimiento del jugador
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300); // Salto
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-200); // Mover a la izquierda
    } else if (cursors.right.isDown) {
        player.setVelocityX(200); // Mover a la derecha
    } else {
        player.setVelocityX(0); // Detener movimiento horizontal
    }
}

// Función para generar obstáculos en diferentes alturas
function spawnObstacle() {
    var yPosition = Math.random() < 0.5 ? 500 : 300; // Aleatorio entre aire o suelo
    var obstacle = obstacles.create(800, yPosition, 'obstacle');
    obstacle.setGravityY(300); // Da gravedad a los obstáculos
    obstacle.setCollideWorldBounds(true);
    obstacle.setVelocityX(-200); // Movimiento hacia la izquierda
}

// Función para manejar la colisión
function hitObstacle(player, obstacle) {
    console.log("¡Colisión con el obstáculo!");
    // Aquí puedes agregar lógica para el juego cuando el jugador colisiona con un obstáculo
    player.setTint(0xff0000); // Tintado de rojo cuando colisiona
    player.setAlpha(0.5); // Reducir opacidad como efecto visual
}

var game = new Phaser.Game(config);
