import React, {ReactNode, useEffect} from 'react';

import "./tooltip.scss"
import {useTooltip} from "../../../utils/hooks/useTooltip";

type props = { children: ReactNode, title: string }

/**
** avoid to set an absolute element as children
 */
export const Tooltip = ({children, title}: props) => {
    const {hideTooltip, showTooltip} = useTooltip()
    useEffect(() => {
        return () => {
            hideTooltip(title)
        }
    }, []);
    return (
        <div
            className="tooltip-wrapper"
            onMouseLeave={() => hideTooltip(title)}
            onMouseEnter={event => showTooltip({id: title, content: title, element: event.currentTarget})}>
            {children}
        </div>
    );
};
