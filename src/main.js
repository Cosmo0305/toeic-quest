(() => {
  const CONFIG = window.TOEIC_GAME_CONFIG;
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: CONFIG.width,
    height: CONFIG.height,
    backgroundColor: "#bce4fa",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1180 },
        debug: false,
      },
    },
    input: {
      activePointers: 3,
    },
    scene: [window.BootScene, window.TitleScene, window.PlatformerScene, window.ResultsScene],
  });

  window.toeicQuestGame = game;
})();
