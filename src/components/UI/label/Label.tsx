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
        <div className="label">
                <label htmlFor={id}>
                    {label}
                </label>
            {children}
        </div>
    );
}
