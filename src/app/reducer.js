import { theme } from 'app/theme';

export const initialState = {
  menuOpen: false,
  currentTheme: theme,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'updateTheme':
      return { ...state, currentTheme: { ...theme, ...action.value } };
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    default:
      throw new Error();
  }
}
