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
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);

        this.obstacles = this.physics.add.group();

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const obs = this.obstacles.create(800, 300, 'obstacle');
                obs.setVelocityX(-100);
                obs.setImmovable(true);
            },
            loop: true
        });

        this.physics.add.collider(this.player, this.obstacles, () => {
            this.scene.restart();
        }, null, this);
    }

    update() {
        this.obstacles.children.iterate(function (obstacle) {
            if (obstacle && obstacle.x !== undefined) {
                if (obstacle.x < -50) {
                    obstacle.destroy();
                }
            }
        });

        if (this.input.activePointer.isDown) {
            this.player.setVelocityY(-250);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: '#87CEEB',
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
