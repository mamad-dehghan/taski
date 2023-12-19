import {useContext} from "react";
import {TooltipContext} from "../../providers/tooltip/tooltip_context";

export const useTooltip = () =>useContext(TooltipContext)
