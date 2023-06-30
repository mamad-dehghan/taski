import React, {ReactNode} from 'react';

import "./label.scss"
import {Input, inputT} from "../input/input";

type props = {
    label: ReactNode,
    // input: ReactNode,
    children: ReactNode,
    id: string
}

const Label = ({label, children, id}: props) => {
    return (
        <label htmlFor={id}>
            <>
                <span className="label">
                    {label}
                </span>
                {children}
            </>
        </label>
    );
};
export default Label;
