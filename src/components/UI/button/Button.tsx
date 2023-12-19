import {ButtonHTMLAttributes, ReactNode} from "react";
import classNames from "classnames";
import {colorOptions, componentSizeOptions, fillOptions} from "../../../providers/theme/types";

import "./button.scss"

// TODO: add sizing
// TODO: add disabled
interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    componentSize?: componentSizeOptions,
    // disabled?: boolean,
    fill?: fillOptions,
    icon?: ReactNode,
    iconSide?: 'start' | 'end',
    fullWidth?: boolean,
    round?: boolean,
    dataFocused?: boolean,
    color?: colorOptions.primary | colorOptions.success | colorOptions.error | colorOptions.warning | colorOptions.secondary | colorOptions.tertiary
}

// TODO: add data-open-popup
export const Button = (
    {
        componentSize = componentSizeOptions.medium,
        color = colorOptions.primary,
        fill = fillOptions.fill,
        fullWidth,
        round,
        icon,
        iconSide,
        children,
        className,
        dataFocused,
        ...others
    }: IButtonProps) => {

    return (
        <button
            className={classNames(
                'button',
                others.disabled && 'disabled',
                fullWidth && 'button--full-width',
                color === colorOptions.primary && 'element-primary',
                color === colorOptions.error && 'element-error',
                color === colorOptions.warning && 'element-warning',
                color === colorOptions.success && 'element-success',
                color === colorOptions.secondary && 'element-secondary',
                color === colorOptions.tertiary && 'element-tertiary',
                fill === 'fill' && 'button--fill',
                fill === 'link' && 'button--link',
                fill === 'outline' && 'button--outline',
                fill === 'elevated' && 'button--elevated',
                fill === 'tonal' && 'button--tonal',
                round && 'button-round',
                dataFocused && 'element-focused',
                icon && {
                    'button-with-icon': true,
                    'button-with-icon-at-start': iconSide === 'start',
                    'button-with-icon-at-end': iconSide === "end"
                },
                // icon && `button-with-icon ${iconSide === 'start' ? 'button-with-icon-at-start' : 'button-with-icon-at-end'}`,
                className,
            )}
            {...others}
        >
            {icon}
            {children}
        </button>
    )
}
