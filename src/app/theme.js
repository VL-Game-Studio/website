import { rgba } from '../utils/style';

const fontStack = [
  'Whitney',
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
  mobileLS: `(max-width: 820px) and (max-height: 420px)`,
};

const base = {
  curveFastoutSlowin: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  clipPath: (size = 8) => `polygon(0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%)`,
  fontStack: fontStack.join(', '),
  monoFontStack: monoFontStack.join(', '),
  colorBlack: 'rgba(0, 0, 0, 1)',
  colorWhite: 'rgba(255, 255, 255, 1)',
  maxWidthDesktop: 1100,
  maxWidthLaptop: 1000,
};

const dark = {
  id: 'dark',
  ...spacing,
  ...base,
  ...media,
  colorBackground: 'rgba(54, 57, 63, 1)',
  colorTitle: base.colorWhite,
  colorText: base.colorWhite,
  colorAccent: 'rgba(114, 137, 218, 1)',
};

const light = {
  id: 'light',
  ...spacing,
  ...base,
  ...media,
  colorBackground: 'rgba(255, 255, 255, 1)',
  colorTitle: base.colorBlack,
  colorText: rgba(base.colorBlack, 0.8),
  colorAccent: 'rgba(114, 137, 218, 1)',
};

export const theme = { dark, light };
