// import { Application, Assets, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";

(async () => {
  // Create and initialize a new application
  const app = new PIXI.Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await PIXI.Assets.load("/assets/gift.png");

  // create a colum of pics
  function createPicContainer(picTexture: PIXI.Texture, scale_index: number): {reel: PIXI.Container}
  {
    const reel = new PIXI.Container();

    for (let i = 0; i < 9; i++)
    {
      const pic = new PIXI.Sprite(picTexture);
      pic.scale.set(scale_index);

      const picContainer = new PIXI.Container();
      picContainer.y = i * 100;
      picContainer.addChild(pic);

      reel.addChild(picContainer);
    }
    app.stage.addChild(reel);
    return {reel}
  }

  // create and show reels
  const reel_1 = createPicContainer(texture,1);
  const reel_2 = createPicContainer(texture,1);
  const reel_3 = createPicContainer(texture,1);


  // create, show, and set position of reelSet
  const reelSet = new PIXI.Container();
  reelSet.addChild(reel_1.reel, reel_2.reel, reel_3.reel)
  app.stage.addChild(reelSet);
  reelSet.x = (app.screen.width - reelSet.width) / 2 - reelSet.width;

  // set position of reels
  reel_1.reel.y = app.screen.height * 3 / 14;
  reel_1.reel.x = 0;
  reel_2.reel.y = app.screen.height * 3 / 14;
  reel_2.reel.x = 100;
  reel_3.reel.y = app.screen.height * 3 / 14;
  reel_3.reel.x = 200;

  // create mask
  function addMask (app: PIXI.Application, alpha_index: number) : {topMask: PIXI.Graphics, bottomMask: PIXI.Graphics}
  {
    const visibleTop = app.screen.height * 2 / 7;
    const visibleBottom = app.screen.height * 5 / 7;

    const topMask = new PIXI.Graphics();
    topMask.rect(0, 0, app.screen.width, visibleTop);
    topMask.fill(0x000000, alpha_index);

    const bottomMask = new PIXI.Graphics();
    bottomMask.rect(0, visibleBottom, app.screen.width, app.screen.height * 2 / 7);
    bottomMask.fill(0x000000, alpha_index);

    app.stage.addChild(topMask, bottomMask);

    return { topMask, bottomMask};
  }
  addMask(app, 0.5);    // if the top and botton variables are not needed after calling the function, direcltly call

  app.ticker.add((time: PIXI.Ticker) =>
  {
    // scrll
    function scroll (reel: PIXI.Container, position_index: number) : void
    {
      for (const element of reel.children)
      {      
        element.y += 5 * time.deltaTime * position_index      
      }
    }
    scroll(reel_1.reel, 1)

  });
  
    
})();

// app.ticker.add((delta: number) => 
