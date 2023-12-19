import React from 'react';
import {Link} from "react-router-dom";

type props = {}

export const ComponentsPanel = ({}: props) => {
    return (
        <div className="components-panel" style={{display:"flex",flexDirection:"column"}}>
            <Link key="button" to={"/dashboard/components/button"} >Button</Link>
            <Link key="icon-button" to={"/dashboard/components/icon-button"} >Icon Button</Link>
            <Link key="switch" to={"/dashboard/components/switch"} >Switch</Link>
            <Link key="chip" to={"/dashboard/components/chip"} >Chip</Link>
        </div>
    );
};
