const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreLabelEl = document.querySelector("#scoreLabel");
const coinsLabelEl = document.querySelector("#coinsLabel");
const bankLabelEl = document.querySelector("#bankLabel");
const levelLabelEl = document.querySelector("#levelLabel");
const comboLabelEl = document.querySelector("#comboLabel");
const focusLabelEl = document.querySelector("#focusLabel");
const scoreEl = document.querySelector("#score");
const coinsEl = document.querySelector("#coins");
const bankEl = document.querySelector("#bank");
const levelEl = document.querySelector("#level");
const bankPanelEl = document.querySelector("#bankPanel");
const levelPanelEl = document.querySelector("#levelPanel");
const comboEl = document.querySelector("#combo");
const focusEl = document.querySelector("#focus");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#startButton");
const gameTabButtons = document.querySelectorAll(".game-tab");
const panelEyebrowEl = document.querySelector("#panelEyebrow");
const panelTitleEl = document.querySelector("#panelTitle");
const panelCopyEl = document.querySelector("#panelCopy");
const shopEl = document.querySelector(".shop");
const worldShopEl = document.querySelector("#worldShop");
const skinShopEl = document.querySelector("#skinShop");
const worldCountEl = document.querySelector("#worldCount");
const skinCountEl = document.querySelector("#skinCount");
const worldPageEl = document.querySelector("#worldPage");
const skinPageEl = document.querySelector("#skinPage");
const worldPrevButton = document.querySelector("#worldPrev");
const worldNextButton = document.querySelector("#worldNext");
const skinPrevButton = document.querySelector("#skinPrev");
const skinNextButton = document.querySelector("#skinNext");

const world = { width: 960, height: 640 };
const saveKey = "moonwake-shop-v1";
const pageSize = 6;
const worldItems = buildCatalog("world");
const skinItems = buildCatalog("skin");
const shopPages = { worlds: 0, skins: 0 };
const view = { scale: 1, offsetX: 0, offsetY: 0, ratio: 1 };
const touchState = { startX: 0, startY: 0, startTime: 0, isTouching: false };
let pointerTarget = null;
let lastTime = 0;
let profile = loadProfile();
let activeGame = "moonwake";
let state = makeState();
let capyState = makeCapyState();

function buildCatalog(type) {
  const base =
    type === "world"
      ? [
          { id: "moon", name: "Moonwake", price: 0, level: 1, note: "Original neon tide", swatch: "linear-gradient(135deg, #081427, #59d1ff)" },
          { id: "beach", name: "Beach", price: 2, level: 1, note: "Soft waves and sand", swatch: "linear-gradient(135deg, #28b6d6, #ffd36d)" },
          { id: "sunset", name: "Pink Sunset", price: 4, level: 2, note: "Warm dreamy sky", swatch: "linear-gradient(135deg, #ff8fb7, #ffd36d)" },
          { id: "crystal", name: "Crystal City", price: 7, level: 4, note: "Sharp icy skyline", swatch: "linear-gradient(135deg, #98f3ff, #8859ff)" },
          { id: "rainbow", name: "Rainbow Nebula", price: 10, level: 7, note: "Full cosmic glow", swatch: "linear-gradient(135deg, #ff5f8b, #ffcf5a, #59d1ff, #a761ff)" },
        ]
      : [
          { id: "blue", name: "Blue", price: 0, level: 1, note: "Classic comet", swatch: "linear-gradient(135deg, #59d1ff, #a761ff)" },
          { id: "pink", name: "Pink", price: 1.5, level: 1, note: "Candy bright", swatch: "linear-gradient(135deg, #ff8fb7, #ff5f8b)" },
          { id: "gold", name: "Gold", price: 3, level: 2, note: "Shiny little star", swatch: "linear-gradient(135deg, #fff7d7, #ffcf5a)" },
          { id: "rainbow", name: "Rainbow", price: 5, level: 3, note: "Animated sparkle", swatch: "linear-gradient(135deg, #ff5f8b, #ffcf5a, #59d1ff, #a761ff)" },
          { id: "cat", name: "Cosmic Cat", price: 8, level: 5, note: "Ears, whiskers, attitude", swatch: "linear-gradient(135deg, #101820, #ffcf5a)" },
          { id: "galaxy", name: "Galaxy", price: 12, level: 8, note: "Deep space luxury", swatch: "linear-gradient(135deg, #160d36, #59d1ff, #ffffff)" },
          { id: "panda", name: "Panda Pop", price: 14, level: 10, note: "Round ears and sleepy eyes", swatch: "linear-gradient(135deg, #ffffff, #101820)" },
          { id: "boba", name: "Boba Tea", price: 18, level: 14, note: "Cup, straw, and tapioca pearls", swatch: "linear-gradient(135deg, #f4c58d, #6b3b25)" },
          { id: "ufo", name: "Tiny UFO", price: 24, level: 20, note: "Saucer beam trail", swatch: "linear-gradient(135deg, #98f3ff, #8d8eff)" },
          { id: "strawberry", name: "Strawberry", price: 30, level: 28, note: "Seeds and leafy cap", swatch: "linear-gradient(135deg, #ff4f72, #58d36b)" },
          { id: "slime", name: "Glow Slime", price: 38, level: 36, note: "Squishy wobble face", swatch: "linear-gradient(135deg, #7cff8a, #59d1ff)" },
          { id: "crown", name: "Royal Crown", price: 48, level: 48, note: "Gemmed little monarch", swatch: "linear-gradient(135deg, #ffcf5a, #a761ff)" },
          { id: "bee", name: "Honey Bee", price: 62, level: 64, note: "Tiny wings and stripes", swatch: "linear-gradient(135deg, #ffcf5a, #101820)" },
          { id: "dragon", name: "Pocket Dragon", price: 80, level: 82, note: "Horns and ember cheeks", swatch: "linear-gradient(135deg, #39d98a, #ff6b54)" },
        ];

  const worldWords = ["Lagoon", "Aurora", "Candy", "Chrome", "Lava", "Mint", "Velvet", "Starlit", "Bubble", "Prism", "Cloud", "Meteor", "Sakura", "Neon", "Glacier", "Citrine", "Violet", "Solar", "Ocean", "Dream"];
  const skinWords = ["Orbit", "Jelly", "Dragon", "Pixel", "Plasma", "Ghost", "Royal", "Marble", "Laser", "Cookie", "Ninja", "Velvet", "Bubble", "Chrome", "Sakura", "Solar", "Frost", "Dream", "Lucky", "Prism"];
  const endings = type === "world" ? ["Bay", "Sky", "Garden", "City", "Reef", "Valley", "Arcade", "Falls", "Harbor", "Realm"] : ["Comet", "Bean", "Star", "Whisker", "Dot", "Glow", "Sprite", "Bolt", "Puff", "Orb"];
  const words = type === "world" ? worldWords : skinWords;
  const generated = [];
  const generatedCount = type === "world" ? 495 : 500 - base.length;
  const levelOneBaseCount = base.filter((item) => item.level === 1).length;
  const levelOneGeneratedCount = Math.max(0, 10 - levelOneBaseCount);

  for (let i = 1; i <= generatedCount; i += 1) {
    const level =
      i <= levelOneGeneratedCount
        ? 1
        : Math.ceil(((i - levelOneGeneratedCount) / (generatedCount - levelOneGeneratedCount)) * 899) + 1;
    const hue = (i * 47 + (type === "world" ? 12 : 192)) % 360;
    const secondHue = (hue + 55 + (i % 9) * 18) % 360;
    const rare = i % 40 === 0;
    generated.push({
      id: `${type}-${i}`,
      name: `${words[i % words.length]} ${endings[(i * 3) % endings.length]} ${i}`,
      price: Number((1 + level * 0.04 + (rare ? 18 : i % 7) * 0.5).toFixed(1)),
      level,
      note: rare ? "Rare animated look" : `Unlocks at level ${level}`,
      swatch: `linear-gradient(135deg, hsl(${hue}, 88%, 62%), hsl(${secondHue}, 86%, 58%))`,
      hue,
      secondHue,
      shape: type === "skin" ? ["panda", "boba", "ufo", "berry", "slime", "crown", "bee", "dragon", "planet", "ghost"][i % 10] : "world",
      generated: true,
    });
  }

  return [...base, ...generated];
}

