import {Context, createContext, ReactElement, ReactNode} from "react";

export type TooltipT = {
    id: string,
    content: string|ReactNode,
    element: HTMLDivElement
}
type tooltipContextT = {
    hideTooltip: (id: string) => void,
    showTooltip: (tooltip: TooltipT) => void
}
export const TooltipContext: Context<tooltipContextT> = createContext({} as tooltipContextT)
