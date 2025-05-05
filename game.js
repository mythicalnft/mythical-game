
// Configuración del juego
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales
var player;
var obstacles;
var cursors;

function preload() {
    this.load.image('player', 'player.png');
    this.load.image('obstacle', 'obstacle.png');
}

function create() {
    // Creación del personaje
    player = this.physics.add.sprite(100, 500, 'player');
    player.setCollideWorldBounds(true);

    // Creación de los obstáculos
    obstacles = this.physics.add.group();

    // Agregar obstáculos cada 2 segundos
    this.time.addEvent({
        delay: 2000,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });

    // Configuración de las teclas
    cursors = this.input.keyboard.createCursorKeys();

    // Configurar la colisión entre el jugador y los obstáculos
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

function update() {
    // Movimiento del jugador (salto)
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300);
    }

    // Hacer que los obstáculos se muevan hacia la izquierda
    obstacles.children.iterate(function(obstacle) {
        if (obstacle) {
            obstacle.setVelocityX(-200);

            // Destruir el obstáculo si sale de la pantalla
            if (obstacle.x < 0) {
                obstacle.destroy();
            }
        }
    });
}

function spawnObstacle() {
    var yPosition = Math.random() < 0.5 ? 500 : 300; // Posiciones en el suelo o aire
    var obstacle = obstacles.create(800, yPosition, 'obstacle');
    obstacle.setGravityY(300); // Da caída a los obstáculos
    obstacle.setCollideWorldBounds(true);
    obstacle.setVelocityX(-200); // Movimiento hacia la izquierda

    // Tiempo aleatorio para el siguiente obstáculo
    var randomDelay = Math.random() * 2000 + 1000; // Entre 1000ms y 3000ms
    this.time.addEvent({
        delay: randomDelay,
        callback: spawnObstacle,
        callbackScope: this,
        loop: false
    });
}

// Función para manejar la colisión
function hitObstacle(player, obstacle) {
    // Lógica cuando el jugador colisiona con un obstáculo
    console.log("¡Colisión!");
    // Aquí podrías restar vida o reiniciar el juego
}

var game = new Phaser.Game(config);

