class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#87CEEB", platform: "#ffddfa", blob: "#ff1673" },
      levelJson.theme ?? {},
    );

    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11;

    this.camLerp = levelJson.camera?.lerp ?? 0.12;

    this.w = levelJson.world?.w ?? 800;
    this.h = levelJson.world?.h ?? 2400;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    this.start = levelJson.start;

    this.door = levelJson.door || { x: 400, y: 200 };

    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );

    this.stars = [];
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: random(0, this.w),
        y: random(0, this.h * 0.25), // top 25% of level
        size: random(1, 3),
      });
    }
  }

  drawSky(camY) {
    /*
  Progress through level:
  0 = bottom (start)
  1 = top (night)
  */
    let progress = constrain(1 - camY / this.h, 0, 1);

    // Colors
    let day = color("#87CEEB"); // light blue
    let sunset = color("#FF8DAA"); // pink/red
    let night = color("#0B1D51"); // dark blue

    let sky;

    /*
  Hold blue longer for calm start
  */
    if (progress < 0.4) {
      sky = day;
    } else if (progress < 0.75) {
      // transition blue → sunset
      let t = map(progress, 0.4, 0.75, 0, 1);
      sky = lerpColor(day, sunset, t);
    } else {
      // transition sunset → night
      let t = map(progress, 0.75, 1, 0, 1);
      sky = lerpColor(sunset, night, t);
    }

    background(sky);

    /*
  Stars appear near the top
  */
    if (progress > 0.75) {
      fill(255);
      noStroke();

      for (const star of this.stars) {
        circle(star.x, star.y, star.size);
      }
    }
  }

  drawWorld(camY) {
    this.drawSky(camY);

    // Platforms
    fill(this.theme.platform);
    noStroke();

    for (const p of this.platforms) {
      rect(p.x, p.y, p.w, p.h);
    }

    // Door (top of level)
    push();
    rectMode(CENTER);
    fill(255, 230, 120);
    stroke(255);
    strokeWeight(2);
    rect(this.door.x, this.door.y, 50, 70, 12);
    pop();
  }
}
