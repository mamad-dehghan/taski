import React, {ButtonHTMLAttributes} from 'react';
import {colorOptions, componentSizeOptions} from "../../../providers/theme/types";
import classNames from "classnames";

import "./fab.scss";

interface IFABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: colorOptions,
    size?: componentSizeOptions,
}

export const FAB = (
    {
        color = colorOptions.tertiary,
        size = componentSizeOptions.medium,
        title,
        className,
        children,
        ...others
    }: IFABProps) => {

    return (
        <button
            className={classNames(
                "fab",
                color === colorOptions.secondary && 'element-secondary',
                color === colorOptions.tertiary && 'element-tertiary',
                color === colorOptions.surface && 'element-surface',
                color === colorOptions.primary && 'element-primary',
                color === colorOptions.success && 'element-success',
                color === colorOptions.warning && 'element-warning',
                color === colorOptions.error && 'element-error',
                size === componentSizeOptions.small && 'element-small',
                size === componentSizeOptions.medium && 'element-medium',
                size === componentSizeOptions.large && 'element-large',
                className,
            )}
            {...others}
        >
            {children}
            <span className="fab-title">
            {title}
            </span>
        </button>
    );
};
