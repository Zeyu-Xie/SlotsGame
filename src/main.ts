// import { Application, Assets, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";

// define the name of the type 'PIXI.Sprite[]'
type Sprites = PIXI.Sprite[]

// generate random sprits colors
function generateRandomColor(): number {
  // 生成一个 0 到 16777215 之间的随机整数（即 0x000000 到 0xFFFFFF）
  const randomColor = Math.floor(Math.random() * 16777215);
  return randomColor;
}

// create a colum of pics
// function createAndRenderReel(picTexture: PIXI.Texture, scale_index: number): PIXI.Container {
//   const reel = new PIXI.Container();

//   for (let i = 0; i < 9; i++) {
//     const pic = new PIXI.Sprite(picTexture);
//     pic.scale.set(scale_index);
//     pic.tint = generateRandomColor()
//     const picContainer = new PIXI.Container();
//     picContainer.y = i * 100;
//     picContainer.addChild(pic);

//     reel.addChild(picContainer);
//   }

//   return reel
// }

// create a container filled with Sprites
function buildReel(sprites: Sprites): PIXI.Container {
  const reel = new PIXI.Container();
  for (let i = 0; i < sprites.length; i++) {
    reel.addChild(sprites[i])
  }
  return reel
}

// render reel
function renderReel(reel: PIXI.Container, scale_index: number, space: number): void {
  for (let i = 0; i < reel.children.length; i++) {
    const sprite = reel.children[i];
    // todo: extract this line to a function called arrange
    sprite.y = i * space;
    sprite.scale.set(scale_index);
  }
}

// build and render a reel 
function createReel(sprites: Sprites, scale_index: number, space: number): PIXI.Container {
  const reel = buildReel(sprites)
  renderReel(reel, scale_index, space)
  return reel
}

// create reel array containing a certain number of reels 
function createReels(spritesArray: Sprites[], scale_index: number, space: number): PIXI.Container[] {
  /*create some reels by calling function createReel many times
   * put reels into an array
   * return this array */
  const reels: PIXI.Container[] = []
  for (let i = 0; i < spritesArray.length; i++) {
    const reel = createReel(spritesArray[i], scale_index, space);
    reels.push(reel);
  }
  return reels
}

// build a reel set containing reels
function buildReelSet(reels: PIXI.Container[]): PIXI.Container {
  const reelSet = new PIXI.Container();
  for (let i = 0; i < reels.length; i++) {
    reelSet.addChild(reels[i])
  }
  return reelSet;
}

// render reel set
function renderReelSet(reelSet: PIXI.Container, startX: number, startY: number, gap: number): void {
  for (let i = 0; i < reelSet.children.length; i++) {
    const reel = reelSet.children[i];
    reel.x = startX + i * gap;
    reel.y = startY;
  }
}

// create reel set
function createReelSet(reels: PIXI.Container[], startX: number, startY: number, gap: number): PIXI.Container {
  const reelset = buildReelSet(reels)
  renderReelSet(reelset, startX, startY, gap)
  return reelset
}

// reposition the elements in the reel
function arrange(reel: PIXI.Container): void {
  for (let i = 0; i < reel.children.length; i++) {
    const element = reel.children[i];
    element.y = i * 100;
  }
}

// [Depracated] create reels
function createReelsDepracated(texture: PIXI.Texture, count: number, app: PIXI.Application): PIXI.Container[] {
  const reels: PIXI.Container[] = [];

  for (let i = 0; i < count; i++) {
    const reel = createAndRenderReel(texture, 1);
    reels.push(reel);
    app.stage.addChild(reel);
  }

  return reels;
}

