(() => {
  class ResultsScene extends Phaser.Scene {
    constructor() {
      super("results");
    }

    init(data) {
      this.score = data.score || 0;
      this.mistakes = data.mistakes || 0;
    }

    create() {
      this.add.image(640, 400, "bg-hills").setDisplaySize(1280, 800);
      this.add.rectangle(640, 400, 1280, 800, 0x16334e, 0.25);
      const panel = this.add.graphics();
      panel.fillStyle(0xffffff, 0.96);
      panel.lineStyle(1, 0xe2eaf0, 1);
      panel.fillRoundedRect(236, 84, 808, 632, 28);
      panel.strokeRoundedRect(236, 84, 808, 632, 28);

      this.add.circle(640, 184, 52, 0xe4f5f1);
      this.add.text(640, 184, "✓", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "42px",
        fontStyle: "bold",
        color: "#18a99e",
      }).setOrigin(0.5);
      this.add.text(640, 267, "MISSION COMPLETE", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "13px",
        fontStyle: "bold",
        color: "#138d85",
        letterSpacing: 2.5,
      }).setOrigin(0.5);
      this.add.text(640, 315, "五關全數完成！", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "36px",
        fontStyle: "bold",
        color: "#18334f",
      }).setOrigin(0.5);
      this.add.text(640, 360, "你已經把英文答案送達每個職場任務。", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "15px",
        color: "#74869a",
      }).setOrigin(0.5);

      const stats = this.add.graphics();
      stats.fillStyle(0xf5f8fa, 1);
      stats.lineStyle(1, 0xe6edf1, 1);
      stats.fillRoundedRect(356, 418, 568, 126, 18);
      stats.strokeRoundedRect(356, 418, 568, 126, 18);
      this.add.image(500, 451, "kenney-jewel-yellow").setDisplaySize(22, 22);
      this.add.text(640, 451, "FINAL SCORE", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "10px",
        fontStyle: "bold",
        color: "#8191a0",
        letterSpacing: 1.5,
      }).setOrigin(0.5);
      this.add.text(500, 496, String(this.score), {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "40px",
        fontStyle: "bold",
        color: "#18334f",
      }).setOrigin(0.5);
      this.add.text(500, 525, "POINTS", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "9px",
        fontStyle: "bold",
        color: "#8797a6",
        letterSpacing: 1.4,
      }).setOrigin(0.5);
      this.add.rectangle(640, 484, 1, 72, 0xdce5eb);
      this.add.text(782, 451, "WRONG ANSWERS", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "10px",
        fontStyle: "bold",
        color: "#8191a0",
        letterSpacing: 1.2,
      }).setOrigin(0.5);
      this.add.text(782, 496, String(this.mistakes), {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "36px",
        fontStyle: "bold",
        color: this.mistakes ? "#f2a34b" : "#18a99e",
      }).setOrigin(0.5);
      this.add.text(782, 525, "PICKUPS", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "9px",
        fontStyle: "bold",
        color: "#8797a6",
        letterSpacing: 1.4,
      }).setOrigin(0.5);

      this.addButton(640, 626, "再玩一次", () => {
        this.scene.start("gameplay", { stageIndex: 0, score: 0, mistakes: 0 });
      });
      this.add.text(640, 683, "答對每題 +10 分　·　錯誤答案 −5 分", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "12px",
        color: "#8292a3",
      }).setOrigin(0.5);
    }

    addButton(x, y, label, callback) {
      const background = this.add.graphics();
      background.fillStyle(0x18a99e, 1);
      background.fillRoundedRect(x - 160, y - 30, 320, 60, 15);
      const text = this.add.text(x, y, label, {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "17px",
        fontStyle: "bold",
        color: "#ffffff",
      }).setOrigin(0.5);
      const zone = this.add.zone(x, y, 320, 60).setInteractive({ useHandCursor: true });
      zone.on("pointerover", () => text.setScale(1.04));
      zone.on("pointerout", () => text.setScale(1));
      zone.on("pointerdown", callback);
    }
  }

  window.ResultsScene = ResultsScene;
})();
