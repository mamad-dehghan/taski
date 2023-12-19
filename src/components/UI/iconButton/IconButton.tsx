import React, {ButtonHTMLAttributes} from 'react';
import {colorOptions, componentSizeOptions, fillOptions} from "../../../providers/theme/types";
import classNames from "classnames";

import "./iconButton.scss"
import {Icon, IconWeight} from "@phosphor-icons/react";

interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: componentSizeOptions,
    color?: colorOptions.primary | colorOptions.success | colorOptions.error | colorOptions.warning | colorOptions.tertiary | colorOptions.secondary,
    fill?: fillOptions.fill | fillOptions.link | fillOptions.outline | fillOptions.tonal,
    Icon: Icon,
    enable?: boolean,
    weight?:IconWeight,
    dataFocused?:boolean
}

export const IconButton = (
    {
        size = componentSizeOptions.medium,
        color = colorOptions.primary,
        fill = fillOptions.fill,
        Icon,
        className,
        enable = false,
        dataFocused= false,
        weight,
        ...others
    }: IIconButtonProps) => {
    return (
        <button
            className={classNames(
                "icon-button",
                others.disabled && 'disabled',
                color === colorOptions.primary && 'element-primary',
                color === colorOptions.error && 'element-error',
                color === colorOptions.warning && 'element-warning',
                color === colorOptions.success && 'element-success',
                color === colorOptions.tertiary && 'element-tertiary',
                color === colorOptions.secondary && 'element-secondary',
                fill === fillOptions.fill && 'icon-button--fill',
                fill === fillOptions.link && 'icon-button--link',
                fill === fillOptions.outline && 'icon-button--outline',
                fill === fillOptions.tonal && 'icon-button--tonal',
                size === componentSizeOptions.small && 'element-small',
                size === componentSizeOptions.medium && 'element-medium',
                size === componentSizeOptions.large && 'element-large',
                dataFocused && 'element-focused',
                enable && 'icon-button--enable',
                className
            )}
            {...others}
        >
            <Icon weight={weight ?? (enable ? "fill" : "regular")}/>
        </button>
    );
};