function makeState() {
  return {
    running: false,
    over: false,
    paidOut: false,
    score: 0,
    combo: 1,
    comboTimer: 0,
    focus: 100,
    wave: 0,
    shake: 0,
    pulseCooldown: 0,
    pearlTimer: 0.35,
    shardTimer: 0.8,
    crystalTimer: 8,
    player: {
      x: world.width / 2,
      y: world.height * 0.74,
      vx: 0,
      vy: 0,
      r: 28,
      speed: 2600,
    },
    items: [],
    shards: [],
    crystals: [],
    bursts: [],
  };
}

function makeCapyState() {
  return {
    running: false,
    over: false,
    score: 0,
    best: Number(localStorage.getItem("capybara-best") || 0),
    speed: 360,
    obstacleTimer: 1.15,
    cloudOffset: 0,
    capy: {
      x: 185,
      y: 462,
      vy: 0,
      r: 34,
      grounded: true,
      ducking: false,
    },
    obstacles: [],
    splashes: [],
  };
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  view.ratio = ratio;
  view.scale = Math.max(canvas.width / world.width, canvas.height / world.height);
  view.offsetX = (canvas.width - world.width * view.scale) / 2;
  view.offsetY = (canvas.height - world.height * view.scale) / 2;
  ctx.setTransform(view.scale, 0, 0, view.scale, view.offsetX, view.offsetY);
}

function startGame() {
  if (activeGame === "capybara") {
    startCapybara();
    return;
  }
  profile = loadProfile();
  state = makeState();
  state.running = true;
  overlay.classList.add("hidden");
  renderShop();
  lastTime = performance.now();
}

function startCapybara() {
  capyState = makeCapyState();
  capyState.running = true;
  overlay.classList.add("hidden");
  lastTime = performance.now();
}

function endGame() {
  state.running = false;
  state.over = true;
  const earned = getRunCoins(state.score);
  if (!state.paidOut) {
    profile.coins += earned;
    profile.lifetimePoints += Math.round(state.score);
    state.paidOut = true;
    saveProfile();
  }
  overlay.classList.remove("hidden");
  overlay.querySelector("h1").textContent = "Wake Held";
  overlay.querySelector("p").textContent = `Final score: ${Math.round(state.score)} points = ${formatCoinValue(earned)} coins earned. Your total coins stay saved when you play again.`;
  startButton.textContent = "Again";
  renderShop();
}

function spawnPearl() {
  state.items.push({
    x: 70 + Math.random() * (world.width - 140),
    y: -40,
    vx: -80 + Math.random() * 160,
    vy: 155 + state.wave * 6 + Math.random() * 70,
    r: 23,
    rot: Math.random() * Math.PI,
    spin: -2 + Math.random() * 4,
    kind: Math.random() > 0.86 ? "nova" : "pearl",
  });
}

function spawnShard() {
  const side = Math.random() > 0.5 ? -30 : world.width + 30;
  const targetY = 110 + Math.random() * (world.height - 180);
  const speed = 140 + state.wave * 10 + Math.random() * 120;
  state.shards.push({
    x: side,
    y: 80 + Math.random() * (world.height - 160),
    vx: side < 0 ? speed : -speed,
    vy: (targetY - world.height * 0.5) * 0.35,
    r: 16 + Math.random() * 9,
    spin: Math.random() * 8,
  });
}

function spawnCrystal() {
  state.crystals.push({
    x: 60 + Math.random() * (world.width - 120),
    y: -40,
    vx: -40 + Math.random() * 80,
    vy: 145 + Math.random() * 70,
    r: 20,
    wobble: Math.random() * 10,
  });
}

function burst(x, y, color, count = 14) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 70 + Math.random() * 230;
    state.bursts.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 0.42 + Math.random() * 0.38,
      max: 0.8,
      color,
      size: 3 + Math.random() * 6,
    });
  }
}

function update(dt) {
  if (activeGame === "capybara") {
    updateCapybara(dt);
    return;
  }
  if (!state.running) return;

  state.wave += dt;
  state.pearlTimer -= dt;
  state.shardTimer -= dt;
  state.crystalTimer -= dt;
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  state.pulseCooldown = Math.max(0, state.pulseCooldown - dt);
  state.shake = Math.max(0, state.shake - dt * 18);

  if (state.comboTimer <= 0) state.combo = 1;

  if (state.pearlTimer <= 0) {
    spawnPearl();
    state.pearlTimer = Math.max(0.23, 0.72 - state.wave * 0.008) + Math.random() * 0.24;
  }

  if (state.shardTimer <= 0) {
    spawnShard();
    state.shardTimer = Math.max(0.26, 1.1 - state.wave * 0.012) + Math.random() * 0.55;
  }

  if (state.crystalTimer <= 0) {
    spawnCrystal();
    state.crystalTimer = 7.5 + Math.random() * 5;
  }

  movePlayer(dt);
  updateGroup(state.items, dt);
  updateGroup(state.shards, dt);
  updateGroup(state.crystals, dt);
  updateBursts(dt);
  collide();

  state.focus -= dt * (1.2 + state.wave * 0.015);
  if (state.focus <= 0) {
    state.focus = 0;
    endGame();
  }
}

function updateCapybara(dt) {
  if (!capyState.running) return;
  const capy = capyState.capy;
  capyState.score += dt * 72;
  capyState.speed = Math.min(720, capyState.speed + dt * 9);
  capyState.cloudOffset = (capyState.cloudOffset + dt * 26) % world.width;
  capyState.obstacleTimer -= dt;

  if (capyState.obstacleTimer <= 0) {
    spawnCapyObstacle();
    capyState.obstacleTimer = Math.max(0.62, 1.35 - capyState.score / 1900) + Math.random() * 0.55;
  }

  capy.vy += 1850 * dt;
  capy.y += capy.vy * dt;
  if (capy.y >= 462) {
    capy.y = 462;
    capy.vy = 0;
    capy.grounded = true;
  }

  for (const obstacle of capyState.obstacles) {
    obstacle.x -= capyState.speed * dt;
    obstacle.wobble += dt * 5;
  }
  capyState.obstacles = capyState.obstacles.filter((obstacle) => obstacle.x > -90);

  for (const splash of capyState.splashes) {
    splash.x += splash.vx * dt;
    splash.y += splash.vy * dt;
    splash.life -= dt;
  }
  capyState.splashes = capyState.splashes.filter((splash) => splash.life > 0);

  for (const obstacle of capyState.obstacles) {
    if (capyHitsObstacle(capy, obstacle)) {
      endCapybara();
      break;
    }
  }
}

function spawnCapyObstacle() {
  const kind = ["cactus", "log", "rock", "bird"][Math.floor(Math.random() * 4)];
  const sizes = {
    cactus: { w: 38, h: 82, y: 453 },
    log: { w: 76, h: 34, y: 487 },
    rock: { w: 52, h: 44, y: 480 },
    bird: { w: 58, h: 34, y: 330 + Math.random() * 58 },
  };
  capyState.obstacles.push({ x: world.width + 70, wobble: 0, kind, ...sizes[kind] });
}

