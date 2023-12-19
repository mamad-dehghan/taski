import {useContext} from "react";
import {ToastContext} from "../../providers/toast/toast_context";

export const useToast = () => useContext(ToastContext)
