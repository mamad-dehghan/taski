import React, {InputHTMLAttributes, ReactNode} from 'react';
import classNames from "classnames";

import './input.scss'
import {FormikValues, useFormik} from "formik";
import {colorOptions} from "../../../providers/theme/types";

export const resolveWithFormik = <T extends FormikValues, >(form: ReturnType<typeof useFormik<T>>, field: keyof T) => {
    return {
        id: field,
        name: field,
        hasError: form.errors[field] !== undefined,
        supportText: form.errors[field] as string | undefined,
        // value:form.values[field] as string | number,
        onChange: form.handleChange,
    }
}

export interface inputT extends InputHTMLAttributes<HTMLInputElement> {
    id: string,
    // disabled?: boolean,
    supportText?: string,
    hasError?: boolean,
    // mode: colorOptions,
    iconEnd?: ReactNode,
    iconStart?: ReactNode,
    color?: colorOptions.primary | colorOptions.secondary | colorOptions.tertiary | colorOptions.success,
    fullWidth?: boolean,
    // fill: fillOptions.elevated | fillOptions.outline,
    // errorMessage?: string,
    // label: string,
    // fullWidth?: boolean
}

//TODO: add elevated

export const Input = React.memo(React.forwardRef<HTMLInputElement, inputT>((
    {
        // disabled,
        supportText,
        color = colorOptions.primary,
        hasError = false,
        // label,
        // errorMessage,
        iconStart,
        iconEnd,
        fullWidth,
        className,
        // fill,
        ...others
    }: inputT, ref) => {
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
    // >
    return (
        <div
            className={classNames(
                "input--wrapper",
                color === colorOptions.primary && 'element-primary',
                color === colorOptions.secondary && 'element-secondary',
                color === colorOptions.tertiary && 'element-tertiary',
                color === colorOptions.success && 'element-success',
                fullWidth && "full-width",
                others.disabled && "disabled",
                className
            )}
            data-support-text={supportText}
            data-has-error={hasError ? "true" : "false"}
        >
            {
                iconStart ?
                    <span className="input-icon start-icon">
                        {iconStart}
                    </span>
                    : undefined
            }
            <input
                ref={ref}
                className={classNames(
                    'input',
                    "input--outline",
                    fullWidth && "full-width",
                    (iconStart || iconEnd) && "with-icon",
                    iconStart && "input--with-start-icon",
                    iconEnd && "input--with-end-icon",
                )}
                {...others}
            />
            {
                iconEnd ?
                    <span className="input-icon end-icon">
                    {iconEnd}
                    </span>
                    : undefined
            }
        </div>
    )
}))
