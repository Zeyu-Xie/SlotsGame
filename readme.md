# This is a slots game

# 1 Introduction
Our goal is to build a lightweight and modular slots game engine. We implemented the core functionality of a virtual slot machine that supports configurable reel sets, symbol matching, and payout evaluation. The engine supports random spin generation and win detection based on a defined pay table. 

# 2 System overview
Below is the complete overview of this Slots Game project :)
- Core logic for a virtual slot machine (configurable reels and rows).
- Random spin result generation based on reel sets.
- Win detection based on symbol matches and payout table.
- Support for custom symbols and flexible PAY_TABLE design.
- Win animations and result display.
- Basic state machine: Idle → Spinning → Evaluating → ShowingResult → Idle.

# 3 Design and Implementation
## 3-1 System architecture
![Architecture](https://github.com/user-attachments/assets/e80ef03c-7156-43f8-b936-54bfdc8f5ced)
## 3-2 Code
### 3-2-1 Back-end
#### GetSpinResult()
- Target: The GetSpinResult function creates the stop positions for each reel and the symbols that will be seen in the rows.
- Problem: A random stop position is chosen for each reel and select several symbols in a row from that point. The results should be correct and the same each time.
- Solution: To make sure the spin result is always right, the function first randomly picks a start index (stopIndex) for each reel. Then it collects the corresponding ROW_NUM symbols and it will return the stop positions, the visible symbols, and the win result using winResults.
```typescript
function GetSpinResult(): SpinRes {
   // code ...     
        const stopIndex = getRandomInt(0, reel.length);
}
```
> the index of reel set can be revised accoring to different purposes.

#### winResults()
- Target: The winResults function is used to calculate the winning symbols from a spin result. 
- Problem: After the reels stop, we need to figure out if the player has won by designing a logic to check every visible symbol, comparing it to each symbol type, and calculating the total win based on how many times it appears. 
- Solution: The function loops through every possible symbol type. For each one, it counts how many times it appears in the result (reelStops) and records its positions. Then, it looks up the corresponding payout in PAY_TABLE based on how many matches were found. If the payout is greater than zero, it adds this win to the results list.
```typescript
function winResults(reelStops: number[][]): Win[] {
    for (let symbolId = 0; symbolId < SYMBOLS.length; symbolId++) {
    // code ...
        for (let reelId = 0; reelId < REEL_NUM; reelId++) {
        // code ...
            for (let symbolY = 0; symbolY < ROW_NUM; symbolY++) {
         // code ...
                if (symbolIndex === symbolId) {
            // code ... 
        if (win.amount > 0) { wins.push(win) }
    }
    return wins
}
```
> the pay table can be revised according to different purposes.

### 3-2-2 Front-end architectural design
The main challenge in the earlier part lies in controlling the different states of the reel during rotation. An object-oriented approach was used to implement reel state management. The followings are the explaination of the reel state management and the actions corresponding to each key state.

#### State Management. 
- Target: After pressing the start button, the system could automatically processing the actions in order including reel start, acceleration, deceleration, stop, highlight winning symbols, and show total win amount. 
- Problem: It will be hard to maintain if every statement is set a statement separately.
- Solution: Object-Oriented Programming is applied to control the whole reel movement.
![slotsgame-reelStateManagement drawio](https://github.com/user-attachments/assets/ff3811c4-ab3e-4040-a694-e3cde29dc5d1)

> this is the whole process of reel state management

![slotsgame-stateWithAction drawio](https://github.com/user-attachments/assets/2e296138-f326-468f-93c8-1e4f580519a4)

> this is the statement process with the corresponding action

#### Spin algorithm design

##### Move()
- Target: Move function is used to make the container move towards an assigned direction.
- Problem: Duo to the different setting of volocity, the container can move a big step or a small step every delta time. If the step is larger than a SPACE, the reel container will look like jumping in the final display, making the visuals deel disjointed and creates a strong sense of disconnect.
- Solution: To make the moving animation smoother and more stable, an if condition is added to force the step of the reel smaller than a SPACE.
![slotsgame-move drawio](https://github.com/user-attachments/assets/e36fc2eb-3b6c-48f5-9650-c0b96697acd1)
> this is the display of the Move logic
 ```typescript  
  function move(reel: PIXI.Container, direction: number, deltaTime: number, velocity: number): void {
    if (Math.abs(REEL_SET_Y() - (reel.y + velocity * deltaTime * direction)) < SPACE) {
      reel.y += velocity * deltaTime * direction; 
    // code...
  }
```

##### Wrap()
- Target: Wrap function is used to make the reel of the sprites able to loop.
- Problem: The natural logic is to move the last sprite of the reel to the first index. This will involve lots of Y-coordinate calculation, making the code redundent and easy to get errors.
- Solution: The remove and add algorithm is used to simplify this process by decoupling the coordinate from the wrap logic. It only focuses on remove the last sprite and add the sprite to the first position of the reel. After that, arrange function is used to reposition the sprites.
![slotsgame-wrap drawio](https://github.com/user-attachments/assets/e148d493-2131-4e81-aa79-d6e6282f1ce4)
> this is the display of the logic of wrap

```typescript
  function arrange(reel: PIXI.Container, space: number): void {
    // code...
    reel.removeChild(removedSprite);
    reel.addChildAt(removedSprite, toIndex);
    arrange(reel, space);
  }
```

##### Acceleration()
-Target: Increase the moving rate of a sprite gradually.
-Solution: Increase the velocity of the sprite with a fixed moving rate. 
```typescript
  function acceleration(reelState: ReelState, increaseRate: number): void {
  // code...
  }
```

##### Deceleration()
-Target: Decrease the velocity of the sprite with a fixed moving rate.
-Problem: If the velocity of a sprite keeps decreasing, it will reach below 0. 
-Solution: An if condition is added to prevent the velocity of a sprite reach below 0.
```typescript
  function deceleration(reelState: ReelState) {
// code ...
    if (reelState.velocity < MIN_VELOCITY) {
      reelState.velocity = MIN_VELOCITY;
      reelState.canStop = true;
    }
  }
```

##### Stop()
- Target: make the sprites of the reel stops at the assigned position.
- Problem: the canStop statement can only make the sprites stop, but the stopped sprites are not aliged well.
- Solution: isAtStartPosition is added below the canStop state to make sure the sprites is stopped and weel-aligned. Besides, the label is used to identify every sprite so that they can be instructed to be at the assigned position.
![slotsgame-canStop-isAtStartPosition drawio](https://github.com/user-attachments/assets/96bd75d6-036b-47e6-924f-e0cb16c05dc5)

```typescript
  function stopReel(reelState: ReelState) {
 //code ...
    if (reelState.isAtStartPosition && isLabelMatched) {
      reelState.canMove = false;
      reelState.canShowWin = true;
      reelState.canStop = false;
    }
  }
```
> some art design part is deleted from the code due to the irrelevance.

## 3-3 Game Art Design
The theme of this slots game is inspired by the visual style of Don't Starve, focusing mainly on dark elements, torch lighting, and hand-drawn line art. The original game interface is set in darkness, with interactive icons appearing as glowing dots that echo the torch held by the character. All interactive button elements are designed in a hand-drawn line style. Below is the initial sketch of the game design.

![script1](https://github.com/user-attachments/assets/f637a908-30e3-452e-af9e-3b30c8b8fcc6) 
> this is the original script for the spin button

![script2](https://github.com/user-attachments/assets/339a032b-5519-4954-af68-e815b9e78eca)
> this is the original script for the sound button

# 4 Summary
This project implements a basic slot machine game engine. It features random spin generation, symbol matching, win calculation based on a configurable pay table, and a clear game state flow. The system is designed with modularity in mind, making it easy to integrate with UI frameworks or expand with features like bonus rounds and animations. Core functionalities have been tested for correctness, stability, and performance under repeated spins.
