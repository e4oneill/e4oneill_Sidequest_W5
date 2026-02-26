const VIEW_W = 800;
const VIEW_H = 480;

let allLevelsData;
let levelIndex = 0;

let level;
let player;
let cam;

function preload() {
  allLevelsData = loadJSON("levels.json");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);

  cam = new Camera2D(width, height);
  loadLevel(levelIndex);
}

function loadLevel(i) {
  level = LevelLoader.fromLevelsJson(allLevelsData, i);

  player = new BlobPlayer();
  player.spawnFromLevel(level);

  cam.x = 0;
  cam.y = player.y - height / 2;
  cam.clampToWorld(level.w, level.h);
}

function draw() {
  player.update(level);

  // death
  if (player.y - player.r > level.deathY) {
    loadLevel(levelIndex);
    return;
  }

  // CAMERA (core emotional mechanic)
  cam.followVertical(player.y, level.h);
  cam.clampToWorld(level.w, level.h);

  cam.begin();
  level.drawWorld(cam.y);
  player.draw(level.theme.blob);
  cam.end();

  // Door detection
  let d = dist(player.x, player.y, level.door.x, level.door.y);
  if (d < 40) {
    loadLevel(levelIndex);
  }
}

/*
Controls:
A/D = move
W or SPACE = jump
*/
function keyPressed() {
  if (key === " " || key === "W" || key === "w") {
    player.tryJump();
  }
}
