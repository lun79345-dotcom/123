import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, placeFood, step, turn } from './snake.js';

const fixed = (v) => () => v;

test('新游戏：蛇长 3、向右、分数 0', () => {
  const g = createGame({ width: 10, height: 10, random: fixed(0) });
  assert.equal(g.snake.length, 3);
  assert.deepEqual(g.snake[0], { x: 5, y: 5 });
  assert.equal(g.direction, 'right');
  assert.equal(g.score, 0);
  assert.equal(g.over, false);
});

test('食物不会生成在蛇身上', () => {
  const g = createGame({ width: 10, height: 10 });
  for (let i = 0; i < 200; i++) {
    const food = placeFood(g.snake, 10, 10);
    assert.ok(!g.snake.some((p) => p.x === food.x && p.y === food.y));
  }
});

test('棋盘填满时 placeFood 返回 null', () => {
  const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  assert.equal(placeFood(snake, 2, 1), null);
});

test('每步向前移动一格，长度不变', () => {
  let g = createGame({ width: 10, height: 10, random: fixed(0) });
  g = { ...g, food: { x: 0, y: 0 } };
  const next = step(g);
  assert.deepEqual(next.snake[0], { x: 6, y: 5 });
  assert.equal(next.snake.length, 3);
});

test('吃到食物：长度 +1，分数 +1，生成新食物', () => {
  let g = createGame({ width: 10, height: 10, random: fixed(0) });
  g = { ...g, food: { x: 6, y: 5 } };
  const next = step(g, fixed(0));
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.notDeepEqual(next.food, { x: 6, y: 5 });
});

test('不能直接掉头', () => {
  const g = createGame({ width: 10, height: 10 });
  assert.equal(turn(g, 'left').pendingDirection, 'right');
  assert.equal(turn(g, 'up').pendingDirection, 'up');
});

test('同一帧内快速连按也不能掉头', () => {
  let g = createGame({ width: 10, height: 10 });
  g = turn(g, 'up');
  g = turn(g, 'left'); // 实际方向仍是 right，left 被拒绝
  g = { ...g, food: { x: 0, y: 0 } };
  const next = step(g);
  assert.equal(next.over, false);
  assert.deepEqual(next.snake[0], { x: 5, y: 4 });
});

test('撞墙游戏结束', () => {
  let g = createGame({ width: 4, height: 4 });
  g = { ...g, snake: [{ x: 3, y: 0 }, { x: 2, y: 0 }], food: { x: 0, y: 3 } };
  assert.equal(step(g).over, true);
});

test('撞到自己游戏结束', () => {
  const g = {
    ...createGame({ width: 10, height: 10 }),
    snake: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 },
    ],
    direction: 'up',
    pendingDirection: 'down',
    food: { x: 9, y: 9 },
  };
  assert.equal(step(g).over, true);
});

test('蛇头可以进入刚离开的尾巴格子', () => {
  const g = {
    ...createGame({ width: 10, height: 10 }),
    snake: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }],
    direction: 'left',
    pendingDirection: 'down',
    food: { x: 9, y: 9 },
  };
  const next = step(g);
  assert.equal(next.over, false);
  assert.deepEqual(next.snake[0], { x: 2, y: 3 });
});

test('游戏结束后 step 不再变化', () => {
  const g = { ...createGame(), over: true };
  assert.equal(step(g), g);
});
