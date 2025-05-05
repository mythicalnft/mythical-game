
class MyGame extends Phaser.Scene {
    constructor() {
        super('myGame');
    }

    preload() {
        this.load.image('player', 'player.png');
        this.load.image('obstacle', 'obstacle.png');
    }

    create() {
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);

        this.obstacles = this.physics.add.group();

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const obs = this.obstacles.create(800, 300, 'obstacle');
                obs.setVelocityX(-150);
                obs.setImmovable(true);
                obs.body.allowGravity = false;
            },
            loop: true
        });

        this.physics.add.collider(this.player, this.obstacles, () => {
            this.scene.restart();
        });
    }

    update() {
        if (this.input.activePointer.isDown) {
            this.player.setVelocityY(-300);
        }

        this.obstacles.children.iterate(function (obstacle) {
            if (obstacle && obstacle.x < -50) {
                obstacle.destroy();
            }
        });
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
