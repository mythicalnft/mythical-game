
obstacles.children.iterate(function (obstacle) {
    if (obstacle && obstacle.x !== undefined) {
        obstacle.x -= speed;
        if (obstacle.x < -50) {
            obstacle.destroy();
        }
    }
});
