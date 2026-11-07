const GAME_WIDTH = 1280;
const GAME_HEIGHT = 800;

const STAGES = [
  {
    area: "OFFICE · DEADLINES",
    sentence: "The application must be received ___ the end of the business day.",
    translation: "申請資料必須在營業日結束前送達。",
    answers: [
      { word: "by", correct: true },
      { word: "during", correct: false },
      { word: "among", correct: false },
      { word: "beneath", correct: false },
    ],
  },
  {
    area: "MEETINGS · SCHEDULES",
    sentence: "Please ___ the quarterly sales meeting to discuss the new targets.",
    translation: "請出席季度業務會議，討論新的業務目標。",
    answers: [
      { word: "attend", correct: true },
      { word: "attendance", correct: false },
      { word: "attendee", correct: false },
      { word: "attention", correct: false },
    ],
  },
  {
    area: "TRAVEL · AIRPORT",
    sentence: "Please present a valid ___ for identity verification at the check-in counter.",
    translation: "請在報到櫃檯出示您的身分證件。",
    answers: [
      { word: "identification", correct: true },
      { word: "itinerary", correct: false },
      { word: "luggage", correct: false },
      { word: "fare", correct: false },
    ],
  },
  {
    area: "HOTEL · GUEST SERVICES",
    sentence: "A late checkout is available ___ 2 P.M., after which a fee applies.",
    translation: "房客可以申請延後退房至下午兩點。",
    answers: [
      { word: "until", correct: true },
      { word: "beside", correct: false },
      { word: "during", correct: false },
      { word: "among", correct: false },
    ],
  },
  {
    area: "FINANCE · EXPENSES",
    sentence: "The company will ___ all travel expenses after receiving receipts.",
    translation: "公司收到收據後，會償還所有差旅費用。",
    answers: [
      { word: "reimburse", correct: true },
      { word: "replace", correct: false },
      { word: "reduce", correct: false },
      { word: "reserve", correct: false },
    ],
  },
];

const COLORS = {
  ink: 0x18334f,
  muted: 0x7f91a4,
  teal: 0x18a99e,
  tealDark: 0x138d85,
  orange: 0xf2a34b,
  red: 0xe56d6d,
  paper: 0xffffff,
  board: 0xeaf2f7,
  line: 0xdce6ee,
};

class QuestScene extends Phaser.Scene {
  constructor() {
    super("quest");
    this.stageIndex = 0;
    this.score = 0;
    this.mistakes = 0;
    this.state = "intro";
    this.pointerTarget = null;
  }

