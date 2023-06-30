import './badge.scss'
import {ReactNode} from "react";

type props = {
    show: boolean,
    display: "number" | "dot",
    value: number,
    maxValue?: number,
    children: ReactNode
}

export const Badge = ({children, show, display, value, maxValue = 999}: props) => {
    if (!show)
        return <>{children}</>
    else {
        if (display === "dot")
            return (
                <div className="badge-wrapper">
                    {children}
                    <div className="badge"/>
                </div>
            )
        else return (
            <div className="badge-wrapper">
                {children}
                <div className="badge">
                    {value <= maxValue ? value : `${maxValue}+`}
                </div>
            </div>
        )
    }
}
