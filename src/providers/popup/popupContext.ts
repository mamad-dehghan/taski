import {createContext, ReactNode} from "react";
import {marginsT, positionType} from "../../utils/placeFinder/placeFinder";

export type PopupType = {
    id: string,
    position?: positionType,
    margins?:marginsT,
    // depth:number,
    content: ReactNode,
    targetEl: DOMRect,
    onClose: () => void
}
type popupContextT = {
    hidePopup: (id: string) => boolean,
    togglePopup: (popup: PopupType, parentID?: string) => boolean,
    showPopup: (popup: PopupType, parentID?: string) => boolean,
    menuIsOpen: (id: string) => boolean
}
export const PopupContext = createContext<popupContextT>({} as popupContextT)
