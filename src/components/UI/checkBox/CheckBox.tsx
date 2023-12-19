import React, {InputHTMLAttributes} from "react";
import {colorOptions} from "../../../providers/theme/types";
import classNames from "classnames";
import {CheckSquare, MinusSquare, Square} from "@phosphor-icons/react";

import "./checkBox.scss"

// TODO: remove surface from acceptable colors

export interface ICheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
    color?: colorOptions,
    indeterminate?: boolean
}

export const Checkbox = (
    {
        color = colorOptions.primary,
        className,
        indeterminate = false,
        ...others
    }: ICheckBoxProps) => {
    return (
        <button tabIndex={-1}
                className={classNames(
                    'checkbox',
                    others.checked && "checked",
                    indeterminate && "indeterminate",
                    others.disabled && 'disabled',
                    color === colorOptions.primary && 'element-primary',
                    color === colorOptions.secondary && 'element-secondary',
                    color === colorOptions.success && 'element-success',
                    color === colorOptions.error && 'element-error',
                    color === colorOptions.warning && 'element-warning',
                    color === colorOptions.tertiary && 'element-tertiary',
                    className
                )}
        >
            <input {...others} type="checkbox" className="hidden-checkbox"/>
            {
                indeterminate ?
                    <MinusSquare weight={"fill"}/>
                    :
                    others.checked ?
                        <CheckSquare weight={"fill"}/>
                        :
                        <Square weight={"regular"}/>
            }
        </button>
    )
}
