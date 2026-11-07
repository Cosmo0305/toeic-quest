(() => {
  class TitleScene extends Phaser.Scene {
    constructor() {
      super("title");
    }

    create() {
      this.cameras.main.setBackgroundColor("#bce4fa");
      this.add.image(640, 400, "bg-hills").setDisplaySize(1280, 800).setAlpha(0.84);
      this.add.rectangle(640, 400, 1280, 800, 0x102b45, 0.22);

      const panel = this.add.graphics();
      panel.fillStyle(0xffffff, 0.94);
      panel.fillRoundedRect(92, 74, 1096, 652, 30);
      panel.lineStyle(1, 0xdce8ee, 1);
      panel.strokeRoundedRect(92, 74, 1096, 652, 30);

      this.add.text(156, 130, "TOEIC QUEST  /  VOCABULARY RUN", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "13px",
        fontStyle: "bold",
        color: "#168b83",
        letterSpacing: 2,
      });
      this.add.text(150, 188, "跳進英文任務，\n把答案收進背包。", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "42px",
        fontStyle: "bold",
        color: "#18334f",
        lineSpacing: 12,
      });
      this.add.text(
        158,
        326,
        "跑過平台、躲開蜜蜂，找到句子裡最合適的單字。",
        {
          fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
          fontSize: "17px",
          color: "#708398",
        },
      );

      this.add.image(930, 394, "hero-idle").setScale(1.55);
      this.add.image(933, 567, "tile-grass-mid").setScale(3.2);
      this.add.image(810, 497, "platformer-coin").setDisplaySize(42, 42);
      this.add.text(812, 526, "by", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "16px",
        fontStyle: "bold",
        color: "#18334f",
        backgroundColor: "#ffffff",
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5);
      const bee = this.add.sprite(1067, 350, "enemy-bee").setScale(0.85);
      bee.play("bee-fly");
      this.tweens.add({
        targets: bee,
        x: 1094,
        y: 337,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });

      const startBackground = this.add.graphics();
      startBackground.fillStyle(0x18a99e, 1);
      startBackground.fillRoundedRect(156, 430, 300, 66, 17);
      const startLabel = this.add.text(306, 463, "開始五關任務", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "19px",
        fontStyle: "bold",
        color: "#ffffff",
      }).setOrigin(0.5);
      const startZone = this.add.zone(306, 463, 300, 66).setInteractive({ useHandCursor: true });
      startZone.on("pointerover", () => {
        startBackground.clear();
        startBackground.fillStyle(0x138d85, 1);
        startBackground.fillRoundedRect(156, 430, 300, 66, 17);
        startLabel.setScale(1.03);
      });
      startZone.on("pointerout", () => {
        startBackground.clear();
        startBackground.fillStyle(0x18a99e, 1);
        startBackground.fillRoundedRect(156, 430, 300, 66, 17);
        startLabel.setScale(1);
      });
      startZone.on("pointerdown", () => this.startGame());
      this.input.keyboard.once("keydown-ENTER", () => this.startGame());

      this.add.text(158, 527, "答對 +10 分　·　答錯 −5 分　·　五關完成後結算", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "13px",
        color: "#71849a",
      });

      const chips = [
        { x: 170, value: "5", label: "STAGES" },
        { x: 418, value: "4", label: "ANSWERS / STAGE" },
        { x: 762, value: "+10", label: "CORRECT" },
      ];
      chips.forEach((chip) => {
        const box = this.add.graphics();
        box.fillStyle(0xf4f8fa, 1);
        box.lineStyle(1, 0xe3ebef, 1);
        box.fillRoundedRect(chip.x, 628, 220, 62, 14);
        box.strokeRoundedRect(chip.x, 628, 220, 62, 14);
        this.add.text(chip.x + 20, 642, chip.value, {
          fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
          fontSize: "21px",
          fontStyle: "bold",
          color: "#18a99e",
        });
        this.add.text(chip.x + 76, 650, chip.label, {
          fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
          fontSize: "10px",
          fontStyle: "bold",
          color: "#8696a6",
          letterSpacing: 1,
        });
      });
      this.add.text(160, 570, "方向鍵 / A D 移動　　Space / ↑ / W 跳躍　　手機可用畫面按鈕", {
        fontFamily: '"DM Sans", "Noto Sans TC", sans-serif',
        fontSize: "12px",
        color: "#8292a3",
      });
    }

    startGame() {
      this.scene.start("gameplay", { stageIndex: 0, score: 0, mistakes: 0 });
    }
  }

  window.TitleScene = TitleScene;
})();
