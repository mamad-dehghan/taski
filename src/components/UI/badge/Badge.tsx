import './badge.scss'
import {ReactNode} from "react";

type props = {
    show?: boolean,
    display?: "number" | "dot",
    value: number,
    maxValue?: number,
    children: ReactNode
}

export const Badge = ({children, show = true, display = "number", value, maxValue = 999}: props) => {
    return (
        <div className="badge-wrapper">
            {children}
            {
                show ?
                    <div className="badge element-error">
                        {
                            display === "number" ?
                                value <= maxValue ? value : `+${maxValue}`
                                :
                                undefined
                        }
                    </div>
                    :
                    undefined
            }
        </div>
    )
    // if (!show)
    //     return <>{children}</>
    // else {
    //     if (display === "dot")
    //         return (
    //             <div className="badge-wrapper">
    //                 {children}
    //                 <div className="badge"/>
    //             </div>
    //         )
    //     else return (
    //         <div className="badge-wrapper">
    //             {children}
    //             <div className="badge">
    //                 {value <= maxValue ? value : `${maxValue}+`}
    //             </div>
    //         </div>
    //     )
    // }
}
