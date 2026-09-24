// 贪吃蛇核心逻辑：纯函数，不依赖 DOM，便于测试。

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function createGame({ width = 20, height = 20, random = Math.random } = {}) {
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const snake = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
  return {
    width,
    height,
    snake,
    direction: 'right',
    pendingDirection: 'right',
    food: placeFood(snake, width, height, random),
    score: 0,
    over: false,
  };
}

// 返回可落食物的随机空格；棋盘已满时返回 null。
export function placeFood(snake, width, height, random = Math.random) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(random() * free.length)];
}

// 修改方向；禁止直接掉头。以当前帧实际方向判断，防止同一帧内快速连按导致掉头。
export function turn(state, dir) {
  if (!DIRECTIONS[dir] || state.over) return state;
  if (OPPOSITE[state.direction] === dir) return state;
  return { ...state, pendingDirection: dir };
}

export function step(state, random = Math.random) {
  if (state.over) return state;

  const direction = state.pendingDirection;
  const d = DIRECTIONS[direction];
  const head = { x: state.snake[0].x + d.x, y: state.snake[0].y + d.y };
  const eating = state.food && head.x === state.food.x && head.y === state.food.y;

  const hitWall = head.x < 0 || head.y < 0 || head.x >= state.width || head.y >= state.height;
  // 不吃东西时尾巴会移走，所以蛇头可以进入当前尾巴的位置。
  const body = eating ? state.snake : state.snake.slice(0, -1);
  const hitSelf = body.some((p) => p.x === head.x && p.y === head.y);

  if (hitWall || hitSelf) {
    return { ...state, direction, over: true };
  }

  const snake = [head, ...body];
  if (!eating) {
    return { ...state, snake, direction };
  }

  const food = placeFood(snake, state.width, state.height, random);
  return {
    ...state,
    snake,
    direction,
    food,
    score: state.score + 1,
    over: food === null, // 填满棋盘即获胜结束
  };
}
