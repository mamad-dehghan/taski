import React, {ReactNode, useCallback, useDeferredValue, useMemo, useRef, useState} from 'react';
import {TooltipContext, TooltipT} from "./tooltip_context";

import "./tooltip_provider.scss"
import {placeFinder} from "../../utils/placeFinder/placeFinder";
import {AppLayer} from "../appLayer/appLayer";
import classNames from "classnames";

let isTooltipHovered: boolean = false;
type props = {
    children: ReactNode
}

export const TooltipProvider = ({children}: props) => {
    const [tooltip, setTooltip] = useState<TooltipT | undefined>(undefined)
    const ref = useRef<HTMLSpanElement>(null)

    const xOy = useMemo(() => (tooltip && ref.current) ?
        placeFinder(
            tooltip.element.getBoundingClientRect(),
            ref.current.getBoundingClientRect(),
            undefined,
            [{vertical: "bottom", horizontal: "center"},
                {vertical: "top", horizontal: "center"}],
            {container: {X: 4, Y: 4}, targetEl: {X: 0, Y: 8}}
        )
        : undefined, [tooltip, ref.current])

    const defer = useDeferredValue(xOy)

    const showTooltip = useCallback((tooltip: TooltipT) => {
        isTooltipHovered = false;
        setTooltip(tooltip)
    }, [])

    const hideTooltip = useCallback((id: string) => {
        setTimeout(() => setTooltip(prevState => {
                    if (isTooltipHovered)
                        return prevState
                    else
                        return prevState?.id === id ? undefined : prevState
                }
            ),
            typeof tooltip?.content === "string" ? 0 : 100)
    }, [tooltip])

    return (
        <TooltipContext.Provider value={{
            showTooltip,
            hideTooltip
        }}>
            {children}
            <AppLayer className="tooltip-section">
                {
                    <span key={tooltip?.id} ref={ref} className={classNames(
                        "tooltip-simulator",
                        (typeof tooltip?.content) !== (undefined || "string") && "rich"
                    )}>{tooltip?.content}</span>
                }
                {
                    defer
                        ? <span
                            onMouseEnter={() => {
                                isTooltipHovered = (true);
                            }}
                            onMouseLeave={() => {
                                isTooltipHovered = (false)
                                setTooltip(undefined);
                            }} style={{
                            ...xOy,
                            ...((typeof tooltip?.content) !== (undefined || "string") ? {
                                paddingTop: xOy?.top ? "8px" : 0,
                                paddingBottom: xOy?.bottom ? "8px" : 0,
                                transform: `translateY(${xOy?.top ? "-8px" : "8px"})`
                                // paddingLeft: xOy?.left ? "8px" : 0,
                                // paddingRight: xOy?.right ? "8px" : 0,
                            } : {})
                        }}
                            className={classNames(
                                "tooltip1",
                                (typeof tooltip?.content) !== (undefined || "string") && "rich"
                            )}>{tooltip?.content}</span>
                        : <></>
                }
            </AppLayer>
        </TooltipContext.Provider>
    );
};
