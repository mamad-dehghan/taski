import React, {ReactNode} from 'react';

import "./label.scss"

type props = {
    label: ReactNode,
    // input: ReactNode,
    children: ReactNode,
    id: string,
}

export const Label = ({label, children, id}: props) => {
    return (
        <label htmlFor={id}>
                <span className="label">
                    {label}
                </span>
            {children}
        </label>
    );
}
