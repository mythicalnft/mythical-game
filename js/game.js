let speed = 2;

class MyGame extends Phaser.Scene {
    constructor() {
        super('myGame');
    }

    preload() {
        this.load.image('player', 'js/player.png'); // Cambia esta ruta si tu sprite está en otro lugar
        this.load.image('obstacle', 'js/obstacle.png');
    }

    create() {
        // Crear el jugador
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // Crear el grupo de obstáculos
        this.obstacles = this.physics.add.group();

        // Crear obstáculos periódicamente
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const obs = this.obstacles.create(800, 300, 'obstacle');
                obs.setVelocityX(-100);  // Mover obstáculos hacia la izquierda
                obs.setImmovable(true);
            },
            loop: true
        });

        // Colisión entre el jugador y los obstáculos
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.scene.restart();
        }, null, this);
    }

    update() {
        // Actualización de los obstáculos
        this.obstacles.children.iterate(function (obstacle) {
            if (obstacle && obstacle.x !== undefined) {
                if (obstacle.x < -50) {
                    obstacle.destroy();  // Destruir obstáculos cuando salen de la pantalla
                }
            }
        });

        // Saltar si se hace clic
        if (this.input.activePointer.isDown) {
            this.player.setVelocityY(-250);  // Hacer que el jugador salte
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: '#87CEEB',  // Fondo azul del cielo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