(async () => {

  // Create and initialize a new application
  const app = new PIXI.Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // define gloable variables
  const VISIBLE_TOP = app.screen.height * 2 / 7;
  const VISIBLE_BOTTOM = app.screen.height * 5 / 7;
  const REEL_GAP = 100;
  const CENTER_X = app.screen.width / 2;
  const CENTER_Y = app.screen.height / 2;
  const SCALE = 0.8;

  const MASK_COLOR = 0x000000;
  const MASK_ALPHA = 0.5;

  const MASK_TOP_X = 0;
  const MASK_TOP_Y = 0;
  const MASK_TOP_WIDTH = app.screen.width;
  const MASK_TOP_HEIGHT = VISIBLE_TOP;

  const MASK_BOTTOM_X = MASK_TOP_X;
  const MASK_BOTTOM_Y = VISIBLE_BOTTOM;
  const MASK_BOTTOM_WIDTH = MASK_TOP_WIDTH;
  const MASK_BOTTOM_HEIGHT = MASK_TOP_HEIGHT;


  // todo: change name
  const SPACE = 80;
  const REEL_NUM = 3;
  const REEL_SIZE = 7;
  const REEL_SET_X = CENTER_X - REEL_NUM * REEL_GAP / 2;
  const REEL_SET_Y = CENTER_Y - REEL_SIZE * SPACE / 2;


  //load the assets
  PIXI.Assets.addBundle("assets", {
    bunny: "/assets/bunny.png",
    gift: "/assets/gift.png",
    club: "/assets/club.png",
    diamond: "/assets/diamond.png",
    heart: "/assets/heart.png",
    spade:"/assets/spade.png"
  });
  const textures = await PIXI.Assets.loadBundle("assets");
  
  const spriteBunny = new PIXI.Sprite(textures.bunny);
  const spriteGift = new PIXI.Sprite(textures.gift);
  const spriteClub = new PIXI.Sprite(textures.club);
  const spriteDiamond = new PIXI.Sprite(textures.diamond);
  const spriteHeart = new PIXI.Sprite(textures.heart);
  const spriteSpade = new PIXI.Sprite(textures.spade); 

  /* create some sprites 
   * put all sprites into spritesArray */
  const spritesArray: Sprites[] = [
    [new PIXI.Sprite(textures.club),
      new PIXI.Sprite(textures.diamond),
      new PIXI.Sprite(textures.heart),
      new PIXI.Sprite(textures.spade),
      new PIXI.Sprite(textures.gift),
      new PIXI.Sprite(textures.diamond),
      new PIXI.Sprite(textures.gift)],
    [new PIXI.Sprite(textures.diamond),
      new PIXI.Sprite(textures.heart),
      new PIXI.Sprite(textures.spade),
      new PIXI.Sprite(textures.gift),
      new PIXI.Sprite(textures.club),
      new PIXI.Sprite(textures.diamond),
      new PIXI.Sprite(textures.gift)],
    [new PIXI.Sprite(textures.heart),
      new PIXI.Sprite(textures.diamond),
      new PIXI.Sprite(textures.heart),
      new PIXI.Sprite(textures.spade),
      new PIXI.Sprite(textures.gift),
      new PIXI.Sprite(textures.gift),
      new PIXI.Sprite(textures.club)]
  ];

  // for (let i = 0; i < REEL_NUM; i++) {
  //   const sprites: Sprites = []

  //   for (let j = 0; j < REEL_SIZE; j++) {
  //     const sprite = new PIXI.Sprite(textures.gift)
  //     sprites.push(sprite)
  //   }

  //   spritesArray.push(sprites)
  // }

  app.stage.addChild(createReelSet(createReels(spritesArray, SCALE, SPACE), REEL_SET_X, REEL_SET_Y, REEL_GAP))

  // create centerLine
  const centerLine = new PIXI.Graphics();
  centerLine.moveTo(0, app.screen.height / 2);
  centerLine.lineTo(app.screen.width, app.screen.height / 2);
  centerLine.stroke({ width: 2, color: 0x000000, alpha: 1 });
  app.stage.addChild(centerLine);

  // create a mask
  function createMask(maskX:number, maskY:number, maskWidth:number, maskHeight:number, maskColor:number, maskAlpha:number):{mask: PIXI.Graphics}{
    const mask = new PIXI.Graphics();
    mask.rect(maskX, maskY, maskWidth, maskHeight);
    mask.fill({color: maskColor, alpha: maskAlpha});
    app.stage.addChild(mask);
    return{mask};
  }
  createMask(MASK_TOP_X, MASK_TOP_Y, MASK_TOP_WIDTH, MASK_TOP_HEIGHT, MASK_COLOR, MASK_ALPHA)
  createMask(MASK_BOTTOM_X, MASK_BOTTOM_Y, MASK_BOTTOM_WIDTH, MASK_BOTTOM_HEIGHT, MASK_COLOR, MASK_ALPHA)

  // set the position of the reels
  function positionReels(reels: PIXI.Container[], startX: number, startY: number, gap: number): void {
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      reel.x = startX + i * gap;
      reel.y = startY;
    }
  }

  // // ----------------------------------------------

  // // create action button
  // const buttonTexture = textures.bunny;
  // const actionButton = new PIXI.Sprite(buttonTexture);
  // actionButton.interactive = true;
  // actionButton.cursor = "pointer";
  // app.stage.addChild(actionButton);

  // const targetIndex = [0, 1, 2];
  // let isSpinning = false;
  // let spinProgress = [0, 0, 0];
  // let isStopped = [false, false, false];
  // let total = reel_1.children.length * 20;


  // actionButton.on("pointerdown", onButtonClick);

  // function onButtonClick() {
  //   isSpinning = !isSpinning;

  //   let spinProgress = [0, 0, 0];
  //   let isStopped = [false, false, false];

  // }

  app.ticker.add((time: PIXI.Ticker) => {
    // if (!isSpinning) return;

    // scroll
    // function move(reel: PIXI.Container, direction: number): void {
    //   reel.y += 2 * time.deltaTime * direction;
    // }
    // move(sprites[1], 1);

    // //wrap
    // function wrap(reel: PIXI.Container, direction: number): void {
    //   if (direction === 1) {
    //     const line = VISIBLE_TOP - 40;
    //     const last = reel.children[reel.children.length - 1];
    //     if (reel.y > line) {
    //       reel.removeChild(last);
    //       reel.addChildAt(last, 0);
    //       render(reel);
    //       reel.y = reel.y - 100;
    //     }
    //   } else {
    //     const line = VISIBLE_BOTTOM + 40;
    //     const first = reel.children[0];
    //     if (reel.y < line) {
    //       reel.removeChild(first);
    //       reel.addChild(first);
    //       render(reel);
    //       reel.y = reel.y + 50;
    //     }
    //   }
    // }
    // wrap(reel_1, 1);

    // STOP
    // function stop(reel: PIXI.Container): void {
    //   const first = reel.children[0];
    //   if (reel.y < CENTER) {
    //     reel.removeChild(first);
    //     reel.addChild(first);
    //     render(reel);
    //     reel.y = reel.y + 50;
    //   }
    // }
    // stop(reel_1);




  });


})();


