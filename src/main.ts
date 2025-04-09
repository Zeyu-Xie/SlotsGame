// import { Application, Assets, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";

function generateRandomColor(): number {
  // 生成一个 0 到 16777215 之间的随机整数（即 0x000000 到 0xFFFFFF）
  const randomColor = Math.floor(Math.random() * 16777215);
  return randomColor;
}
// create a colum of pics
function createPicContainer(picTexture: PIXI.Texture, scale_index: number): PIXI.Container {
  const reel = new PIXI.Container();

  for (let i = 0; i < 9; i++) {
    const pic = new PIXI.Sprite(picTexture);
    pic.scale.set(scale_index);
    pic.tint = generateRandomColor()
    const picContainer = new PIXI.Container();
    picContainer.y = i * 100;
    picContainer.addChild(pic);

    reel.addChild(picContainer);
  }
  return reel
}

// reposition the elements in the reel
function render(reel:PIXI.Container): void {
  for (let i = 0; i < reel.children.length; i++) {
    const element = reel.children[i];
    element.y  = i * 100;
  }
}


(async () => {
  // Create and initialize a new application
  const app = new PIXI.Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // define gloable variables
  const VISIBLE_TOP = app.screen.height * 2 / 7;
  const VISIBLE_BOTTOM = app.screen.height * 5 / 7;

  // Load the bunny texture
  const texture = await PIXI.Assets.load("/assets/gift.png");

  // create and show reels
  const reel_1 = createPicContainer(texture, 1);
  const reel_2 = createPicContainer(texture, 1);
  const reel_3 = createPicContainer(texture, 1);
  app.stage.addChild(reel_1, reel_2, reel_3)

  // create, show, and set position of reelSet
  const reelSet = new PIXI.Container();
  reelSet.addChild(reel_1, reel_2, reel_3)
  app.stage.addChild(reelSet);
  reelSet.x = (app.screen.width - reelSet.width) / 2 - reelSet.width;

  // set position of reels
  reel_1.y = app.screen.height * 3 / 14;
  reel_1.x = 0;
  reel_2.y = app.screen.height * 3 / 14;
  reel_2.x = 100;
  reel_3.y = app.screen.height * 3 / 14;
  reel_3.x = 200;

  // create mask
  function addMask(app: PIXI.Application, alpha_index: number): { topMask: PIXI.Graphics, bottomMask: PIXI.Graphics } {

    const topMask = new PIXI.Graphics();
    topMask.rect(0, 0, app.screen.width, VISIBLE_TOP);
    topMask.fill({ color: 0x000000, alpha: alpha_index });

    const bottomMask = new PIXI.Graphics();
    bottomMask.rect(0, VISIBLE_BOTTOM, app.screen.width, app.screen.height * 2 / 7);
    bottomMask.fill({ color: 0x000000, alpha: alpha_index });

    app.stage.addChild(topMask, bottomMask);

    return { topMask, bottomMask };
  }
  addMask(app, 0.5);

  app.ticker.add((time: PIXI.Ticker) => {
    // scroll
    function move(reel: PIXI.Container, direction: number): void {
      reel.y += 2 * time.deltaTime * direction;
    }
    move(reel_1, 1);

    wrap
    function wrap(reel: PIXI.Container, direction: number): void {
      if (direction === 1) {
        const line = VISIBLE_TOP - 40;
        const last = reel.children[reel.children.length - 1];
        if (reel.y > line) {
          reel.removeChild(last);
          reel.addChildAt(last, 0);
          render(reel);
          reel.y = reel.y - 50;
        }
      } else {
        const line = VISIBLE_BOTTOM + 40;
        const first = reel.children[0];
        if (reel.y < line) {
          reel.removeChild(first);
          reel.addChild(first);
          render(reel);
          reel.y = reel.y + 50;
        }
      }
    }
    wrap(reel_1, 1);
    


  });


})();

// app.ticker.add((delta: number) => 
