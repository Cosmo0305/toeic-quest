# TOEIC Quest

使用 Phaser 4 製作的多益單字平台冒險。學生操作角色跑跳穿越平台、躲開蜜蜂，並蒐集題目的正確答案。遊戲共五關，每關四個選項；答對加 10 分、答錯扣 5 分。

## 開始遊戲

`index.html` 就是遊戲入口，首頁直接進入遊戲。透過 GitHub Pages 或本機靜態檔案伺服器開啟；部分瀏覽器會限制從 `file://` 載入本機素材。

Phaser 4.2.1 從 jsDelivr 載入，遊玩時需要網路連線。

## 操作方式

- 方向鍵或 A、D 移動角色。
- Space、向上鍵或 W 跳躍。
- 手機可用畫面下方的左右與跳躍按鈕。
- 碰到答案卡即可作答。答錯後卡片會消失，仍可繼續尋找正確答案。
- 蜜蜂會把角色彈開，不會扣分。

## 專案結構

```text
index.html                 首頁與 Phaser 載入入口
src/
  main.js                  Phaser 遊戲設定與場景啟動
  config/game.js            畫面與關卡尺寸設定
  data/stages.js            五道 TOEIC 情境題與關卡主題
  scenes/
    BootScene.js            載入素材與建立動畫
    TitleScene.js           開始畫面
    PlatformerScene.js      平台玩法、答案蒐集、計分與 HUD
    ResultsScene.js         五關結算畫面
  styles/main.css           頁面樣式
assets/
  kenney/
    new-platformer-pack/               角色、平台、地形與背景素材
    platformer-art-extended-enemies/   蜜蜂敵人素材
    particle-pack/                      答對或答錯的粒子效果
    ui-pack-adventure/                  寶石 HUD 圖示
```

## Kenney 素材

遊戲使用以下 Kenney 素材包，素材包內保留各自的授權檔：

- [New Platformer Pack](https://kenney.nl/assets/new-platformer-pack)
- [Platformer Art Extended Enemies](https://kenney.nl/assets/platformer-art-extended-enemies)
- [Particle Pack](https://kenney.nl/assets/particle-pack)
- [UI Pack - Adventure](https://kenney.nl/assets/ui-pack-adventure)

以上素材包採 CC0 授權。素材載入路徑位於 `src/scenes/BootScene.js`。

## Phaser 技能

Phaser 4 技能安裝在 `.agents/skills/`，Kenney 素材搜尋技能位於 `.agents/skills/kenney-asset-finder/`。
