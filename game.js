// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// 游戏设置
const gridSize = 20; // 格子大小
const tileCount = canvas.width / gridSize; // 一行/列格子数

// 蛇的初始状态
let snake = [
    {x: 10, y: 10}
];
let dx = 1; // X轴移动方向
let dy = 0; // Y轴移动方向
let food = {};
let score = 0;
let gameLoop;
let gameRunning = true;

// 生成食物
function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

// 绘制元素
function draw() {
    // 背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    snake.forEach(segment => {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // 绘制食物
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 游戏主逻辑
function update() {
    if (!gameRunning) return;

    // 蛇头移动
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // ============== 反向规则核心 ==============
    // 1. 吃到食物 → 直接失败
    if (head.x === food.x && head.y === food.y) {
        alert('💀 吃到食物了！游戏失败！');
        gameRunning = false;
        clearInterval(gameLoop);
        return;
    }

    // 2. 撞墙 → 胜利
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        alert('🎉 撞墙成功！你赢了！分数：' + score);
        gameRunning = false;
        clearInterval(gameLoop);
        return;
    }

    // 3. 撞到自己 → 胜利
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            alert('🎉 撞到自己！你赢了！分数：' + score);
            gameRunning = false;
            clearInterval(gameLoop);
            return;
        }
    }

    // 没吃到食物，删除蛇尾
    snake.pop();
    score++;
    scoreElement.textContent = score;
}

// 键盘控制
document.addEventListener('keydown', e => {
    if (!gameRunning) return;
    
    switch (e.key) {
        case 'ArrowLeft': if (dx !== 1) {dx = -1; dy = 0;} break;
        case 'ArrowRight': if (dx !== -1) {dx = 1; dy = 0;} break;
        case 'ArrowUp': if (dy !== 1) {dx = 0; dy = -1;} break;
        case 'ArrowDown': if (dy !== -1) {dx = 0; dy = 1;} break;
    }
});

// 启动游戏
spawnFood();
gameLoop = setInterval(() => {
    update();
    draw();
}, 100);
