export const initialState = {
  menuOpen: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    default:
      throw new Error();
  }
}
