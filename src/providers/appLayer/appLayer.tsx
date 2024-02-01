import {HTMLAttributes} from "react";
import classNames from "classnames";

import "./app_layer.scss"

type props = HTMLAttributes<HTMLDivElement>

export const AppLayer = ({className, children, ...others}: props) => {
    return (
        <div {...others} className={classNames("app-extra-layer", className)}>
            {children}
        </div>
    );
};
