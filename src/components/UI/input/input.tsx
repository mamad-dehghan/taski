import React, {InputHTMLAttributes, ReactNode} from 'react';
import {fillOptions, colorOptions} from "../../../providers/theme/types";
import classNames from "classnames";

import './input.scss'

export interface inputT extends InputHTMLAttributes<HTMLInputElement> {
    id: string,
    disabled?: boolean,
    mode: colorOptions,
    // iconEnd?: ReactNode,
    // iconStart?: ReactNode,
    fill: fillOptions.shadow | fillOptions.outline,
    errorMessage?: string,
    label: string,
    fullWidth?: boolean
}

export const Input = ({
                          disabled,
                          label,
                          errorMessage,
                          mode,
                          // iconStart,
                          // iconEnd,
                          fill,
                          id,
                          placeholder = " ",
                          ...others
                      }: inputT) => {
    // <div
    //     className={classNames(
    //         'input--wrapper',
    //         fill === fillOptions.shadow && 'input--wrapper--shadow',
    //         fill === fillOptions.outline && 'input--wrapper--outline',
    //         mode === modeOptions.primary && 'element--primary',
    //         mode === modeOptions.danger && 'element--danger',
    //         mode === modeOptions.warning && 'element--warning',
    //         mode === modeOptions.success && 'element--success'
    //     )}
    //
    // >
    return (
        <div
            className="input--wrapper"
            data-support-text={"yes"}
            // data-has-error={"a"}
        >
            <input
                className={classNames(
                    'input', "input--outline"
                )}
                type="text"
                id={id}
                placeholder={placeholder}
                // disabled={true}
                {...others}
            />
        </div>
    )
}
