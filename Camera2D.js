class Camera2D {
  constructor(viewW, viewH) {
    this.viewW = viewW;
    this.viewH = viewH;

    this.x = 0;
    this.y = 0;

    this.worldW = 0;
    this.worldH = 0;
  }

  clampToWorld(worldW, worldH) {
    this.worldW = worldW;
    this.worldH = worldH;

    this.x = constrain(this.x, 0, worldW - this.viewW);
    this.y = constrain(this.y, 0, worldH - this.viewH);
  }

  /*
    Vertical emotional follow

    Fast near bottom
    Slow near top
  */
  followVertical(playerY, worldH) {
    /*
    0 = bottom
    1 = top
  */
    let progress = constrain(1 - playerY / worldH, 0, 1);

    /*
    Strong emotional easing curve
    makes slowdown very noticeable
  */
    let ease = pow(progress, 3.2);

    /*
    Bottom = fast
    Top = very slow
  */
    let lerpAmount = lerp(0.26, 0.012, ease);

    let targetY = playerY - this.viewH * 0.55;

    this.y = lerp(this.y, targetY, lerpAmount);
  }

  begin() {
    push();
    translate(-this.x, -this.y);
  }

  end() {
    pop();
  }
}
