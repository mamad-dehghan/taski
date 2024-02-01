import React, {ReactNode, useCallback, useState} from 'react';
import {PopupContext, PopupType} from "./popupContext";
import {AppLayer} from "../appLayer/appLayer";
import {SinglePopup} from "./SinglePopup";
import "./popupProvider.scss"

type props = {
    children: ReactNode
}
export const PopupProvider = ({children}: props) => {
    const [menus, setMenus] = useState<PopupType[]>([])
    // console.log(menus)
    const menuIsOpen = useCallback((id: string) =>
            (menus.findIndex(item => item.id === id) !== -1)
        , [menus])

    const hidePopup = useCallback((id: string) => {
        let status = false;
        setMenus(prevState => {
            const index = prevState.findIndex(item => item.id === id)
            if (index > -1) {
                const remove = prevState.slice(index).reverse()
                remove.forEach(item => {
                    item.onClose()
                })
                status = true
                return [...prevState.slice(0, index)]
            } else
                return prevState
        })
        return status
    }, [setMenus])

    const showPopup = useCallback((menu: PopupType, parentID?: string) => {
        let status = false;
        setMenus(prevState => {
            const currentIndex = prevState.findIndex(item => item.id === menu.id)
            if (currentIndex > -1)
                return prevState

            if (parentID) {
                const parentIndex = prevState.findIndex(item => item.id === parentID)
                if (parentIndex > -1) {
                    prevState.slice(parentIndex + 1).reverse().forEach(item => {
                        item.onClose()
                    })
                    status = true
                    return [...prevState.slice(0, parentIndex + 1), menu]
                } else {
                    throw new Error("can not find parent id")
                }
            } else {
                status = true
                return [menu]
            }
        })
        return status
    }, [setMenus])

    const togglePopup = useCallback((menu: PopupType, parentID?: string) => {
        if (hidePopup(menu.id)) {
            return false
        } else {
            showPopup(menu, parentID)
            return true
        }
    }, [showPopup, hidePopup])

    const clearAll = useCallback(() => {
        setMenus(prevState => {
            prevState.reverse().forEach(item => {
                item.onClose()
            })
            return []
        })
    }, [])
    return (
        <PopupContext.Provider value={{
            showPopup,
            togglePopup,
            hidePopup,
            menuIsOpen
        }}>
            {children}
            <AppLayer
                className="menu-section"
                onClick={clearAll}
            >
                {
                    menus.map((item) =>
                        <AppLayer
                            key={item.id + "out"}
                            className="menu-section"
                            onClick={(event) => {
                                event.stopPropagation()
                                console.log("close in layer", item.id)
                                hidePopup(item.id)
                            }}>
                            <SinglePopup
                                hidePopup={hidePopup}
                                popup={item}
                                margins={item.margins}
                                // hasParent={index > 0}
                                position={item.position} />
                        </AppLayer>
                    )
                }
            </AppLayer>
        </PopupContext.Provider>
    );
};
