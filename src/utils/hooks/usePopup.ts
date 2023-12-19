import {useContext} from "react";
import {PopupContext} from "../../providers/popup/popupContext";

export const usePopup = () => useContext(PopupContext)
