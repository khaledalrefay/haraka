const palettes = [
  [
    "classic",
    "كحلي وبرتقالي",
    "#24415D",
    "#E58A48"
  ],
  [
    "ocean",
    "بترولي ومرجاني",
    "#164E63",
    "#FB836F"
  ],
  [
    "forest",
    "أخضر غابة ومشمشي",
    "#245447",
    "#F4A56B"
  ],
  [
    "slate",
    "فحمي ولايم",
    "#303B45",
    "#B9DB68"
  ],
  [
    "ink",
    "حبري وذهبي",
    "#292B35",
    "#D5AE58"
  ],
  [
    "earth",
    "قهوة وكراميل",
    "#49362F",
    "#C89462"
  ],
  [
    "olive",
    "زيتوني وقمحي",
    "#535C38",
    "#D9BF74"
  ],
  [
    "rose",
    "أحمر كرزي وحجري",
    "#9B3545",
    "#C8BDB3"
  ],
  [
    "plum",
    "نيلي وأزرق بنفسجي",
    "#393B78",
    "#9999F5"
  ]
];
const paletteIds = palettes.map((p) => p[0]);
export {
  paletteIds,
  palettes
};

export const paletteBackgrounds = {"classic": ["#F5F7FA", "#121C29"], "ocean": ["#F1F7F7", "#101F24"], "forest": ["#F3F7F3", "#121F1A"], "slate": ["#F4F6F7", "#171C20"], "ink": ["#FAF7EF", "#19191F"], "earth": ["#F8F3EC", "#211A17"], "olive": ["#F7F6EE", "#1C2016"], "rose": ["#FAF5F3", "#23171C"], "plum": ["#F5F5FC", "#191A2C"]};
