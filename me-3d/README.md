# 3D Personal Website Game

My personal website disguised as a 3D world with a hidden game. Click around to explore my projects, then try to find the game!

## What's in here

- **3D portfolio**: Navigate around and click on models to see my projects/experiences
- **Hidden game**: Infinite procedurally generated world - try to beat your high score!
- **Day/night toggle**: Click the sun/moon button to switch light/dark mode
- **Mobile friendly**: Works on phones too

## Techstack

- **Three.js** for 3D graphics
- **Vite** for fast builds
- **Tailwind CSS** for styling

## Features

### Collision detection (`endsUpInValidPosition`)
- Ensures player can't walk through objects, instead forcing it to stop at the edge of the object
- Used hashmap to map objects to their rows
- Only checks objects within ±10 rows for performance
- Runs on input events, not every frame for efficiency

### Performance optimizations
- Used hashmap for faster lookups during collision checks
- Only animates cars within ±55 rows of the player (within camera view)
- Separated static objects from moving ones to reduce loops

### Other neat features
- Dynamic lighting that switches from point light to directional light when game starts
- Touch controls optimized for mobile
- Infinite world generation
- Vehicle speed increases every 40 rows to make game harder
- Clears and regenerates the world on each respawn, ensuring each experience is a new one!


## How to play

1. Look around and explore the 3D world
2. Find the hidden game start 
3. Use WASD or the on-screen buttons to move
4. Try the day/night toggle for different vibes

That's it! Built this to showcase some projects while having fun with 3D web development.
