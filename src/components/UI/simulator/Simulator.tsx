import React, {ReactNode, useRef} from "react";

type props = {
    Element:any,
    top?:number,
    left?:number,
    propsFunction:(ref:Element)=>any
}

// TODO: add classname to scss to exclude visually styling

export const Simulator = ({Element,top,left,propsFunction}: props) => {
    const ref = useRef<Element>(null)

    return (
        <>
            <span><Element ref={ref}/></span>
            <Element {...propsFunction}/>
        </>
    );
};
