import {createContext, CSSProperties, ReactNode, useEffect, useMemo, useState} from "react";
import classNames from "classnames";

import "./typography.scss";
import "./palette.scss";

import './index.scss'
import {getCookie, setCookie} from "typescript-cookie";
import {readProfile, updateProfile} from "../../utils/database/profile";

export type themeT = {
    "--primary-hue": number;
    "--secondary-hue": number;
    "--tertiary-hue": number;
    // danger:number;
    // warning:number;
    // success:number;
}

const themeOnPreference = JSON.parse((await readProfile())?.["preference"] ?? "{}")
const defaultTheme: themeT = {
    // "--primary-hue": Number(getCookie("primary")) || 260,
    // "--secondary-hue": Number(getCookie("secondary")) || 250,
    // "--tertiary-hue": Number(getCookie("tertiary")) || 20,
    "--primary-hue": themeOnPreference["primary"] || 260,
    "--secondary-hue": themeOnPreference["secondary"] || 250,
    "--tertiary-hue": themeOnPreference["tertiary"] || 20
}

// TODO: default is light not user schema
const defaultDarkMode = getCookie("darkMode") === "true"


type themeContextT = {
    theme: themeT,
    overrideTheme: (newTheme: Partial<themeT>) => void,
    darkMode: boolean,
    setDarkMode: (darkMode: boolean) => void
}

export const themeContext = createContext<themeContextT>({} as themeContextT)

type themeProviderT = {
    children: ReactNode,
    modify?: Partial<themeT>,
    forceDarkMode?: boolean
}

// fix when dark mode is undefined at default dark mode value
export const ThemeProvider = ({children, modify = {}, forceDarkMode}: themeProviderT) => {
    const [theme, setTheme] = useState<themeT>({...defaultTheme, ...modify})
    const [darkMode, setDarkMode] = useState<boolean>(forceDarkMode ?? defaultDarkMode)
    useEffect(() => {
        const preferenceTheme = {
            "primary": theme["--primary-hue"],
            "secondary": theme["--secondary-hue"],
            "tertiary": theme["--tertiary-hue"],
        }
        readProfile()
            .then(res => {
                updateProfile({preference: JSON.stringify({...JSON.parse(res.preference), ...preferenceTheme})})
            })
    }, [theme]);
    useEffect(() => {
        setCookie("darkMode", darkMode, {expires: 365, path: "/"})
    }, [darkMode]);
    const setNewTheme = (newTheme: Partial<themeT>) => setTheme((prevState: themeT) => ({
        ...prevState,
        ...newTheme
    }))
    const className = classNames(
        "theme-provider",
        darkMode ? "dark-theme" : "light-theme"
    )
    const content = useMemo(() => children, [])
    return (
        <themeContext.Provider
            value={{theme, overrideTheme: setNewTheme, darkMode, setDarkMode}}>
            <div className={className} style={theme as CSSProperties}>
                {content}
            </div>
        </themeContext.Provider>
    )
}
