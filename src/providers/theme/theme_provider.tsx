import {createContext, ReactNode, useState} from "react";
import classNames from "classnames";

import "./theme_provider.scss"

type themeT = {
    "--primary-hue"?: number;
    "--secondary-hue"?: number;
    "--tertiary-hue"?: number;
    // danger:number;
    // warning:number;
    // success:number;
}

const defaultTheme: themeT = {
    "--primary-hue": 80,
    "--secondary-hue": 250,
    "--tertiary-hue": 20
}

export const themeContext = createContext<
    {
        theme: themeT,
        overrideTheme: (newTheme: themeT) => void,
        darkMode: boolean | undefined,
        setDarkMode: (darkMode?: boolean) => void
    }>({
    theme: defaultTheme,
    overrideTheme: () => {
    },
    darkMode: false,
    setDarkMode: () => {
    }
})

type themeProviderT = {
    children: ReactNode,
    modify?: themeT,
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
            <div className={className} style={theme as any}>
                {children}
            </div>
        </themeContext.Provider>
    )
}
