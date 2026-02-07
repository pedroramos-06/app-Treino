import { MD3DarkTheme } from "react-native-paper";
import themeFonts from "./fonts";

export const myTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#7f5af0", 
    secondary: "#72757e",  
    tertiary: "#2cb67d", 
    background: "#16161a", 
    surface: "#242629", 
    onSurface: "#fffffe", 
    onSurfaceVariant: "#94a1b2",
    outline: "#44474a",  
    error: "#f44336",
  },

  fonts: themeFonts,
};

export default myTheme;
