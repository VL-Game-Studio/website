import { keyframes } from 'styled-components/macro';

// Animation utils
export const AnimFade = keyframes`
  0% {opacity: 0}
  100% {opacity: 1}
`;

// Media query breakpoints
export const media = {
  desktop: 1600,
  laptop: 1280,
  tablet: 1024,
  mobile: 696,
  mobileLS: `(max-width: 820px) and (max-height: 420px)`,
};
