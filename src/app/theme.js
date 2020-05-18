const fontStack = [
  'Montserrat',
  'Helvetica Neue',
  'Helvetica',
  'Arial',
  'sans-serif',
];

const monoFontStack = [
  'Consolas',
  'Andale Mono WT',
  'Andale Mono',
  'Lucida Console',
  'Lucida Sans Typewriter',
  'DejaVu Sans Mono',
  'Bitstream Vera Sans Mono',
  'Liberation Mono',
  'Nimbus Mono L',
  'Monaco',
  'Courier New',
  'Courier',
  'monospace',
];

const spacing = {
  spacingGutter: 20,
  spacingOuter: {
    desktop: 60,
    tablet: 40,
    mobile: 20,
  }
};

const media = {
  desktop: 1600,
  laptop: 1280,
  tablet: 1024,
  mobile: 696,
  mobileSmall: 320,
  mobileLS: `(max-width: 820px) and (max-height: 420px)`,
};

const base = {
  bezierFastoutSlowin: 'cubic-bezier(0.475, 0.425, 0, 0.995)',
  clipPath: (size = 8) => `polygon(0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%)`,
  fontStack: fontStack.join(', '),
  monoFontStack: monoFontStack.join(', '),
  colorBlack: 'rgba(0, 0, 0, 1)',
  colorWhite: 'rgba(255, 255, 255, 1)',
  colorAccent: 'rgba(248, 69, 37, 1)',
  maxWidthDesktop: 1100,
  maxWidthLaptop: 1000,
};

const light = {
  ...spacing,
  ...base,
  ...media,
  colorBackground: 'rgba(255, 255, 255, 1)',
  colorBackgroundSecondary: 'rgba(234, 234, 234, 1)',
  colorTitle: 'rgba(17, 17, 17, 1)',
  colorText: 'rgba(111, 111, 111, 1)',
};

const dark = {
  ...spacing,
  ...base,
  ...media,
  colorBackground: 'rgba(31, 30, 29, 1)',
  colorBackgroundSecondary: 'rgba(23, 22, 21, 1)',
  colorTitle: base.colorWhite,
  colorText: base.colorWhite,
};

export const theme = { light, dark };
