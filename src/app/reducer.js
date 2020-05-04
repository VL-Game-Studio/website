import { theme } from 'app/theme';

export const initialState = {
  menuOpen: false,
  currentTheme: theme.light,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'setTheme':
      return { ...state, currentTheme: action.value };
    case 'updateTheme':
      return { ...state, currentTheme: { ...theme[state.currentTheme.id], ...action.value } };
    case 'toggleTheme': {
      const newThemeKey = state.currentTheme.id === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('theme', JSON.stringify(newThemeKey));
      return { ...state, currentTheme: theme[newThemeKey] };
    }
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    default:
      throw new Error();
  }
}
