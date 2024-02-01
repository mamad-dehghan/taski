import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {usePopup} from "../../../utils/hooks/usePopup";
import {marginsT, positionType} from "../../../utils/placeFinder/placeFinder";

type props = {
    id: string,
    open?: boolean,
    target?: DOMRect,
    margins?: marginsT | ((parentId?: string, nested?: boolean) => marginsT),
    onClose: () => void,
    children: ReactNode,
    position?: positionType | ((parentId?: string, nested?: boolean) => positionType)
}
// [{vertical: "bottom", horizontal: "center"}, {vertical: "top", horizontal: "center"}]
export const Popup = ({children, open = true, target, onClose, id, position, margins}: props) => {
    const {parentId, nested} = useContext<singlePopupContextType>(singlePopupContext)
    // console.log(parentId, "parent id", id)
    const {hidePopup, showPopup} = usePopup()
    // useEffect(() => {
    //     return () => {
    //         // hidePopup(id)
    //         console.log("close return")
    //     }
    // }, []);
    useEffect(() => {
        if (target && open) {
            showPopup(
                {
                    id,
                    targetEl: target,
                    onClose,
                    position: typeof position === 'function' ? position(parentId, nested) : position,
                    margins: typeof margins === 'function' ? margins(parentId, nested) : margins,
                    content:
                        <div style={{display: "contents"}} onClick={event => {
                            event.stopPropagation()
                        }}>
                            {/*TODO: change with type: menu , popup*/}
                            <SinglePopupProvider id={id}
                                                 nested={parentId?.startsWith("--menu-") && id.startsWith("--menu-")}>
                                {children}
                            </SinglePopupProvider>
                        </div>
                    //     <DatePicker onChange={({start}) => {
                    //     console.log(start);
                    //     form.setFieldValue('startTime', start)
                    //     onClose()
                    // }} multiSelect={false} />
                },
                parentId
            )
            // console.log("open", id)
        } else {
            hidePopup(id)
            // console.log("close", id)
        }
    }, [target, parentId, open]);
    return (
        <></>
    )
}
export type singlePopupContextType = { parentId?: string, nested: boolean }
export const singlePopupContext = createContext<singlePopupContextType>({parentId: undefined, nested: false})

const SinglePopupProvider = ({children, id, nested = false}: { children: ReactNode, id: string, nested?: boolean }) => {
    const [parentId] = useState<string | undefined>(id)
    const [isNested] = useState<boolean>(nested)
    return (
        <singlePopupContext.Provider value={{parentId, nested: isNested}}>
            {children}
        </singlePopupContext.Provider>
    )
}
