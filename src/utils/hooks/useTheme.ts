import {useContext} from "react";
import {themeContext} from "../../providers/theme/theme_provider";

export const useTheme = () => useContext(themeContext)
