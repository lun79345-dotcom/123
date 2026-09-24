# 123

一个用原生 JavaScript 写的贪吃蛇小游戏，无需任何依赖。

## 快速开始

```bash
git clone https://github.com/lun79345-dotcom/123.git
cd 123
python3 -m http.server 8000   # 或任意静态服务器
```

浏览器打开 <http://localhost:8000/game/> 即可游玩。

- 方向键 / WASD 控制方向，空格暂停
- 手机上可以滑动屏幕或点击方向按钮

## 测试

游戏逻辑在 `game/snake.js`，是不依赖 DOM 的纯函数，测试使用 Node 内置测试框架（Node 18+）：

```bash
npm test
```

## 贡献

1. 从 `main` 新建分支
2. 提交改动
3. 发起 Pull Request
