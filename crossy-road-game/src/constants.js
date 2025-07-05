export const minTileIndex = -8;
export const maxTileIndex = 8;
export const tileSize = 42; // size of each tile in the grid
export const tilesPerRow = maxTileIndex - minTileIndex + 1; // total number of tiles in a row

export function setShadowsRecursively(object, cast, receive) {
    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = cast;
            child.receiveShadow = receive;
        }
    });
}