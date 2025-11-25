export const colors = {
  light: {
    background: '#F6DBFA',
    surface: '#FFFFFF',
    primary: '#754ABF',
    secondary: '#D48354',
    text: '#200524',
    textSecondary: '#754ABF',
  },
  dark: {
    background: '#200524',
    surface: '#2D1B3D',
    primary: '#A77ED6',
    secondary: '#E89B6E',
    textSecondary: '#D4B8E0',
  },
};

export type ColorScheme = keyof typeof colors;
export type ColorKey = keyof typeof colors.light;