function capyJump() {
  if (activeGame !== "capybara") return;
  if (!capyState.running) {
    startCapybara();
    return;
  }
  const capy = capyState.capy;
  if (capy.grounded) {
    capy.vy = -760;
    capy.grounded = false;
    for (let i = 0; i < 10; i += 1) {
      capyState.splashes.push({
        x: capy.x - 25 + Math.random() * 50,
        y: 506,
        vx: -60 + Math.random() * 120,
        vy: -90 - Math.random() * 90,
        life: 0.35 + Math.random() * 0.25,
      });
    }
  }
}

function capyDuck(active) {
  if (activeGame !== "capybara") return;
  capyState.capy.ducking = active;
}

function capyHitsObstacle(capy, obstacle) {
  let capyBox;
  if (capy.ducking && capy.grounded) {
    capyBox = { x: capy.x - 42, y: capy.y - 22, w: 86, h: 38 };
  } else {
    capyBox = { x: capy.x - 42, y: capy.y - 42, w: 86, h: 58 };
  }
  const obstacleBox = { x: obstacle.x - obstacle.w / 2, y: obstacle.y - obstacle.h, w: obstacle.w, h: obstacle.h };
  return (
    capyBox.x < obstacleBox.x + obstacleBox.w &&
    capyBox.x + capyBox.w > obstacleBox.x &&
    capyBox.y < obstacleBox.y + obstacleBox.h &&
    capyBox.y + capyBox.h > obstacleBox.y
  );
}

function endCapybara() {
  capyState.running = false;
  capyState.over = true;
  capyState.best = Math.max(capyState.best, Math.round(capyState.score));
  localStorage.setItem("capybara-best", String(capyState.best));
  overlay.classList.remove("hidden");
  overlay.querySelector("h1").textContent = "Capybara Napped";
  overlay.querySelector("p").textContent = `Score: ${Math.round(capyState.score)}. Best: ${capyState.best}. Tap again for another run.`;
  startButton.textContent = "Again";
}

function movePlayer(dt) {
  const player = state.player;
  if (!pointerTarget) {
    player.vx = 0;
    player.vy = 0;
    return;
  }

  const dx = pointerTarget.x - player.x;
  const dy = pointerTarget.y - player.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 0.5) {
    const follow = 1 - Math.exp(-28 * dt);
    const step = Math.min(dist, player.speed * dt);
    const move = Math.max(step, dist * follow);
    player.vx = (dx / dist) * (move / dt);
    player.vy = (dy / dist) * (move / dt);
    player.x = clamp(player.x + (dx / dist) * move, player.r + 12, world.width - player.r - 12);
    player.y = clamp(player.y + (dy / dist) * move, 92, world.height - player.r - 18);
  } else {
    player.vx = 0;
    player.vy = 0;
  }
}

function updateGroup(group, dt) {
  for (const item of group) {
    item.x += item.vx * dt;
    item.y += item.vy * dt;
    item.rot = (item.rot || 0) + (item.spin || 0) * dt;
    item.wobble = (item.wobble || 0) + dt * 5;
  }
}

function updateBursts(dt) {
  for (const bit of state.bursts) {
    bit.x += bit.vx * dt;
    bit.y += bit.vy * dt;
    bit.vy += 260 * dt;
    bit.life -= dt;
  }
  state.bursts = state.bursts.filter((bit) => bit.life > 0);
}

function collide() {
  const player = state.player;
  state.items = state.items.filter((item) => {
    if (item.y > world.height + 80) {
      state.combo = 1;
      return false;
    }
    if (distance(player, item) < player.r + item.r) {
      const points = item.kind === "nova" ? 170 : 100;
      state.score += points * state.combo;
      state.combo = Math.min(12, state.combo + 1);
      state.comboTimer = 2.2;
      state.focus = Math.min(100, state.focus + (item.kind === "nova" ? 5 : 2.5));
      burst(item.x, item.y, item.kind === "nova" ? "#ff5f8b" : "#ffcf5a", 20);
      return false;
    }
    return true;
  });

  state.crystals = state.crystals.filter((crystal) => {
    if (crystal.y > world.height + 80) return false;
    if (distance(player, crystal) < player.r + crystal.r) {
      state.focus = Math.min(100, state.focus + 24);
      state.pulseCooldown = Math.max(0, state.pulseCooldown - 1.4);
      burst(crystal.x, crystal.y, "#59d1ff", 24);
      return false;
    }
    return true;
  });

  state.shards = state.shards.filter((shard) => {
    const offscreen = shard.x < -90 || shard.x > world.width + 90 || shard.y > world.height + 90;
    if (offscreen) return false;
    if (distance(player, shard) < player.r + shard.r) {
      state.focus -= 19;
      state.combo = 1;
      state.shake = 8;
      burst(shard.x, shard.y, "#ff6b54", 26);
      return false;
    }
    return true;
  });
}

function pulse() {
  if (!state.running || state.pulseCooldown > 0) return;
  const player = state.player;
  let cleared = 0;
  state.shards = state.shards.filter((shard) => {
    if (distance(player, shard) < 150) {
      cleared += 1;
      burst(shard.x, shard.y, "#9bedff", 12);
      return false;
    }
    return true;
  });
  state.score += cleared * 55;
  state.pulseCooldown = 4.5;
  state.shake = 5;
  burst(player.x, player.y, "#9bedff", 28);
}

function draw() {
  if (activeGame === "capybara") {
    drawCapybara();
    return;
  }
  ctx.save();
  if (state.shake > 0) {
    ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
  }

  drawBackground();
  for (const item of state.items) drawPearl(item);
  for (const crystal of state.crystals) drawCrystal(crystal);
  for (const shard of state.shards) drawShard(shard);
  drawPlayer(state.player);
  drawPulseRing();
  drawBursts();
  ctx.restore();

  scoreEl.textContent = Math.round(state.score).toLocaleString();
  coinsEl.textContent = formatCoins(state.score);
  bankEl.textContent = formatCoinValue(profile.coins);
  bankPanelEl.textContent = formatCoinValue(profile.coins);
  levelEl.textContent = getLevel();
  levelPanelEl.textContent = getLevel();
  comboEl.textContent = `x${state.combo}`;
  focusEl.textContent = `${Math.round(state.focus)}%`;
}

function drawCapybara() {
  ctx.save();
  drawCapyBackground();
  for (const splash of capyState.splashes) {
    ctx.globalAlpha = Math.max(0, splash.life / 0.6);
    drawCircle("#bff7ff", 4, splash.x, splash.y);
    ctx.globalAlpha = 1;
  }
  for (const obstacle of capyState.obstacles) drawCapyObstacle(obstacle);
  drawCapy(capyState.capy);
  ctx.restore();

  scoreEl.textContent = Math.round(capyState.score).toLocaleString();
  coinsEl.textContent = "Jump";
  bankEl.textContent = capyState.best.toLocaleString();
  levelEl.textContent = Math.max(1, Math.floor(capyState.score / 500) + 1);
  comboEl.textContent = `${Math.round(capyState.speed)}`;
  focusEl.textContent = capyState.running ? "Go" : "Ready";
}

function drawCapyBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, world.height);
  sky.addColorStop(0, "#82d7ff");
  sky.addColorStop(0.58, "#f9d99a");
  sky.addColorStop(1, "#6bbf73");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 180 - capyState.cloudOffset) % (world.width + 180)) - 90;
    ctx.beginPath();
    ctx.ellipse(x, 92 + (i % 3) * 30, 52, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 38, 86 + (i % 2) * 18, 38, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#58a65e";
  ctx.fillRect(0, 505, world.width, 135);
  ctx.fillStyle = "#3c8c54";
  for (let x = -40; x < world.width + 80; x += 70) {
    ctx.beginPath();
    ctx.ellipse(x - (capyState.cloudOffset * 2) % 70, 510, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#4cc1d9";
  ctx.fillRect(0, 532, world.width, 60);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  for (let x = 0; x < world.width; x += 90) {
    ctx.fillRect((x - capyState.cloudOffset * 3) % world.width, 556, 42, 4);
  }
}

function drawCapy(capy) {
  ctx.save();
  ctx.translate(capy.x, capy.y);
  ctx.rotate(Math.sin(performance.now() / 130) * (capy.grounded ? 0.02 : 0.08));
  
  const time = performance.now();
  const isDucking = capy.ducking && capy.grounded;
  
  if (isDucking) {
    ctx.scale(1, 0.75);
    ctx.translate(0, 10);
  }
  
  drawCapyShadow(capy, isDucking);
  drawCapyLegs(capy, time, isDucking);
  drawCapyBody(capy, time, isDucking);
  drawCapyHead(capy, time, isDucking);
  drawCapyFace(capy, time, isDucking);
  
  ctx.restore();
}

function drawCapyShadow(capy, isDucking) {
  const scale = isDucking ? 1.1 : 1;
  const shadowScale = capy.grounded ? 1 : Math.max(0.3, 1 - (462 - capy.y) / 200) * scale;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 40, 40 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCapyLegs(capy, time, isDucking) {
  ctx.save();
  
  const legOffset = Math.sin(time / 130) * 6;
  const baseH = isDucking ? 12 : 18;
  const positions = capy.grounded 
    ? [-22 + legOffset, -8 - legOffset, 8 - legOffset, 20 + legOffset]
    : [-16, -16, 13, 13];
  
  for (let i = 0; i < 4; i++) {
    const x = positions[i];
    const legH = baseH;
    
    ctx.fillStyle = i % 2 === 0 ? "#8B6F47" : "#7A5F3A";
    ctx.strokeStyle = "#4A3728";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(x - 4, 18, 8, legH, 3);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = "#5A4738";
    ctx.beginPath();
    ctx.roundRect(x - 5, 34, 10, 5, 2);
    ctx.fill();
    
    ctx.strokeStyle = "#3A2A1F";
    ctx.lineWidth = 1;
    const toes = i < 2 ? 3 : 4;
    for (let t = 0; t < toes; t++) {
      const tx = x - 3 + t * 3;
      ctx.beginPath();
      ctx.moveTo(tx, 36);
      ctx.lineTo(tx, 40);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawCapyBody(capy, time, isDucking) {
  const bodyWidth = 52;
  const bodyHeight = isDucking ? 22 : 28;
  
  const gradient = ctx.createLinearGradient(0, -bodyHeight, 0, bodyHeight);
  gradient.addColorStop(0, "#C49A6C");
  gradient.addColorStop(0.5, "#A67C52");
  gradient.addColorStop(1, "#8B6F47");
  
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "#4A3728";
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.roundRect(-bodyWidth, -bodyHeight/2 - 4, bodyWidth * 2, bodyHeight + 8, 14);
  ctx.fill();
  ctx.stroke();
  
  ctx.strokeStyle = "#8B6F47";
  ctx.lineWidth = 1.5;
  const furLines = 8;
  for (let i = 0; i < furLines; i++) {
    const x = -bodyWidth + 12 + i * ((bodyWidth * 2 - 24) / (furLines - 1));
    const sway = Math.sin(time / 300 + i) * 1;
    ctx.beginPath();
    ctx.moveTo(x, -bodyHeight/2);
    ctx.lineTo(x + sway, -bodyHeight/2 + 10);
    ctx.stroke();
  }
}

function drawCapyHead(capy, time, isDucking) {
  const headX = 48;
  const headY = isDucking ? -18 : -22;
  const headWidth = 36;
  const headHeight = isDucking ? 24 : 28;
  
  const gradient = ctx.createLinearGradient(headX - headWidth, headY - headHeight, headX + headWidth, headY + headHeight);
  gradient.addColorStop(0, "#C49A6C");
  gradient.addColorStop(0.5, "#A67C52");
  gradient.addColorStop(1, "#8B6F47");
  
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "#4A3728";
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.roundRect(headX - headWidth, headY - headHeight, headWidth * 2, headHeight * 2, 10);
  ctx.fill();
  ctx.stroke();
}

function drawCapyFace(capy, time, isDucking) {
  const headX = 48;
  const headY = isDucking ? -18 : -22;
  
  const blink = Math.sin(time / 4000) > 0.97;
  
  drawCapyEars(headX, headY);
  drawCapyEyes(headX, headY, blink);
  drawCapySnout(headX, headY, time);
  drawCapyNose(headX, headY, time);
  drawCapyWhiskers(headX, headY, time);
}

function drawCapyEars(headX, headY) {
  ctx.fillStyle = "#8B6F47";
  ctx.strokeStyle = "#4A3728";
  ctx.lineWidth = 1.5;
  
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(headX + side * 14, headY - 24);
    ctx.rotate(side * 0.1);
    
    ctx.beginPath();
    ctx.roundRect(-5, -8, 10, 12, 3);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = "#A67C52";
    ctx.beginPath();
    ctx.roundRect(-3, -5, 6, 7, 2);
    ctx.fill();
    
    ctx.restore();
  }
}

function drawCapyEyes(headX, headY, blink) {
  const eyeY = headY - 8;
  
  for (let side = -1; side <= 1; side += 2) {
    const eyeX = headX + side * 10;
    
    if (blink) {
      ctx.strokeStyle = "#4A3728";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eyeX - 4, eyeY);
      ctx.lineTo(eyeX + 4, eyeY);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#2D1F14";
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 4, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(eyeX + 1.5, eyeY - 1, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawCapySnout(headX, headY, time) {
  ctx.fillStyle = "#B89068";
  ctx.strokeStyle = "#4A3728";
  ctx.lineWidth = 2;
  
  const twitch = Math.sin(time / 200) * 0.5;
  
  ctx.beginPath();
  ctx.roundRect(headX + 24, headY - 12 + twitch, 28, 20, 8);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "#A67C52";
  ctx.beginPath();
  ctx.roundRect(headX + 26, headY - 8 + twitch, 22, 12, 6);
  ctx.fill();
  
  ctx.strokeStyle = "#8B6F47";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(headX + 36, headY - 4 + twitch);
  ctx.lineTo(headX + 36, headY + 8 + twitch);
  ctx.stroke();
}

function drawCapyNose(headX, headY, time) {
  const twitch = Math.sin(time / 200) * 0.5;
  
  ctx.fillStyle = "#3D2817";
  ctx.beginPath();
  ctx.ellipse(headX + 50, headY - 10 + twitch, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.ellipse(headX + 48, headY - 11 + twitch, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "#3D2817";
  ctx.beginPath();
  ctx.arc(headX + 47, headY - 9 + twitch, 1.5, 0, Math.PI * 2);
  ctx.arc(headX + 53, headY - 9 + twitch, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCapyWhiskers(headX, headY, time) {
  ctx.strokeStyle = "#4A3728";
  ctx.lineWidth = 1;
  
  const wiggle = Math.sin(time / 400) * 1.5;
  const twitch = Math.sin(time / 200) * 0.5;
  
  for (let side = -1; side <= 1; side += 2) {
    const startX = headX + 48 + side * 2;
    const startY = headY - 4 + twitch;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i - 1.5) * 0.15;
      ctx.beginPath();
      ctx.moveTo(startX, startY + i * 4);
      ctx.lineTo(
        startX + side * (14 + i * 3),
        startY + i * 4 + Math.sin(time / 250 + i) * 1.5 + wiggle
      );
      ctx.stroke();
    }
  }
}

function drawCapyObstacle(obstacle) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  if (obstacle.kind === "cactus") {
    ctx.fillStyle = "#247a4a";
    roundRect(-14, -obstacle.h, 28, obstacle.h, 12);
    ctx.fill();
    roundRect(8, -58, 25, 18, 8);
    ctx.fill();
    roundRect(-32, -48, 25, 18, 8);
    ctx.fill();
  } else if (obstacle.kind === "log") {
    ctx.fillStyle = "#88512f";
    roundRect(-38, -34, 76, 34, 17);
    ctx.fill();
    ctx.strokeStyle = "#5d321f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(24, -17, 10, 0, Math.PI * 2);
    ctx.stroke();
  } else if (obstacle.kind === "rock") {
    ctx.fillStyle = "#6c7380";
    ctx.beginPath();
    ctx.moveTo(-28, 0);
    ctx.lineTo(-12, -43);
    ctx.lineTo(21, -37);
    ctx.lineTo(31, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = "#f4f0d8";
    ctx.beginPath();
    ctx.ellipse(0, -18 + Math.sin(obstacle.wobble) * 8, 30, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    drawCircle("#101820", 3, 15, -21 + Math.sin(obstacle.wobble) * 8);
  }
  ctx.restore();
}

function getRunCoins(score) {
  return Math.floor(score / 1000) * 0.5;
}

function formatCoins(score) {
  return formatCoinValue(getRunCoins(score));
}

function formatCoinValue(coins) {
  return Number.isInteger(coins) ? String(coins) : coins.toFixed(1);
}

function getLevel() {
  return Math.max(1, Math.min(900, Math.floor((profile.lifetimePoints || 0) / 1000) + 1));
}

function getVisibleLimit() {
  const level = getLevel();
  return Math.round(20 + ((level - 1) / 899) * 980);
}

function loadProfile() {
  const base = {
    coins: 0,
    lifetimePoints: 0,
    world: "moon",
    skin: "blue",
    worlds: ["moon"],
    skins: ["blue"],
  };

  try {
    const saved = JSON.parse(localStorage.getItem(saveKey));
    return {
      ...base,
      ...saved,
      lifetimePoints: saved?.lifetimePoints || 0,
      worlds: Array.from(new Set([...(saved?.worlds || []), "moon"])),
      skins: Array.from(new Set([...(saved?.skins || []), "blue"])),
    };
  } catch {
    return base;
  }
}

function saveProfile() {
  localStorage.setItem(saveKey, JSON.stringify(profile));
}

function owns(type, id) {
  return profile[type].includes(id);
}

function buyOrEquip(type, item) {
  const selectedKey = type === "worlds" ? "world" : "skin";
  if (owns(type, item.id)) {
    profile[selectedKey] = item.id;
  } else if (profile.coins >= item.price) {
    profile.coins -= item.price;
    profile[type].push(item.id);
    profile[selectedKey] = item.id;
    burst(state.player.x, state.player.y, "#ffcf5a", 34);
  }
  saveProfile();
  renderShop();
  draw();
}

function renderShop() {
  renderShopGroup(worldShopEl, worldItems, "worlds", profile.world);
  renderShopGroup(skinShopEl, skinItems, "skins", profile.skin);
  bankEl.textContent = formatCoinValue(profile.coins);
  bankPanelEl.textContent = formatCoinValue(profile.coins);
  levelEl.textContent = getLevel();
  levelPanelEl.textContent = getLevel();
}

function renderShopGroup(container, items, type, selectedId) {
  const unlocked = items.filter((item) => item.level <= getLevel()).slice(0, Math.ceil(getVisibleLimit() / 2));
  const maxPage = Math.max(0, Math.ceil(unlocked.length / pageSize) - 1);
  shopPages[type] = Math.min(shopPages[type], maxPage);
  const page = shopPages[type];
  const pageItems = unlocked.slice(page * pageSize, page * pageSize + pageSize);
  const countEl = type === "worlds" ? worldCountEl : skinCountEl;
  const pageEl = type === "worlds" ? worldPageEl : skinPageEl;
  const prevButton = type === "worlds" ? worldPrevButton : skinPrevButton;
  const nextButton = type === "worlds" ? worldNextButton : skinNextButton;

  countEl.textContent = `${unlocked.length} / ${items.length}`;
  pageEl.textContent = `${page + 1} / ${maxPage + 1}`;
  prevButton.disabled = page <= 0;
  nextButton.disabled = page >= maxPage;
  prevButton.onclick = () => {
    shopPages[type] = Math.max(0, shopPages[type] - 1);
    renderShop();
  };
  nextButton.onclick = () => {
    shopPages[type] = Math.min(maxPage, shopPages[type] + 1);
    renderShop();
  };

  container.replaceChildren(
    ...pageItems.map((item) => {
      const row = document.createElement("div");
      const owned = owns(type, item.id);
      const equipped = selectedId === item.id;
      const canBuy = profile.coins >= item.price;
      row.className = "shop-item";

      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = item.swatch;

      const text = document.createElement("span");
      text.innerHTML = `<b>${item.name}</b><small>${item.note} - ${formatCoinValue(item.price)} coins</small>`;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = equipped ? "On" : owned ? "Equip" : "Buy";
      button.disabled = equipped || (!owned && !canBuy);
      button.className = equipped ? "equipped" : !owned && canBuy ? "can-buy" : "";
      button.addEventListener("click", () => buyOrEquip(type, item));

      row.append(swatch, text, button);
      return row;
    }),
  );
}

function switchGame(game) {
  activeGame = game;
  pointerTarget = null;
  overlay.classList.remove("hidden");
  startButton.textContent = "Start";
  for (const button of gameTabButtons) {
    button.classList.toggle("active", button.dataset.game === game);
  }

  if (game === "capybara") {
    capyState.running = false;
    scoreLabelEl.textContent = "Score";
    coinsLabelEl.textContent = "Move";
    bankLabelEl.textContent = "Best";
    levelLabelEl.textContent = "Level";
    comboLabelEl.textContent = "Speed";
    focusLabelEl.textContent = "State";
    overlay.querySelector("h1").textContent = "Capybara Run";
    overlay.querySelector("p").textContent = "Tap to hop or swipe up. Hold bottom to duck. Swipe down to duck.";
    panelEyebrowEl.textContent = "Obstacle sprint";
    panelTitleEl.textContent = "Keep the capybara cruising.";
    panelCopyEl.textContent = "Tap or swipe up to jump. Swipe down to duck. Collect coins and dodge obstacles!";
    shopEl.classList.add("hidden");
  } else {
    state.running = false;
    scoreLabelEl.textContent = "Score";
    coinsLabelEl.textContent = "Run Coins";
    bankLabelEl.textContent = "Total Coins";
    levelLabelEl.textContent = "Level";
    comboLabelEl.textContent = "Combo";
    focusLabelEl.textContent = "Focus";
    overlay.querySelector("h1").textContent = "Moonwake";
    overlay.querySelector("p").textContent = "Catch moon pearls, dodge static shards, and ride the neon tide.";
    panelEyebrowEl.textContent = "Arcade reset";
    panelTitleEl.textContent = "Keep the comet awake.";
    panelCopyEl.textContent = "Move fast, chain pearl catches, and grab tide crystals before the current fades.";
    shopEl.classList.remove("hidden");
    renderShop();
  }
  draw();
}

function drawBackground() {
  const theme = getWorldTheme();
  const grad = ctx.createLinearGradient(0, 0, 0, world.height);
  grad.addColorStop(0, theme.skyTop);
  grad.addColorStop(0.5, theme.skyMid);
  grad.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, world.width, world.height);

  drawWorldDetails(theme);

  ctx.strokeStyle = theme.wave;
  ctx.lineWidth = 3;
  for (let row = 0; row < 7; row += 1) {
    const y = 290 + row * 46;
    ctx.beginPath();
    for (let x = -20; x <= world.width + 20; x += 20) {
      const drift = Math.sin((x + state.wave * 70 + row * 41) / 66) * 16;
      if (x === -20) ctx.moveTo(x, y + drift);
      else ctx.lineTo(x, y + drift);
    }
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let x = 0; x < world.width; x += 48) {
    ctx.fillRect(x, 0, 1, world.height);
  }
}

function getWorldTheme() {
  const themes = {
    moon: {
      skyTop: "#081427",
      skyMid: "#133449",
      skyBottom: "#201638",
      wave: "rgba(89, 209, 255, 0.22)",
      glow: "#ffcf5a",
    },
    beach: {
      skyTop: "#48c7e0",
      skyMid: "#4f9fd8",
      skyBottom: "#f4c46b",
      wave: "rgba(255, 255, 255, 0.42)",
      glow: "#fff7d7",
    },
    sunset: {
      skyTop: "#3b174a",
      skyMid: "#ff7ba7",
      skyBottom: "#ffd36d",
      wave: "rgba(255, 247, 215, 0.34)",
      glow: "#ff8fb7",
    },
    crystal: {
      skyTop: "#061823",
      skyMid: "#194a66",
      skyBottom: "#4b2e82",
      wave: "rgba(158, 237, 255, 0.34)",
      glow: "#98f3ff",
    },
    rainbow: {
      skyTop: "#170d31",
      skyMid: "#3a2f88",
      skyBottom: "#102c4a",
      wave: "rgba(255, 255, 255, 0.28)",
      glow: "#ffffff",
    },
  };
  const generated = worldItems.find((item) => item.id === profile.world && item.generated);
  if (generated) {
    return {
      skyTop: `hsl(${generated.hue}, 70%, 14%)`,
      skyMid: `hsl(${generated.secondHue}, 62%, 33%)`,
      skyBottom: `hsl(${(generated.hue + 120) % 360}, 58%, 22%)`,
      wave: `hsla(${generated.secondHue}, 95%, 72%, 0.32)`,
      glow: `hsl(${generated.hue}, 92%, 68%)`,
      generated,
    };
  }
  return themes[profile.world] || themes.moon;
}

function drawWorldDetails(theme) {
  if (profile.world === "beach") {
    drawSun(760, 108, 82, "#fff7d7", "#ffd36d");
    ctx.fillStyle = "rgba(255, 211, 109, 0.76)";
    ctx.beginPath();
    ctx.moveTo(0, 555);
    ctx.quadraticCurveTo(280, 500, 520, 548);
    ctx.quadraticCurveTo(730, 592, 960, 536);
    ctx.lineTo(960, 640);
    ctx.lineTo(0, 640);
    ctx.closePath();
    ctx.fill();
  } else if (profile.world === "sunset") {
    drawSun(760, 132, 94, "#fff0b8", "#ff8fb7");
    ctx.fillStyle = "rgba(76, 30, 92, 0.46)";
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.ellipse(130 + i * 150, 180 + (i % 2) * 42, 82, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (profile.world === "crystal") {
    ctx.fillStyle = "rgba(158, 237, 255, 0.2)";
    for (let x = 40; x < world.width; x += 82) {
      ctx.beginPath();
      ctx.moveTo(x, 560);
      ctx.lineTo(x + 28, 350 + (x % 5) * 24);
      ctx.lineTo(x + 62, 560);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(233, 251, 255, 0.34)";
      ctx.stroke();
    }
  } else if (profile.world === "rainbow") {
    for (let i = 0; i < 6; i += 1) {
      ctx.strokeStyle = ["#ff5f8b", "#ffcf5a", "#7cff8a", "#59d1ff", "#a761ff", "#ffffff"][i];
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(480, 540, 360 + i * 28, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    drawStars(90, 0.85);
  } else {
    drawStars(70, 0.78);
    drawSun(770, 102, 92, "#fff7d7", theme.glow);
    if (theme.generated) {
      ctx.fillStyle = `hsla(${theme.generated.secondHue}, 92%, 68%, 0.18)`;
      for (let i = 0; i < 8; i += 1) {
        ctx.beginPath();
        ctx.arc(80 + i * 122, 480 + Math.sin(i + state.wave) * 24, 40 + (i % 3) * 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawSun(x, y, r, core, halo) {
  const sun = ctx.createRadialGradient(x, y, 12, x, y, r);
  sun.addColorStop(0, core);
  sun.addColorStop(0.42, colorWithAlpha(halo, 0.53));
  sun.addColorStop(1, colorWithAlpha(halo, 0));
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colorWithAlpha(halo, 0.53);
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(x, y, 42 + i * 18, 0.4, Math.PI * 1.45);
    ctx.stroke();
  }
}

function colorWithAlpha(color, alpha) {
  if (color.startsWith("#")) {
    return `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }
  if (color.startsWith("hsl(")) {
    return color.replace("hsl(", "hsla(").replace(")", `, ${alpha})`);
  }
  return color;
}

function drawStars(count, alpha) {
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  for (let i = 0; i < count; i += 1) {
    const x = (i * 139 + 37) % world.width;
    const y = (i * 83 + 51) % 260;
    ctx.beginPath();
    ctx.arc(x, y, i % 5 === 0 ? 2.1 : 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer(player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  const tilt = Math.sin(performance.now() / 150) * 0.1;
  ctx.rotate(tilt);
  const tail = ctx.createLinearGradient(-66, 0, 5, 0);
  tail.addColorStop(0, "rgba(89, 209, 255, 0)");
  tail.addColorStop(0.5, getSkinColor("tail"));
  tail.addColorStop(1, getSkinColor("flare"));
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(-68, -18);
  ctx.quadraticCurveTo(-24, -8, 5, -20);
  ctx.quadraticCurveTo(-13, 0, 5, 20);
  ctx.quadraticCurveTo(-28, 9, -68, 18);
  ctx.closePath();
  ctx.fill();
  drawSkinCore();
  ctx.restore();
}

function getSkinColor(part) {
  const skin = profile.skin;
  const generated = skinItems.find((item) => item.id === skin && item.generated);
  if (generated) {
    return part === "tail"
      ? `hsla(${generated.hue}, 95%, 68%, 0.44)`
      : `hsla(${generated.secondHue}, 95%, 68%, 0.92)`;
  }
  const colors = {
    blue: { tail: "rgba(89, 209, 255, 0.38)", flare: "rgba(255, 207, 90, 0.85)" },
    pink: { tail: "rgba(255, 143, 183, 0.42)", flare: "rgba(255, 95, 139, 0.9)" },
    gold: { tail: "rgba(255, 247, 215, 0.42)", flare: "rgba(255, 207, 90, 0.95)" },
    rainbow: { tail: "rgba(89, 209, 255, 0.5)", flare: "rgba(255, 95, 139, 0.95)" },
    cat: { tail: "rgba(255, 207, 90, 0.38)", flare: "rgba(255, 247, 215, 0.92)" },
    galaxy: { tail: "rgba(167, 97, 255, 0.48)", flare: "rgba(89, 209, 255, 0.9)" },
    panda: { tail: "rgba(255, 255, 255, 0.36)", flare: "rgba(16, 24, 32, 0.86)" },
    boba: { tail: "rgba(244, 197, 141, 0.42)", flare: "rgba(107, 59, 37, 0.86)" },
    ufo: { tail: "rgba(152, 243, 255, 0.5)", flare: "rgba(141, 142, 255, 0.92)" },
    strawberry: { tail: "rgba(255, 79, 114, 0.45)", flare: "rgba(88, 211, 107, 0.88)" },
    slime: { tail: "rgba(124, 255, 138, 0.46)", flare: "rgba(89, 209, 255, 0.9)" },
    crown: { tail: "rgba(255, 207, 90, 0.48)", flare: "rgba(167, 97, 255, 0.92)" },
    bee: { tail: "rgba(255, 207, 90, 0.45)", flare: "rgba(16, 24, 32, 0.9)" },
    dragon: { tail: "rgba(57, 217, 138, 0.44)", flare: "rgba(255, 107, 84, 0.92)" },
  };
  return (colors[skin] || colors.blue)[part];
}

function drawSkinCore() {
  const generated = skinItems.find((item) => item.id === profile.skin && item.generated);
  if (generated) {
    drawGeneratedSkin(generated);
  } else if (profile.skin === "rainbow") {
    const hue = (performance.now() / 18) % 360;
    ctx.fillStyle = `hsl(${hue}, 95%, 62%)`;
    ctx.beginPath();
    ctx.arc(0, 0, 29, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsl(${(hue + 90) % 360}, 95%, 72%)`;
    ctx.beginPath();
    ctx.arc(-7, -8, 15, 0, Math.PI * 2);
    ctx.fill();
  } else if (profile.skin === "cat") {
    drawCatSkin();
  } else if (profile.skin === "panda") {
    drawPandaSkin();
  } else if (profile.skin === "boba") {
    drawBobaSkin();
  } else if (profile.skin === "ufo") {
    drawUfoSkin();
  } else if (profile.skin === "strawberry") {
    drawStrawberrySkin();
  } else if (profile.skin === "slime") {
    drawSlimeSkin();
  } else if (profile.skin === "crown") {
    drawCrownSkin();
  } else if (profile.skin === "bee") {
    drawBeeSkin();
  } else if (profile.skin === "dragon") {
    drawDragonSkin();
  } else {
    const palettes = {
      blue: ["#ffffff", "#59d1ff", "#a761ff"],
      pink: ["#fff7fb", "#ff8fb7", "#ff5f8b"],
      gold: ["#ffffff", "#ffcf5a", "#b77922"],
      galaxy: ["#ffffff", "#59d1ff", "#160d36"],
    };
    const palette = palettes[profile.skin] || palettes.blue;
    const core = ctx.createRadialGradient(-6, -8, 4, 0, 0, 30);
    core.addColorStop(0, palette[0]);
    core.addColorStop(0.45, palette[1]);
    core.addColorStop(1, palette[2]);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();
    if (profile.skin === "galaxy") {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.arc(-15 + i * 6, -12 + ((i * 7) % 22), 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 29, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGeneratedSkin(item) {
  const hue = (item.hue + performance.now() / 140) % 360;
  const primary = `hsl(${hue}, 95%, 66%)`;
  const secondary = `hsl(${item.secondHue}, 88%, 42%)`;

  if (item.shape === "panda") drawPandaSkin(primary);
  else if (item.shape === "boba") drawBobaSkin(primary, secondary);
  else if (item.shape === "ufo") drawUfoSkin(primary, secondary);
  else if (item.shape === "berry") drawStrawberrySkin(primary, secondary);
  else if (item.shape === "slime") drawSlimeSkin(primary, secondary);
  else if (item.shape === "crown") drawCrownSkin(primary, secondary);
  else if (item.shape === "bee") drawBeeSkin(primary, secondary);
  else if (item.shape === "dragon") drawDragonSkin(primary, secondary);
  else if (item.shape === "ghost") drawGhostSkin(primary, secondary);
  else drawPlanetSkin(primary, secondary);

  if (item.id.endsWith("0")) {
    ctx.strokeStyle = `hsla(${item.secondHue}, 95%, 75%, 0.7)`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawCatSkin() {
  drawEars("#16191f");
  drawCircle("#ffcf5a", 28);
  drawEyes("#101820");
  ctx.strokeStyle = "#101820";
  ctx.lineWidth = 2;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 8, 8);
    ctx.lineTo(side * 27, 3);
    ctx.moveTo(side * 8, 13);
    ctx.lineTo(side * 28, 15);
    ctx.stroke();
  }
}

function drawPandaSkin(face = "#ffffff") {
  drawCircle("#101820", 29, -19, -16);
  drawCircle("#101820", 29, 19, -16);
  drawCircle(face, 28);
  drawCircle("#101820", 9, -10, -5);
  drawCircle("#101820", 9, 10, -5);
  drawCircle("#ffffff", 2.7, -8, -7);
  drawCircle("#ffffff", 2.7, 12, -7);
  drawCircle("#101820", 4, 0, 8);
}

function drawBobaSkin(cup = "#f4c58d", tea = "#6b3b25") {
  ctx.fillStyle = cup;
  roundRect(-23, -24, 46, 52, 11);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  roundRect(-18, -17, 36, 16, 8);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(10, -35);
  ctx.lineTo(21, -10);
  ctx.stroke();
  ctx.fillStyle = tea;
  for (let i = 0; i < 5; i += 1) drawCircle(tea, 4, -14 + i * 7, 14 + (i % 2) * 6);
}

function drawUfoSkin(top = "#98f3ff", bottom = "#8d8eff") {
  drawCircle(top, 16, 0, -12);
  ctx.fillStyle = bottom;
  ctx.beginPath();
  ctx.ellipse(0, 5, 35, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff7d7";
  for (let i = -1; i <= 1; i += 1) drawCircle("#fff7d7", 3, i * 13, 5);
}

function drawStrawberrySkin(body = "#ff4f72", leaf = "#58d36b") {
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.bezierCurveTo(-34, 10, -25, -22, 0, -18);
  ctx.bezierCurveTo(25, -22, 34, 10, 0, 30);
  ctx.fill();
  ctx.fillStyle = leaf;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(i * 6, -23, 6, 13, i * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#fff7d7";
  for (let i = 0; i < 9; i += 1) drawCircle("#fff7d7", 1.6, -14 + (i % 3) * 14, -3 + Math.floor(i / 3) * 10);
}

function drawSlimeSkin(body = "#7cff8a", shine = "#59d1ff") {
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-29, 10);
  ctx.quadraticCurveTo(-24, -28, 0, -24);
  ctx.quadraticCurveTo(28, -29, 30, 9);
  ctx.quadraticCurveTo(18, 30, -20, 25);
  ctx.quadraticCurveTo(-34, 22, -29, 10);
  ctx.fill();
  drawCircle(shine, 6, -9, -8);
  drawCircle("#101820", 3, -8, 6);
  drawCircle("#101820", 3, 10, 6);
}

function drawCrownSkin(gold = "#ffcf5a", gem = "#a761ff") {
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(-29, 21);
  ctx.lineTo(-25, -17);
  ctx.lineTo(-10, 1);
  ctx.lineTo(0, -24);
  ctx.lineTo(11, 1);
  ctx.lineTo(27, -17);
  ctx.lineTo(29, 21);
  ctx.closePath();
  ctx.fill();
  drawCircle(gem, 5, 0, 4);
  drawCircle("#ffffff", 3, -17, 9);
  drawCircle("#ffffff", 3, 17, 9);
}

function drawBeeSkin(yellow = "#ffcf5a", dark = "#101820") {
  drawCircle(yellow, 29);
  ctx.fillStyle = dark;
  ctx.fillRect(-22, -9, 44, 8);
  ctx.fillRect(-19, 8, 38, 8);
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.beginPath();
  ctx.ellipse(-17, -25, 14, 9, -0.4, 0, Math.PI * 2);
  ctx.ellipse(17, -25, 14, 9, 0.4, 0, Math.PI * 2);
  ctx.fill();
  drawEyes(dark);
}

function drawDragonSkin(body = "#39d98a", ember = "#ff6b54") {
  drawEars(ember, 33);
  drawCircle(body, 28);
  ctx.fillStyle = "#fff7d7";
  ctx.beginPath();
  ctx.moveTo(-7, -22);
  ctx.lineTo(0, -36);
  ctx.lineTo(7, -22);
  ctx.fill();
  drawEyes("#101820");
  drawCircle(ember, 4, -14, 10);
  drawCircle(ember, 4, 14, 10);
}

function drawGhostSkin(body = "#ffffff", shade = "#a761ff") {
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-27, 25);
  ctx.lineTo(-27, -4);
  ctx.quadraticCurveTo(-25, -28, 0, -29);
  ctx.quadraticCurveTo(25, -28, 27, -4);
  ctx.lineTo(27, 25);
  ctx.lineTo(15, 16);
  ctx.lineTo(5, 25);
  ctx.lineTo(-5, 16);
  ctx.lineTo(-15, 25);
  ctx.closePath();
  ctx.fill();
  drawEyes(shade);
}

function drawPlanetSkin(primary = "#59d1ff", ring = "#ffcf5a") {
  drawCircle(primary, 27);
  ctx.strokeStyle = ring;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 2, 40, 13, -0.25, 0, Math.PI * 2);
  ctx.stroke();
  drawCircle("rgba(255,255,255,0.6)", 6, -8, -8);
}

function drawEars(color, height = 37) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-21, -15);
  ctx.lineTo(-28, -height);
  ctx.lineTo(-8, -24);
  ctx.lineTo(8, -24);
  ctx.lineTo(28, -height);
  ctx.lineTo(21, -15);
  ctx.closePath();
  ctx.fill();
}

function drawEyes(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-9, -4, 4, 0, Math.PI * 2);
  ctx.arc(9, -4, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawCircle(color, r, x = 0, y = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawPearl(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rot);
  ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  const grad = ctx.createRadialGradient(-8, -9, 3, 0, 0, 26);
  grad.addColorStop(0, "#fff7d7");
  grad.addColorStop(0.52, "#ffcf5a");
  grad.addColorStop(1, "#a761ff");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  if (item.kind === "nova") {
    ctx.fillStyle = "#ff5f8b";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawShard(shard) {
  ctx.save();
  ctx.translate(shard.x, shard.y);
  ctx.rotate(shard.rot || shard.spin);
  ctx.fillStyle = "#ff6b54";
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const r = i % 2 === 0 ? shard.r : shard.r * 0.42;
    const a = (i / 8) * Math.PI * 2;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffe083";
  ctx.beginPath();
  ctx.arc(0, 0, shard.r * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCrystal(crystal) {
  ctx.save();
  ctx.translate(crystal.x, crystal.y + Math.sin(crystal.wobble) * 4);
  ctx.rotate(Math.sin(crystal.wobble) * 0.25);
  ctx.fillStyle = "rgba(158, 237, 255, 0.96)";
  roundRect(-20, -20, 40, 40, 8);
  ctx.fill();
  ctx.strokeStyle = "#e9fbff";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function drawPulseRing() {
  if (state.pulseCooldown <= 0 || !state.running) return;
  const p = state.player;
  const progress = 1 - state.pulseCooldown / 4.5;
  ctx.strokeStyle = `rgba(155, 237, 255, ${0.35 * progress})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 150 * progress, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBursts() {
  for (const bit of state.bursts) {
    ctx.globalAlpha = Math.max(0, bit.life / bit.max);
    ctx.fillStyle = bit.color;
    ctx.beginPath();
    ctx.arc(bit.x, bit.y, bit.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * view.ratio;
  const y = (event.clientY - rect.top) * view.ratio;
  return {
    x: clamp((x - view.offsetX) / view.scale, 0, world.width),
    y: clamp((y - view.offsetY) / view.scale, 0, world.height),
  };
}

function handleTouchStart(event) {
  const rect = canvas.getBoundingClientRect();
  touchState.startX = event.touches[0].clientX - rect.left;
  touchState.startY = event.touches[0].clientY - rect.top;
  touchState.startTime = Date.now();
  touchState.isTouching = true;
}

function handleTouchEnd(event) {
  if (!touchState.isTouching) return;
  
  const rect = canvas.getBoundingClientRect();
  const endX = event.changedTouches[0].clientX - rect.left;
  const endY = event.changedTouches[0].clientY - rect.top;
  const duration = Date.now() - touchState.startTime;
  
  const dx = endX - touchState.startX;
  const dy = endY - touchState.startY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  
  touchState.isTouching = false;
  
  if (duration > 500) return; // Ignore holds (more than 500ms)
  if (absDx < 30 && absDy < 30) return; // Ignore taps (less than 30px movement)
  
  if (activeGame === "capybara") {
    if (absDy > absDx * 1.2) { // Mostly vertical swipe
      if (dy < 0) capyJump(); // Swipe up
      else capyDuck(true); // Swipe down
    }
  }
}

function handleTouchMove(event) {
  if (!touchState.isTouching || activeGame !== "moonwake") return;
  const rect = canvas.getBoundingClientRect();
  const currentX = event.touches[0].clientX - rect.left;
  const currentY = event.touches[0].clientY - rect.top;
  pointerTarget = pointerPosition(event);
}

function handleTouchCancel() {
  touchState.isTouching = false;
}

function frame(time) {
  const dt = Math.min(0.033, (time - lastTime) / 1000 || 0);
  lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === " ") {
    event.preventDefault();
    if (activeGame === "capybara") capyJump();
    else pulse();
  }
  if (key === "enter" && ((activeGame === "moonwake" && !state.running) || (activeGame === "capybara" && !capyState.running))) {
    startGame();
  }
});
canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  // Don't jump if it's a swipe - swipe is handled by touchend
  if (activeGame === "capybara" && !touchState.isTouching) {
    capyJump();
  } else if (activeGame !== "capybara") {
    pointerTarget = pointerPosition(event);
    pulse();
  }
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => {
  event.preventDefault();
  if (activeGame === "moonwake") pointerTarget = pointerPosition(event);
});
canvas.addEventListener("pointerleave", () => {
  if (!state.running) pointerTarget = null;
});

// Touch swipe support for both games
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchcancel", handleTouchCancel, { passive: false });
startButton.addEventListener("click", startGame);
for (const button of gameTabButtons) {
  button.addEventListener("click", () => switchGame(button.dataset.game));
}

resize();
renderShop();
switchGame("moonwake");
draw();
requestAnimationFrame(frame);
