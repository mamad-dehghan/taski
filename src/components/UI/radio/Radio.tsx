import React, {InputHTMLAttributes} from "react";
import {colorOptions} from "../../../providers/theme/types";
import classNames from "classnames";
import {Circle, RadioButton} from "@phosphor-icons/react";

import "./radio.scss"

export interface IRadioProps extends InputHTMLAttributes<HTMLInputElement> {
    color?: colorOptions,
}

export const Radio = ({color = colorOptions.primary, className, ...others}: IRadioProps) => {
    return (
        <button tabIndex={-1}
                className={classNames(
                    'radio',
                    others.checked && "checked",
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
            <input {...others} type="radio" className="hidden-radio"/>
            {
                others.checked ?
                    <RadioButton weight={"fill"}/>
                    :
                    <Circle weight={"regular"}/>
            }
        </button>
    )
}
