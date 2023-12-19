import React, {ReactNode, useDeferredValue, useRef, useState} from 'react';
import {TooltipContext, TooltipT} from "./tooltip_context";

import "./tooltip_provider.scss"
import {placeFinder} from "../../utils/placeFinder/placeFinder";
import {AppLayer} from "../appLayer/appLayer";

type props = {
    children: ReactNode
}

// TODO: add rich tooltip

export const TooltipProvider = ({children}: props) => {
    const [tooltip, setTooltip] = useState<TooltipT | undefined>(undefined)
    const defer = useDeferredValue(tooltip)
    const ref = useRef<HTMLSpanElement>(null)
    const xOy = (tooltip && ref.current) ? placeFinder(tooltip.element.getBoundingClientRect(), ref.current.getBoundingClientRect(), undefined, [{
        vertical: "bottom",
        horizontal: "center"
    }, {vertical: "top", horizontal: "center"}], {container: {X: 4, Y: 4}, targetEl: {X: 0, Y: 8}}) : undefined
    // console.log(xOy,tooltip?.element?.getBoundingClientRect())
    return (
        <TooltipContext.Provider value={{
            showTooltip: (tooltip: TooltipT) => {
                setTooltip(tooltip)
            },
            hideTooltip: (id: string) => {
                setTooltip(prevState => prevState?.id === id ? undefined : prevState)
            }
        }}>
            {children}
            <AppLayer className="tooltip-section">
                {
                    <span ref={ref} className="tooltip-simulator">{tooltip?.content}</span>
                }
                {
                    defer
                        ? <span style={{
                            top: xOy?.Y,
                            left: xOy?.X
                            // left:"clamp(100px, 20px, 180px)"
                            //     left:`clamp(4px,${(tooltip.element.getBoundingClientRect().left+tooltip.element.getBoundingClientRect().width/2)-(ref.current?.getBoundingClientRect().width/2)}px , ${document.body.getBoundingClientRect().width - ref.current?.getBoundingClientRect().width+4}px)`
                        }}
                                className="tooltip1">{tooltip?.content}</span>
                        : <></>
                }
            </AppLayer>
        </TooltipContext.Provider>
    );
};
