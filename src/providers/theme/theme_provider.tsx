import {createContext, CSSProperties, ReactNode, useState} from "react";
import classNames from "classnames";

import "./typography.scss";
import "./palette.scss";

import './index.scss'

type themeT = {
    "--primary-hue"?: number;
    "--secondary-hue"?: number;
    "--tertiary-hue"?: number;
    // danger:number;
    // warning:number;
    // success:number;
}

const defaultTheme: themeT = {
    "--primary-hue": 260,
    "--secondary-hue": 250,
    "--tertiary-hue": 20
}

type themeContextT ={
    theme: themeT,
    overrideTheme: (newTheme: themeT) => void,
    darkMode: boolean | undefined,
    setDarkMode: (darkMode?: boolean) => void
}

export const themeContext = createContext<themeContextT>({} as themeContextT)

type themeProviderT = {
    children: ReactNode,
    modify?: Partial<themeT>,
    forceDarkMode?: boolean
}
export const ThemeProvider = ({children, modify = {}, forceDarkMode}: themeProviderT) => {
    const [theme, setTheme] = useState<themeT>({...defaultTheme, ...modify})
    const [darkMode, setDarkMode] = useState<boolean | undefined>(forceDarkMode)
    const setThemeProvider = (newTheme: themeT) => setTheme((prevState: themeT) => ({
        ...prevState,
        newTheme
    }))
    const className = classNames(
        "theme-provider", {
            "dark-theme": darkMode === true,
            "light-theme": darkMode === false
        }
    )
    return (
        <themeContext.Provider
            value={{theme, overrideTheme: setThemeProvider, darkMode, setDarkMode}}>
            <div className={className} style={theme as CSSProperties}>
                {children}
            </div>
        </themeContext.Provider>
    )
}
