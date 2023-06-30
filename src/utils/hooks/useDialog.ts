import {useContext} from "react";
import {dialogContext, dialogContextT} from "../../providers/dialogProvider/dialogProvider";

export const useDialog = () => useContext<dialogContextT>(dialogContext)
