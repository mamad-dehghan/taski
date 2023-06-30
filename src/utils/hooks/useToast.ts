import {useContext} from "react";
import {ToastContext} from "../../providers/toast/toast_provider";

export const useToast = () => useContext(ToastContext)
