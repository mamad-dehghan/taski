import React, {ReactNode, useEffect, useId} from 'react';

import "./tooltip.scss"
import {useTooltip} from "../../../utils/hooks/useTooltip";

type props = { children: ReactNode, title: string|ReactNode }

/**
** avoid to set an absolute element as children
 */
export const Tooltip = ({children, title}: props) => {
    const id = useId()
    const {hideTooltip, showTooltip} = useTooltip()
    useEffect(() => {
        return () => {
            hideTooltip(id)
        }
    }, []);
    return (
        <div
            className="tooltip-wrapper"
            onMouseLeave={() => {
                setTimeout(
                    hideTooltip,
                    typeof title === "string" ? 0 :100,
                    id
                )
            }}
            onMouseEnter={event => showTooltip({id, content: title, element: event.currentTarget})}>
            {children}
        </div>
    );
};
