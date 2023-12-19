import React, {MouseEventHandler} from 'react';
import {Icon} from "@phosphor-icons/react";
import {boolean} from "yup";
import classNames from "classnames";

type props = {
    title: string,
    LeadingIcon?: Icon,
    TrailingIcon?: Icon
    onClick?: MouseEventHandler<HTMLButtonElement>,
    disable?: boolean,
    className?:string
}

export const MenuItem = ({title, LeadingIcon, TrailingIcon,onClick,className, disable = false}: props) => {
    return (
        <button
            className={classNames("menu-item",className)}
            disabled={disable}
            onClick={onClick}
        >
            {
                LeadingIcon
                    ? <span className="leading-icon" ><LeadingIcon weight="regular"/></span>
                    : <span className="leading-icon" />
            }
            <span className="content">
                {title}
            </span>
            {
                TrailingIcon
                    ? <span  className="trailing-icon"><TrailingIcon weight="fill"/></span>
                    : <span className="trailing-icon" />
            }
        </button>
    );
};
