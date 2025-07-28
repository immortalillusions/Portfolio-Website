export const bottomMap = -50; // vertical
export const tileSize = 42; // size of each tile in the grid
export const playerStep = 42;
// hitbox bounds around the tree
export const treeBoundSize = 50; 

export const minTileIndex = -30;
export const maxTileIndex = 30;

// left / right limits
export const minTilePlayer = -20;
export const maxTilePlayer = 20;

export const tilesPerRow = maxTileIndex - minTileIndex + 1; // total number of tiles in a row

export const grassBehindPlayer = 20;

export const playerView = 25;
export const size = 150; // size of the camera's frustum
export function setShadowsRecursively(object, cast, receive) {
    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = cast;
            child.receiveShadow = receive;
        }
    });
}