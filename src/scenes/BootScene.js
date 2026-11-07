(() => {
  class BootScene extends Phaser.Scene {
    constructor() {
      super("boot");
    }

    preload() {
      const platformer = "assets/kenney/new-platformer-pack/Sprites/";
      const themes = ["grass", "stone", "sand", "dirt", "snow"];

      this.load.image(
        "hero-idle",
        platformer + "Characters/Default/character_green_idle.png",
      );
      this.load.image(
        "hero-walk-a",
        platformer + "Characters/Default/character_green_walk_a.png",
      );
      this.load.image(
        "hero-walk-b",
        platformer + "Characters/Default/character_green_walk_b.png",
      );
      this.load.image(
        "hero-jump",
        platformer + "Characters/Default/character_green_jump.png",
      );
      this.load.image(
        "platformer-coin",
        platformer + "Tiles/Default/coin_gold.png",
      );

      themes.forEach((theme) => {
        this.load.image(
          "tile-" + theme + "-left",
          platformer + "Tiles/Default/terrain_" + theme + "_horizontal_left.png",
        );
        this.load.image(
          "tile-" + theme + "-mid",
          platformer + "Tiles/Default/terrain_" + theme + "_horizontal_middle.png",
        );
        this.load.image(
          "tile-" + theme + "-right",
          platformer + "Tiles/Default/terrain_" + theme + "_horizontal_right.png",
        );
        this.load.image(
          "tile-" + theme + "-block",
          platformer + "Tiles/Default/terrain_" + theme + "_block_center.png",
        );
      });

      ["hills", "trees", "desert", "mushrooms"].forEach((background) => {
        this.load.image(
          "bg-" + background,
          platformer + "Backgrounds/Default/background_color_" + background + ".png",
        );
      });

      this.load.image(
        "kenney-jewel-yellow",
        "assets/kenney/ui-pack-adventure/PNG/Double/minimap_icon_jewel_yellow.png",
      );
      this.load.image(
        "enemy-bee",
        "assets/kenney/platformer-art-extended-enemies/Enemy sprites/bee.png",
      );
      this.load.image(
        "enemy-bee-fly",
        "assets/kenney/platformer-art-extended-enemies/Enemy sprites/bee_fly.png",
      );
      this.load.image(
        "particle-magic",
        "assets/kenney/particle-pack/PNG (Transparent)/magic_01.png",
      );
    }

    create() {
      this.anims.create({
        key: "hero-run",
        frames: [{ key: "hero-walk-a" }, { key: "hero-walk-b" }],
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: "bee-fly",
        frames: [{ key: "enemy-bee" }, { key: "enemy-bee-fly" }],
        frameRate: 7,
        repeat: -1,
      });
      this.scene.start("title");
    }
  }

  window.BootScene = BootScene;
})();
