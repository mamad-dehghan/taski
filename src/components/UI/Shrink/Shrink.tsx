import React, {ReactNode} from 'react';
import classNames from "classnames";
import "./shrink.scss"

type props = {
    direction: "up" | "left",
    active: boolean,
    children:ReactNode
}

export const Shrink = ({direction, active, children}: props) => {
    return (
        <div className={classNames(
            "shrink", {
                "shrink-up": active && direction == "up",
                "shrink-left": active && direction == "left",
            })}>
            {children}
        </div>
    );
};
