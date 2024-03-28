const STYLE_PER_NUMBER = {
  2: { backgroundColor: "#f8cb77", fontSize: "32px", color: "#FFFFFF" },
  4: { backgroundColor: "#e8b961", fontSize: "32px", color: "#FFFFFF" },
  8: { backgroundColor: "#ff7d40", fontSize: "32px", color: "#FFFFFF" },
  16: { backgroundColor: "#cb5721", fontSize: "32px", color: "#FFFFFF" },
  32: { backgroundColor: "#ce321a", fontSize: "32px", color: "#FFFFFF" },
  64: { backgroundColor: "#a91700", fontSize: "32px", color: "#FFFFFF" },
  128: { backgroundColor: "#920050", fontSize: "30px", color: "#FFFFFF" },
  256: { backgroundColor: "#840092", fontSize: "30px", color: "#FFFFFF" },
  512: { backgroundColor: "#4d1a81", fontSize: "30px", color: "#FFFFFF" },
  1024: { backgroundColor: "#4d1a81", fontSize: "27px", color: "#FFFFFF" },
  2048: { backgroundColor: "#0091ff", fontSize: "27px", color: "#FFFFFF" },
  4096: { backgroundColor: "#008c54", fontSize: "27px", color: "#FFFFFF" },
  8192: { backgroundColor: "#09af00", fontSize: "27px", color: "#FFFFFF" },
  16384: { backgroundColor: "#151515", fontSize: "20px", color: "#FFFFFF" },
};

const BOARD_SIZE = 4;
const ANIMATION_DURATION = 100;

const TILE_SIZE = window.innerWidth < 800 ? window.innerWidth / 4 - 20 : 120; // px
const TILES_GAP = TILE_SIZE / 10; // px

export {
  STYLE_PER_NUMBER,
  BOARD_SIZE,
  ANIMATION_DURATION,
  TILE_SIZE,
  TILES_GAP,
};
