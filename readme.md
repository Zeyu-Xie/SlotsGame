# This is a slots game

# 1 Introduction

# 2 System Overview

# 3 Design and Implementation

## 3-1 Code

### 3-1-1 Back-end

### 3-1-2 Front-end

#### State management
- Target: After pressing the start button, the system could automatically processing the actions in order including reel start, acceleration, deceleration, stop, highlight winning symbols, and show total win amount. 
- Problem: It will be hard to maintain if every statement is set a statement separately.
- Solution: Object-Oriented Programming is applied to control the whole reel movement.

// picture: reelStateManagement
> the whole process of reel state management
// picture: state with Action

#### Move
- Target: Move function is used to make the container move towards an assigned direction.
- Problem: Duo to the different setting of volocity, the container can move a big step or a small step every delta time. If the step is larger than a SPACE, the reel container will look like jumping in the final display, making the visuals deel disjointed and creates a strong sense of disconnect.
- Solution: To make the moving animation smoother and more stable, an if condition is added to force the step of the reel smaller than a SPACE.

// picture
 ```typescript  
  function move(reel: PIXI.Container, direction: number, deltaTime: number, velocity: number): void {
    if (Math.abs(REEL_SET_Y() - (reel.y + velocity * deltaTime * direction)) < SPACE) {
      reel.y += velocity * deltaTime * direction;
    } else {
      reel.y = REEL_SET_Y() + direction * SPACE;
    }
  }
``` 

#### Wrap
-Target: Wrap function is used to make the reel of the sprites able to loop.
-Problem: The natural logic is to move the last sprite of the reel to the first index. This will involve lots of Y-coordinate calculation, making the code redundent and easy to get errors.
-Solution: The remove and add algorithm is used to simplify this process by decoupling the coordinate from the wrap logic. It only focuses on remove the last sprite and add the sprite to the first position of the reel. After that, arrange function is used to reposition the sprites.

// picture

```typescript
  function arrange(reel: PIXI.Container, space: number): void {
    for (let i = 0; i < reel.children.length; i++) {
      const element = reel.children[i];
      element.y = i * space;
    }
  }
  function wrap(reel: PIXI.Container, space: number, fromIndex: number, toIndex: number): void {
    const removedSprite = reel.children[fromIndex];
    reel.removeChild(removedSprite);
    reel.addChildAt(removedSprite, toIndex);
    arrange(reel, space);
  }
```

#### Acceleration
-Target: Increase the moving rate of a sprite gradually.
-Solution: Increase the velocity of the sprite with a fixed moving rate. 

```typescript
  function acceleration(reelState: ReelState, increaseRate: number): void {
    if (reelState.velocity < MAX_VELOCITY) {
      reelState.velocity += increaseRate;
    }
  }
```

#### Deceleration
-Target: Decrease the velocity of the sprite with a fixed moving rate.
-Problem: If the velocity of a sprite keeps decreasing, it will reach below 0. 
-Solution: An if condition is added to prevent the velocity of a sprite reach below 0.

```typescript
  function deceleration(reelState: ReelState) {
    if (reelState.velocity > MIN_VELOCITY) {
      reelState.velocity -= reelState.decRate;

      if (reelState.decRate > 0.02) {
        reelState.decRate -= 0.0005;
      }
    }

    if (reelState.velocity < MIN_VELOCITY) {
      reelState.velocity = MIN_VELOCITY;
      reelState.canStop = true;
    }
  }
```
## 3-2 Game Content Production
### 3-2-1 Game Art Design

### 3-2-2 Game Sound Design

# 4 Future Work

# 5 Summary


