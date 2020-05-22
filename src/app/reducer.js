export const initialState = {
  menuOpen: false,
  user: null,
  redirect: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'setRedirect': {
      const redirect = action.value;
      window.localStorage.setItem('redirect', JSON.stringify(redirect));
      return { ...state, redirect };
    }
    case 'setUser': {
      const user = action.value;
      window.localStorage.setItem('user', JSON.stringify(user));
      return { ...state, user };
    }
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    default:
      throw new Error();
  }
}