  create() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.input.on("pointerdown", (pointer) => {
      if (this.state === "play" && this.inArena(pointer.x, pointer.y)) {
        this.pointerTarget = { x: pointer.x, y: pointer.y };
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.state === "play" && pointer.isDown && this.inArena(pointer.x, pointer.y)) {
        this.pointerTarget = { x: pointer.x, y: pointer.y };
      }
    });
    this.showIntro();
  }

  inArena(x, y) {
    return x >= 70 && x <= 1210 && y >= 300 && y <= 680;
  }

  clearScene() {
    this.tweens.killAll();
    this.children.removeAll(true);
    this.pointerTarget = null;
  }

  addText(x, y, text, size, color = COLORS.ink, weight = "600", options = {}) {
    return this.add.text(x, y, text, {
      fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
      fontSize: `${size}px`,
      fontStyle: Number.parseInt(weight, 10) >= 600 ? "bold" : "normal",
      color: `#${color.toString(16).padStart(6, "0")}`,
      ...options,
    });
  }

  roundedRect(x, y, width, height, radius, fill, stroke = null, strokeWidth = 1) {
    const shape = this.add.graphics();
    shape.fillStyle(fill, 1);
    shape.fillRoundedRect(x, y, width, height, radius);
    if (stroke !== null) {
      shape.lineStyle(strokeWidth, stroke, 1);
      shape.strokeRoundedRect(x, y, width, height, radius);
    }
    return shape;
  }

  makeRoundRectangle(x, y, width, height, radius, fill, alpha = 1, stroke = null, strokeWidth = 1) {
    const shape = this.add.graphics();
    shape.fillStyle(fill, alpha);
    shape.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    if (stroke !== null) {
      shape.lineStyle(strokeWidth, stroke, 1);
      shape.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    }
    shape.setPosition(x, y);
    return shape;
  }

  showIntro() {
    this.state = "intro";
    this.clearScene();
    this.cameras.main.setBackgroundColor("#f5f8fb");
    const bg = this.add.graphics();
    bg.fillStyle(0xeaf4f5, 1);
    bg.fillCircle(1070, 210, 270);
    bg.fillStyle(0xfcebd7, 0.7);
    bg.fillCircle(235, 690, 220);
    bg.fillStyle(0xf5f8fb, 1);
    bg.fillRoundedRect(105, 55, 1070, 690, 34);
    bg.lineStyle(1, 0xe3ebf0, 1);
    bg.strokeRoundedRect(105, 55, 1070, 690, 34);

    this.addText(170, 130, "TOEIC QUEST", 16, COLORS.tealDark, "800", { letterSpacing: 3 });
    this.addText(164, 198, "把英文單字，\n變成你的闖關技能。", 43, COLORS.ink, "800", { lineSpacing: 12 });
    this.addText(170, 332, "走進五個職場情境，操作角色蒐集正確答案。\n答對 +10 分，答錯 -5 分，完成全部五關！", 18, 0x74869a, "500", { lineSpacing: 12 });

    this.roundedRect(168, 455, 300, 70, 18, COLORS.teal);
    const start = this.addText(318, 490, "開始任務", 20, COLORS.paper, "800").setOrigin(0.5);
    const startButton = this.add.zone(318, 490, 300, 70).setInteractive({ useHandCursor: true });
    startButton.on("pointerover", () => this.tweens.add({ targets: start, scale: 1.04, duration: 100 }));
    startButton.on("pointerout", () => this.tweens.add({ targets: start, scale: 1, duration: 100 }));
    startButton.on("pointerdown", () => this.startGame());
    this.addText(170, 552, "方向鍵 / WASD 移動　 ·　也可點擊場地移動", 13, 0x8293a4, "600");

    const art = this.add.container(850, 395);
    const shadow = this.add.ellipse(0, 155, 330, 44, 0x1c425c, 0.1);
    const track = this.add.graphics();
    track.lineStyle(3, 0xc5e1e1, 1);
    track.strokeCircle(0, 8, 128);
    track.strokeCircle(0, 8, 175);
    const orbit1 = this.add.container(-135, -70, [
      this.add.ellipse(0, 0, 92, 92, 0xffffff),
      this.addText(0, -5, "by", 24, COLORS.tealDark, "800").setOrigin(0.5),
    ]);
    const orbit2 = this.add.container(138, 12, [
      this.add.ellipse(0, 0, 104, 82, 0xffffff),
      this.addText(0, -5, "attend", 14, COLORS.ink, "800").setOrigin(0.5),
    ]);
    const mascot = this.makeHeroArt(0, 5, 1.9);
    art.add([shadow, track, orbit1, orbit2, mascot]);
    this.tweens.add({ targets: orbit1, y: "-=10", duration: 1500, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    this.tweens.add({ targets: orbit2, y: "+=13", duration: 1750, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.roundedRect(755, 621, 255, 64, 15, 0xffffff, 0xe6edf2);
    this.addText(780, 637, "5", 24, COLORS.teal, "800");
    this.addText(812, 640, "STAGES", 11, COLORS.muted, "800", { letterSpacing: 2 });
    this.addText(895, 637, "·", 24, 0xc8d2dc, "600");
    this.addText(923, 637, "50", 24, COLORS.orange, "800");
    this.addText(962, 640, "PTS MAX", 11, COLORS.muted, "800", { letterSpacing: 2 });
  }

  makeHeroArt(x, y, scale = 1) {
    const smile = this.add.graphics();
    smile.lineStyle(2.5, 0xf2a34b, 1);
    smile.beginPath();
    smile.arc(0, -3, 8, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160), false);
    smile.strokePath();
    const parts = [
      this.add.ellipse(0, 28, 70, 20, 0x235474, 0.18),
      this.add.circle(0, 0, 31, 0x18a99e),
      this.makeRoundRectangle(0, 5, 49, 55, 18, 0x18a99e),
      this.makeRoundRectangle(0, -7, 54, 43, 19, 0xffffff),
      this.add.circle(-11, -8, 3.5, 0x18334f),
      this.add.circle(11, -8, 3.5, 0x18334f),
      smile,
      this.makeRoundRectangle(-30, 9, 12, 35, 5, 0xf2a34b),
      this.makeRoundRectangle(-15, 31, 15, 7, 3, 0x168e86),
      this.makeRoundRectangle(15, 31, 15, 7, 3, 0x168e86),
      this.add.circle(27, -23, 7, 0xf2a34b),
    ];
    const hero = this.add.container(x, y, parts);
    hero.setScale(scale);
    return hero;
  }

  startGame() {
    this.stageIndex = 0;
    this.score = 0;
    this.mistakes = 0;
    this.loadStage();
  }

  loadStage() {
    this.state = "play";
    this.clearScene();
    const stage = STAGES[this.stageIndex];
    this.drawHeader(stage);
    this.drawPrompt(stage);
    this.drawArena(stage);
    this.createPickups(stage);
    this.createHero();
    this.drawFooter();
  }

  drawHeader(stage) {
    this.roundedRect(0, 0, GAME_WIDTH, 86, 0, COLORS.paper);
    this.add.rectangle(640, 85, 1280, 1, 0xe5ecf1);
    this.add.circle(57, 42, 18, COLORS.teal);
    this.addText(57, 42, "T", 18, COLORS.paper, "800").setOrigin(0.5);
    this.addText(88, 27, "TOEIC", 17, COLORS.ink, "800", { letterSpacing: 1.5 });
    this.addText(88, 49, "QUEST / VOCABULARY RUN", 9, COLORS.muted, "700", { letterSpacing: 1.3 });

    this.addText(548, 21, `STAGE  ${String(this.stageIndex + 1).padStart(2, "0")} / 05`, 12, COLORS.ink, "800", { letterSpacing: 1 });
    const startX = 548;
    for (let i = 0; i < STAGES.length; i += 1) {
      this.roundedRect(startX + i * 58, 48, 48, 5, 3, i <= this.stageIndex ? COLORS.teal : 0xe5ebef);
    }
    this.roundedRect(1023, 21, 197, 45, 14, 0xf3f7f8);
    this.add.circle(1048, 43, 10, 0xffefda);
    this.addText(1048, 43, "✦", 11, COLORS.orange, "800").setOrigin(0.5);
    this.addText(1067, 31, "SCORE", 8, COLORS.muted, "800", { letterSpacing: 1.1 });
    this.scoreText = this.addText(1067, 44, String(this.score), 16, COLORS.ink, "800");
    this.scoreText.setOrigin(0, 0.5);
    this.addText(1170, 44, "PTS", 9, COLORS.muted, "800").setOrigin(0, 0.5);
  }

  drawPrompt(stage) {
    this.roundedRect(54, 105, 1172, 124, 20, COLORS.paper, 0xe7edf1);
    this.roundedRect(76, 126, 49, 49, 14, 0xe5f5f3);
    this.addText(100.5, 150.5, String(this.stageIndex + 1).padStart(2, "0"), 14, COLORS.tealDark, "800").setOrigin(0.5);
    this.addText(145, 120, stage.area, 10, COLORS.tealDark, "800", { letterSpacing: 1.3 });
    const sentenceFont = stage.sentence.length > 63 ? 20 : stage.sentence.length > 48 ? 22 : 25;
    this.addText(145, 143, stage.sentence, sentenceFont, COLORS.ink, "700");
    this.addText(145, 188, stage.translation, 13, COLORS.muted, "500");
    this.roundedRect(1027, 145, 168, 39, 12, 0xfff7eb);
    this.addText(1111, 164, "蒐集正確答案", 12, 0xa47740, "700").setOrigin(0.5);
  }

  drawArena(stage) {
    this.roundedRect(54, 247, 1172, 454, 24, COLORS.board, 0xe0e9ef);
    const grid = this.add.graphics();
    grid.lineStyle(1, 0xdde8ee, 0.56);
    for (let x = 84; x < 1215; x += 42) grid.lineBetween(x, 304, x, 682);
    for (let y = 306; y < 690; y += 42) grid.lineBetween(70, y, 1210, y);
    this.roundedRect(79, 265, 230, 27, 9, 0xffffff, 0xe4ebef);
    this.add.circle(94, 278.5, 4, COLORS.teal);
    this.addText(106, 272, `ZONE ${String(this.stageIndex + 1).padStart(2, "0")}  ·  ${stage.area.split(" · ")[0]}`, 9, COLORS.muted, "800", { letterSpacing: 0.7 });
    this.addText(1179, 271, "4 ANSWERS  /  1 CORRECT", 9, 0x8799a8, "800", { letterSpacing: 0.8 }).setOrigin(1, 0);
    this.add.ellipse(640, 638, 520, 55, 0xffffff, 0.3);
    this.add.ellipse(640, 629, 360, 24, 0xd6e5e9, 0.5);
  }

  createPickups(stage) {
    const positions = [
      { x: 206, y: 390 },
      { x: 493, y: 548 },
      { x: 787, y: 390 },
      { x: 1074, y: 548 },
    ];
    const shuffled = Phaser.Utils.Array.Shuffle(stage.answers.map((answer) => ({ ...answer })));
    this.pickups = shuffled.map((answer, index) => {
      const { x, y } = positions[index];
      const card = this.add.container(x, y);
      const width = 214;
      card.add(this.makeRoundRectangle(0, 5, width, 80, 17, 0x9eb0bc, 0.12));
      card.add(this.makeRoundRectangle(0, 0, width, 80, 17, COLORS.paper, 1, 0xdce6ed, 1.4));
      card.add(this.makeRoundRectangle(-width / 2 + 4, 0, 5, 54, 3, answer.correct ? COLORS.teal : 0xf2b35d));
      card.add(this.add.circle(-72, 0, 18, answer.correct ? 0xe5f5f2 : 0xfff3e2));
      card.add(this.addText(-72, 0, String.fromCharCode(65 + index), 12, answer.correct ? COLORS.tealDark : 0xb07a39, "800").setOrigin(0.5));
      const fontSize = answer.word.length > 12 ? 14 : answer.word.length > 9 ? 16 : 19;
      card.add(this.addText(-42, 0, answer.word, fontSize, COLORS.ink, "800").setOrigin(0, 0.5));
      card.setSize(width, 80);
      return { container: card, x, y, answer, active: true };
    });
  }

  createHero() {
    this.hero = this.add.container(640, 630);
    this.hero.add(this.add.ellipse(0, 25, 66, 17, 0x32536b, 0.2));
    const body = this.add.container(0, 0);
    this.hero.add(body);
    body.add(this.add.circle(0, 0, 29, 0x0f8f87));
    body.add(this.makeRoundRectangle(0, 4, 47, 53, 17, COLORS.teal));
    body.add(this.makeRoundRectangle(0, -8, 51, 41, 18, 0xffffff));
    body.add(this.add.circle(-10, -8, 3.3, COLORS.ink));
    body.add(this.add.circle(10, -8, 3.3, COLORS.ink));
    const smile = this.add.graphics();
    smile.lineStyle(2, COLORS.orange, 1);
    smile.beginPath();
    smile.arc(0, -4, 8, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160), false);
    smile.strokePath();
    body.add(smile);
    body.add(this.makeRoundRectangle(-28, 7, 11, 32, 5, COLORS.orange));
    body.add(this.makeRoundRectangle(-14, 30, 15, 7, 3, COLORS.tealDark));
    body.add(this.makeRoundRectangle(14, 30, 15, 7, 3, COLORS.tealDark));
    body.add(this.add.circle(26, -22, 6, COLORS.orange));
    this.hero.setDepth(5);
    this.tweens.add({ targets: body, y: -4, duration: 520, yoyo: true, repeat: -1, ease: "Sine.inOut" });
  }

  drawFooter() {
    this.addText(66, 728, "MOVE", 9, COLORS.tealDark, "800", { letterSpacing: 1.4 });
    this.addText(66, 746, "WASD  /  ← ↑ → ↓", 12, COLORS.ink, "700", { letterSpacing: 0.3 });
    this.add.circle(300, 741, 3, 0xc0ccd6);
    this.addText(321, 731, "靠近答案卡片即可蒐集", 12, COLORS.muted, "600");
    this.addText(1214, 731, "答對  +10", 12, COLORS.tealDark, "800").setOrigin(1, 0);
    this.addText(1214, 750, "答錯   −5", 11, 0xc07660, "700").setOrigin(1, 0);
  }

  update(_time, delta) {
    if (this.state !== "play" || !this.hero) return;
    const direction = new Phaser.Math.Vector2(0, 0);
    if (this.keys.left.isDown || this.keys.a.isDown) direction.x -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) direction.x += 1;
    if (this.keys.up.isDown || this.keys.w.isDown) direction.y -= 1;
    if (this.keys.down.isDown || this.keys.s.isDown) direction.y += 1;
    if (this.pointerTarget) {
      const deltaToTarget = new Phaser.Math.Vector2(this.pointerTarget.x - this.hero.x, this.pointerTarget.y - this.hero.y);
      if (deltaToTarget.length() < 12) this.pointerTarget = null;
      else direction.add(deltaToTarget.normalize());
    }
    if (direction.lengthSq() > 0) {
      direction.normalize();
      const distance = 295 * (delta / 1000);
      this.hero.x = Phaser.Math.Clamp(this.hero.x + direction.x * distance, 92, 1188);
      this.hero.y = Phaser.Math.Clamp(this.hero.y + direction.y * distance, 326, 674);
    }
    this.checkPickups();
  }

  checkPickups() {
    const pickup = this.pickups?.find((item) => item.active
      && Math.abs(this.hero.x - item.x) < 106
      && Math.abs(this.hero.y - item.y) < 45);
    if (!pickup) return;
    pickup.active = false;
    if (pickup.answer.correct) {
      this.score += 10;
      this.scoreText.setText(String(this.score));
      this.showFeedback("答對了！ +10", COLORS.tealDark, pickup.x, pickup.y);
      this.state = "transition";
      this.tweens.add({ targets: pickup.container, scale: 1.12, alpha: 0, duration: 280, ease: "Back.in" });
      this.time.delayedCall(850, () => {
        this.stageIndex += 1;
        if (this.stageIndex >= STAGES.length) this.showResults();
        else this.loadStage();
      });
    } else {
      this.score -= 5;
      this.mistakes += 1;
      this.scoreText.setText(String(this.score));
      this.showFeedback("再試試看！ −5", COLORS.red, pickup.x, pickup.y);
      this.tweens.add({ targets: pickup.container, y: pickup.y - 18, alpha: 0, duration: 230, ease: "Quad.out", onComplete: () => pickup.container.destroy() });
    }
  }

  showFeedback(message, color, x, y) {
    const text = this.addText(x, y - 65, message, 16, color, "800").setOrigin(0.5);
    text.setShadow(0, 2, "#ffffff", 8, true, true);
    this.tweens.add({ targets: text, y: y - 100, alpha: 0, duration: 950, ease: "Sine.out", onComplete: () => text.destroy() });
  }

  showResults() {
    this.state = "results";
    this.clearScene();
    this.cameras.main.setBackgroundColor("#f5f8fb");
    const bg = this.add.graphics();
    bg.fillStyle(0xeaf4f5, 1);
    bg.fillCircle(1050, 140, 260);
    bg.fillStyle(0xfcebd7, 0.65);
    bg.fillCircle(220, 700, 240);
    this.roundedRect(210, 74, 860, 654, 30, COLORS.paper, 0xe3ebf0);
    this.add.circle(640, 192, 56, 0xe6f5f2);
    this.addText(640, 192, "✓", 42, COLORS.teal, "800").setOrigin(0.5);
    this.addText(640, 282, "MISSION COMPLETE", 13, COLORS.tealDark, "800", { letterSpacing: 3 }).setOrigin(0.5);
    this.addText(640, 327, "五關全數完成！", 37, COLORS.ink, "800").setOrigin(0.5);
    this.addText(640, 378, "你的英文補給已送達。", 16, COLORS.muted, "500").setOrigin(0.5);

    this.roundedRect(355, 440, 570, 132, 20, 0xf5f8fa, 0xe7edf1);
    this.addText(498, 468, "FINAL SCORE", 10, COLORS.muted, "800", { letterSpacing: 1.6 }).setOrigin(0.5);
    this.addText(498, 520, String(this.score), 43, COLORS.ink, "800").setOrigin(0.5);
    this.addText(498, 552, "POINTS", 9, COLORS.muted, "800", { letterSpacing: 1.6 }).setOrigin(0.5);
    this.add.rectangle(640, 506, 1, 78, 0xdce6ed);
    this.addText(782, 468, "WRONG ANSWERS", 10, COLORS.muted, "800", { letterSpacing: 1.4 }).setOrigin(0.5);
    this.addText(782, 520, String(this.mistakes), 37, this.mistakes ? COLORS.orange : COLORS.teal, "800").setOrigin(0.5);
    this.addText(782, 552, "PICKUPS", 9, COLORS.muted, "800", { letterSpacing: 1.6 }).setOrigin(0.5);

    this.roundedRect(473, 622, 334, 62, 16, COLORS.teal);
    const restart = this.addText(640, 653, "再玩一次", 17, COLORS.paper, "800").setOrigin(0.5);
    const restartButton = this.add.zone(640, 653, 334, 62).setInteractive({ useHandCursor: true });
    restartButton.on("pointerover", () => this.tweens.add({ targets: restart, scale: 1.04, duration: 100 }));
    restartButton.on("pointerout", () => this.tweens.add({ targets: restart, scale: 1, duration: 100 }));
    restartButton.on("pointerdown", () => this.startGame());
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#f5f8fb",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 3,
  },
  scene: [QuestScene],
});
