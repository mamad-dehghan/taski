import {createContext} from "react";
import {CalendarShowModel} from "../../utils/calendar/calendar";
import dayjs from "dayjs";

export const CalendarContext = createContext({
    mode: undefined,
    day: undefined,
    dayjsLocal: dayjs => dayjs,
} as {
    mode: CalendarShowModel | undefined,
    day: Date | undefined,
    dayjsLocal: (a: ReturnType<typeof dayjs>) => ReturnType<typeof dayjs>
})
