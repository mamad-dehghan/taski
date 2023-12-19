import React, {InputHTMLAttributes} from 'react';
import {colorOptions} from "../../../providers/theme/types";

import "./range.scss"
import classNames from "classnames";

interface props extends InputHTMLAttributes<HTMLInputElement> {
    color?: colorOptions;
}

export const Range = ({color, className, ...others}: props) => {
    return (
        <input
            className={classNames(
                "range",
                className
            )}
            color={color} {...others} type="range"/>
    );
};
