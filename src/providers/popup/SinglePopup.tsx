import React, {useDeferredValue, useEffect, useRef, useState} from 'react';
import {PopupType} from "./popupContext";
import {marginsT, placeFinder, positionType} from "../../utils/placeFinder/placeFinder";
import FocusTrap from "focus-trap-react";

const defaultPosition: positionType = [{
    vertical: "bottom",
    horizontal: "right"
}, {
    vertical: "bottom",
    horizontal: "left"
}]

export const SinglePopup = React.memo((
    {
        popup,
        hidePopup,
        // hasParent = false,
        position = defaultPosition,
        margins = {container: {X: 4, Y: 4}, targetEl: {X: 0, Y: 0}},
    }: {
        popup: PopupType,
        hidePopup: (id: string) => void
        position?: positionType,
        margins?: marginsT | (({target}: { target: DOMRect }) => marginsT),
        // hasParent?: boolean
    }) => {
    // const {nested} = useContext<singlePopupContextType>(singlePopupContext)
    // console.log(nested, "nn")

    const ref = useRef<HTMLSpanElement>(null)
    const [xOOy0, setXOOy0] = useState<{ Y: number, X: number } | undefined>(undefined)
    const deferOpen = useDeferredValue(Boolean(xOOy0))
    useEffect(() => {
        if (ref.current) {
            setXOOy0(placeFinder(popup.targetEl,
                ref.current.getBoundingClientRect(),
                undefined,
                position,
                typeof margins === "undefined"
                    ? undefined
                    : typeof margins === "function"
                        ? margins({target: popup.targetEl})
                        : margins,
                // nested ?
                //     {
                //         targetEl: {X: 0, Y: -8 - popup.targetEl.height},
                //         container: {X: 4, Y: 4}
                //     } : {
                //         container: {
                //             X: 4,
                //             Y: 4
                //         },
                //         targetEl: {
                //             X: 0,
                //             Y: 0
                //         }
                //     }
            ))
        }
    }, [ref.current]);

    return (
        <>
            <span key={popup.id + "simulator"} ref={ref} className="menu-simulator">{popup.content}</span>
            {
                xOOy0
                    ? <>
                        <span onClick={e => e.stopPropagation()} key={popup.id + "original"}
                              style={{
                                  top: xOOy0?.Y,
                                  left: xOOy0?.X
                              }}
                              className="menu1">
                        <FocusTrap
                            active={deferOpen}
                            focusTrapOptions={{
                                allowOutsideClick: true,
                                onDeactivate: () => hidePopup(popup.id)
                            }}>
                            {popup.content}
                        </FocusTrap>
                        </span>
                    </>
                    : <></>
            }
        </>
    )
})
