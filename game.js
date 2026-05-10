const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
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
let pointerTarget = null;
let lastTime = 0;
let profile = loadProfile();
let state = makeState();

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

function resize() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  ctx.setTransform(canvas.width / world.width, 0, 0, canvas.height / world.height, 0, 0);
}

function startGame() {
  profile = loadProfile();
  state = makeState();
  state.running = true;
  overlay.classList.add("hidden");
  renderShop();
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
  return {
    x: ((event.clientX - rect.left) / rect.width) * world.width,
    y: ((event.clientY - rect.top) / rect.height) * world.height,
  };
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
    pulse();
  }
  if (key === "enter" && !state.running) startGame();
});
canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  pointerTarget = pointerPosition(event);
  pulse();
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => {
  event.preventDefault();
  pointerTarget = pointerPosition(event);
});
canvas.addEventListener("pointerleave", () => {
  if (!state.running) pointerTarget = null;
});
startButton.addEventListener("click", startGame);

resize();
renderShop();
draw();
requestAnimationFrame(frame);
