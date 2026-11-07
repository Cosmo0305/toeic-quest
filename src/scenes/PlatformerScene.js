(() => {
  const CONFIG = window.TOEIC_GAME_CONFIG;
  const STAGES = window.TOEIC_STAGES;
  const COLORS = {
    ink: 0x18334f,
    muted: 0x72859a,
    teal: 0x18a99e,
    tealDark: 0x138d85,
    orange: 0xf2a34b,
    red: 0xd96a66,
    white: 0xffffff,
  };

  class PlatformerScene extends Phaser.Scene {
    constructor() {
      super("gameplay");
    }

    init(data) {
      this.stageIndex = data.stageIndex || 0;
      this.score = data.score || 0;
      this.mistakes = data.mistakes || 0;
      this.state = "play";
      this.touch = { left: false, right: false, jump: false };
      this.enemyHitUntil = 0;
    }

    create() {
      this.stage = STAGES[this.stageIndex];
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        a: Phaser.Input.Keyboard.KeyCodes.A,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        w: Phaser.Input.Keyboard.KeyCodes.W,
      });

      this.physics.world.setBounds(0, 0, CONFIG.worldWidth, CONFIG.height + 120, true, true, false, false);
      this.physics.world.gravity.y = 1180;
      this.cameras.main.setBounds(0, 0, CONFIG.worldWidth, CONFIG.height);
      this.createBackground();
      this.createLevel();
      this.createPlayer();
      this.createAnswers();
      this.createBees();
      this.createHud();
      this.createTouchControls();

      this.physics.add.collider(this.player, this.platforms);
      this.answerTokens.forEach((token) => {
        this.physics.add.overlap(this.player, token.sensor, this.collectAnswer, null, this);
      });
      this.bees.forEach((bee) => {
        this.physics.add.overlap(this.player, bee, this.hitByBee, null, this);
      });
      this.cameras.main.startFollow(
        this.player,
        true,
        CONFIG.cameraFollowLerp,
        0,
      );
    }

    createBackground() {
      this.add.rectangle(640, 400, 1280, 800, this.stage.sky).setScrollFactor(0).setDepth(-30);
      const backgroundKey = "bg-" + this.stage.background;
      for (let index = -1; index < 6; index += 1) {
        this.add.image(index * 650 + 325, 425, backgroundKey)
          .setDisplaySize(730, 411)
          .setScrollFactor(0.16, 0.08)
          .setDepth(-20)
          .setAlpha(0.88);
      }
    }

    createLevel() {
      this.platforms = this.physics.add.staticGroup();
      const theme = this.stage.theme;
      const groundRuns = [
        [0, 512],
        [576, 1152],
        [1216, 1792],
        [1856, CONFIG.worldWidth],
      ];

      groundRuns.forEach(([start, end]) => {
        this.createPlatformRow(start, CONFIG.groundTop, Math.floor((end - start) / 64), theme, true);
      });

      CONFIG.platformStarts.forEach((start, index) => {
        this.createPlatformRow(start, this.stage.platformTops[index], 3, theme, false);
      });
    }

    createPlatformRow(startX, topY, tileCount, theme, isGround) {
      for (let index = 0; index < tileCount; index += 1) {
        let edge = "mid";
        if (index === 0) edge = "left";
        else if (index === tileCount - 1) edge = "right";
        const x = startX + index * 64 + 32;
        const surface = this.platforms.create(x, topY + 16, "tile-" + theme + "-" + edge);
        surface.setDepth(3).refreshBody();

        if (isGround) {
          for (let row = 0; row < 2; row += 1) {
            const fill = this.platforms.create(
              x,
              topY + 64 + row * 64,
              "tile-" + theme + "-block",
            );
            fill.setDepth(2).refreshBody();
          }
        }
      }
    }

    createPlayer() {
      this.player = this.physics.add.sprite(116, 594, "hero-idle");
      this.player.setScale(0.56);
      this.player.body.setSize(76, 100, true);
      this.player.setCollideWorldBounds(true);
      this.player.setDragX(950);
      this.player.setMaxVelocity(330, 760);
      this.player.setDepth(8);
      this.player.setData("invulnerable", false);
    }

    createAnswers() {
      const shuffled = Phaser.Utils.Array.Shuffle(
        this.stage.answers.map((answer) => ({ word: answer.word, correct: answer.correct })),
      );
      this.answerTokens = [];
      shuffled.forEach((answer, index) => {
        const x = CONFIG.answerXs[index];
        const topY = this.stage.platformTops[index];
        const y = topY - 54;
        const container = this.add.container(x, y);
        const coinShadow = this.add.ellipse(0, -25, 52, 16, 0x17364d, 0.15);
        const coin = this.add.image(0, -30, "platformer-coin").setDisplaySize(42, 42);
        const plate = this.add.graphics();
        plate.fillStyle(0x18334f, 0.94);
        plate.fillRoundedRect(-84, 3, 168, 42, 13);
        plate.lineStyle(1, 0xffffff, 0.84);
        plate.strokeRoundedRect(-84, 3, 168, 42, 13);
        const jewel = this.add.image(-65, 24, "kenney-jewel-yellow").setDisplaySize(21, 21);
        const letter = this.add.text(-48, 24, String.fromCharCode(65 + index), {
          fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
          fontSize: "10px",
          fontStyle: "bold",
          color: "#f8c36e",
        }).setOrigin(0.5);
        const fontSize = answer.word.length > 12 ? 13 : answer.word.length > 9 ? 14 : 16;
        const word = this.add.text(-34, 24, answer.word, {
          fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
          fontSize: fontSize + "px",
          fontStyle: "bold",
          color: "#ffffff",
        }).setOrigin(0, 0.5);
        container.add([coinShadow, coin, plate, jewel, letter, word]);
        container.setSize(168, 104);
        container.setDepth(6);
        const sensor = this.add.rectangle(x, y, 168, 104, 0xffffff, 0).setVisible(false);
        this.physics.add.existing(sensor);
        sensor.body.setSize(168, 104, true);
        sensor.body.setAllowGravity(false);
        sensor.body.setImmovable(true);
        sensor.setData("answer", answer);
        sensor.setData("visual", container);
        sensor.setData("collected", false);

        this.tweens.add({
          targets: [container, sensor],
          y: y - 8,
          duration: 850 + index * 110,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut",
        });

        this.answerTokens.push({ container, sensor, answer });
      });
    }

    createBees() {
      this.bees = [];
      const patrols = [
        { x: 590, y: 578, endX: 705, duration: 1800 },
        { x: 1640, y: 565, endX: 1760, duration: 2100 },
      ];
      patrols.forEach((patrol) => {
        const bee = this.physics.add.sprite(patrol.x, patrol.y, "enemy-bee");
        bee.setScale(0.72);
        bee.body.setSize(50, 42, true);
        bee.body.setAllowGravity(false);
        bee.body.setImmovable(true);
        bee.setDepth(5);
        bee.play("bee-fly");
        this.tweens.add({
          targets: bee,
          x: patrol.endX,
          duration: patrol.duration,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut",
          onYoyo: () => bee.setFlipX(true),
          onRepeat: () => bee.setFlipX(false),
        });
        this.bees.push(bee);
      });
    }

    createHud() {
      const top = this.add.rectangle(640, 78, 1280, 156, 0xf9fbfd, 0.97);
      top.setScrollFactor(0).setDepth(100);
      const divider = this.add.rectangle(640, 157, 1280, 2, 0xdfe8ee);
      divider.setScrollFactor(0).setDepth(101);
      this.addUiText(28, 15, "TOEIC QUEST", 15, COLORS.ink, "800", { letterSpacing: 1.2 });
      this.addUiText(28, 37, "PLATFORMER VOCAB RUN", 9, COLORS.muted, "800", { letterSpacing: 1.25 });

      this.addUiText(
        440,
        18,
        "STAGE  " + String(this.stageIndex + 1).padStart(2, "0") + "  /  05",
        11,
        COLORS.ink,
        "800",
        { letterSpacing: 1 },
      );
      for (let index = 0; index < STAGES.length; index += 1) {
        const bar = this.add.rectangle(
          444 + index * 48,
          43,
          38,
          5,
          index <= this.stageIndex ? COLORS.teal : 0xdce5eb,
        );
        bar.setScrollFactor(0).setDepth(102);
      }

      const scorePanel = this.add.graphics();
      scorePanel.fillStyle(0xffffff, 1);
      scorePanel.lineStyle(1, 0xe1e9ee, 1);
      scorePanel.fillRoundedRect(1048, 12, 202, 47, 14);
      scorePanel.strokeRoundedRect(1048, 12, 202, 47, 14);
      scorePanel.setScrollFactor(0).setDepth(101);
      const jewel = this.add.image(1071, 36, "kenney-jewel-yellow").setDisplaySize(23, 23);
      jewel.setScrollFactor(0).setDepth(102);
      this.addUiText(1090, 18, "SCORE", 8, COLORS.muted, "800", { letterSpacing: 1 });
      this.scoreText = this.addUiText(1090, 33, String(this.score), 17, COLORS.ink, "800");
      this.addUiText(1200, 36, "PTS", 8, COLORS.muted, "800").setOrigin(1, 0.5);
      this.mistakeText = this.addUiText(
        1246,
        68,
        "錯誤 " + this.mistakes,
        10,
        COLORS.red,
        "700",
      ).setOrigin(1, 0.5);

      const area = this.addUiText(30, 66, this.stage.area, 10, COLORS.tealDark, "800", {
        letterSpacing: 1.2,
      });
      const sentenceSize = this.stage.sentence.length > 68 ? 18 : this.stage.sentence.length > 58 ? 20 : 22;
      this.sentenceText = this.addUiText(30, 85, this.stage.sentence, sentenceSize, COLORS.ink, "800", {
        wordWrap: { width: 1100 },
      });
      this.addUiText(30, 126, this.stage.translation, 12, COLORS.muted, "500");
      this.addUiText(1246, 138, "4 個答案 · 答對 +10 · 答錯 −5", 10, 0x8797a6, "700")
        .setOrigin(1, 0.5);
      area.setDepth(102);
    }

    addUiText(x, y, value, size, color, weight, extra = {}) {
      const text = this.add.text(x, y, value, {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: size + "px",
        fontStyle: Number.parseInt(weight, 10) >= 600 ? "bold" : "normal",
        color: "#" + color.toString(16).padStart(6, "0"),
        ...extra,
      });
      text.setScrollFactor(0).setDepth(102);
      return text;
    }

    createTouchControls() {
      const buttons = [
        { name: "left", x: 78, label: "←" },
        { name: "right", x: 160, label: "→" },
        { name: "jump", x: 1200, label: "↑" },
      ];
      buttons.forEach((button) => {
        const circle = this.add.circle(button.x, 740, 34, 0x18334f, 0.18);
        circle.setStrokeStyle(2, 0xffffff, 0.82);
        circle.setScrollFactor(0).setDepth(110);
        const label = this.add.text(button.x, 739, button.label, {
          fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
          fontSize: "24px",
          fontStyle: "bold",
          color: "#ffffff",
        }).setOrigin(0.5);
        label.setScrollFactor(0).setDepth(111);
        const zone = this.add.zone(button.x, 740, 78, 78)
          .setScrollFactor(0)
          .setDepth(112)
          .setInteractive();
        zone.on("pointerdown", () => {
          if (button.name === "jump") this.touch.jump = true;
          else this.touch[button.name] = true;
        });
        zone.on("pointerout", () => {
          if (button.name !== "jump") this.touch[button.name] = false;
        });
      });
      this.input.on("pointerup", () => {
        this.touch.left = false;
        this.touch.right = false;
      });
      this.addUiText(
        640,
        782,
        "方向鍵 / A D 移動　 ·　 Space / ↑ / W 跳躍　 ·　碰到答案卡即可作答",
        10,
        0x687e92,
        "700",
      ).setOrigin(0.5);
    }

    collectAnswer(player, sensor) {
      if (this.state !== "play" || sensor.getData("collected")) return;
      sensor.setData("collected", true);
      if (sensor.body) sensor.body.enable = false;
      const answer = sensor.getData("answer");
      const container = sensor.getData("visual");
      const x = sensor.x;
      const y = sensor.y - 20;
      this.tweens.killTweensOf(sensor);
      this.tweens.killTweensOf(container);
      sensor.destroy();
      container.destroy();

      if (answer.correct) {
        this.score += 10;
        this.scoreText.setText(String(this.score));
        this.showFeedback("答對了！ +10", COLORS.tealDark);
        this.burst(x, y, 0x56d8bd, 20);
        this.state = "transition";
        this.time.delayedCall(900, () => {
          if (this.stageIndex + 1 >= STAGES.length) {
            this.scene.start("results", { score: this.score, mistakes: this.mistakes });
          } else {
            this.scene.start("gameplay", {
              stageIndex: this.stageIndex + 1,
              score: this.score,
              mistakes: this.mistakes,
            });
          }
        });
      } else {
        this.score -= 5;
        this.mistakes += 1;
        this.scoreText.setText(String(this.score));
        this.mistakeText.setText("錯誤 " + this.mistakes);
        this.showFeedback("這個答案不合適　−5", COLORS.red);
        this.burst(x, y, 0xf2a34b, 8);
      }
    }

    hitByBee(player, bee) {
      if (this.state !== "play" || this.time.now < this.enemyHitUntil) return;
      this.enemyHitUntil = this.time.now + 850;
      this.player.setVelocityX(this.player.x < bee.x ? -190 : 190);
      this.player.setVelocityY(-310);
      this.player.setAlpha(0.55);
      this.time.delayedCall(360, () => {
        if (this.player && this.player.active) this.player.setAlpha(1);
      });
      this.showFeedback("躲開蜜蜂！這次不扣分", COLORS.orange);
    }

    showFeedback(message, color) {
      if (this.feedbackBackground) this.feedbackBackground.destroy();
      if (this.feedbackText) this.feedbackText.destroy();
      this.feedbackBackground = this.add.rectangle(640, 183, 330, 44, 0xffffff, 0.94);
      this.feedbackBackground.setStrokeStyle(1, 0xe0e8ee, 1);
      this.feedbackBackground.setScrollFactor(0).setDepth(120);
      this.feedbackText = this.add.text(640, 183, message, {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "14px",
        fontStyle: "bold",
        color: "#" + color.toString(16).padStart(6, "0"),
      }).setOrigin(0.5);
      this.feedbackText.setScrollFactor(0).setDepth(121);
      this.tweens.add({
        targets: [this.feedbackBackground, this.feedbackText],
        alpha: 0,
        delay: 900,
        duration: 250,
        onComplete: () => {
          if (this.feedbackBackground) this.feedbackBackground.destroy();
          if (this.feedbackText) this.feedbackText.destroy();
          this.feedbackBackground = null;
          this.feedbackText = null;
        },
      });
    }

    burst(x, y, tint, quantity) {
      const emitter = this.add.particles(x, y, "particle-magic", {
        speed: { min: 75, max: 190 },
        angle: { min: 0, max: 360 },
        lifespan: 520,
        scale: { start: 0.19, end: 0 },
        alpha: { start: 0.9, end: 0 },
        tint,
        emitting: false,
      });
      emitter.setDepth(12);
      emitter.explode(quantity);
      this.time.delayedCall(650, () => emitter.destroy());
    }

    update() {
      if (this.state !== "play" || !this.player || !this.player.body) return;
      const left = this.cursors.left.isDown || this.keys.a.isDown || this.touch.left;
      const right = this.cursors.right.isDown || this.keys.d.isDown || this.touch.right;
      if (left && !right) {
        this.player.setVelocityX(-285);
        this.player.setFlipX(true);
      } else if (right && !left) {
        this.player.setVelocityX(285);
        this.player.setFlipX(false);
      }

      const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        || Phaser.Input.Keyboard.JustDown(this.cursors.up)
        || Phaser.Input.Keyboard.JustDown(this.keys.w)
        || this.touch.jump;
      this.touch.jump = false;
      if (jumpPressed && (this.player.body.blocked.down || this.player.body.touching.down)) {
        this.player.setVelocityY(-650);
      }

      const onGround = this.player.body.blocked.down || this.player.body.touching.down;
      if (!onGround) {
        if (this.player.texture.key !== "hero-jump") {
          this.player.anims.stop();
          this.player.setTexture("hero-jump");
        }
      } else if (Math.abs(this.player.body.velocity.x) > 35) {
        if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "hero-run") {
          this.player.play("hero-run");
        }
      } else if (this.player.texture.key !== "hero-idle" || this.player.anims.isPlaying) {
        this.player.anims.stop();
        this.player.setTexture("hero-idle");
      }

      if (this.player.y > CONFIG.height + 65) {
        this.player.setPosition(116, 594);
        this.player.setVelocity(0, 0);
        this.cameras.main.setScroll(0, 0);
        this.showFeedback("掉進雲裡了，從起點再出發！", COLORS.orange);
      }
    }
  }

  window.PlatformerScene = PlatformerScene;
})();
