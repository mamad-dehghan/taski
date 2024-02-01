import React, {ReactNode, useMemo} from 'react';
import {CalendarContext} from "./calendarContext";
import {useParams} from "react-router-dom";
import {CalendarShowModel, findDateFromParams} from "../../utils/calendar/calendar";
import dayjs from "dayjs";

type props = {
    children: ReactNode
}
const isJalali = true;
export const CalendarProvider = ({children}: props) => {
    const params = useParams<{ mode: CalendarShowModel, day: string }>()
    const theDay = useMemo(() => findDateFromParams(params.day ?? ""), [params.day])
    if (params.mode) {
        if (params.mode !== "day" && params.mode !== "week" && params.mode !== "month" && params.mode !== "schedule") {
            throw new Error("wrong view mode")
        }
        if (!theDay)
            return <></>
    }

    return (
        <CalendarContext.Provider value={{
            day: theDay,
            mode: params.mode,
            dayjsLocal: (args: ReturnType<typeof dayjs>) =>
                isJalali ?
                    args.calendar('jalali').locale('fa') :
                    args
                // args.calendar('gregory').locale('en')
        }}>
            {children}
        </CalendarContext.Provider>
    );
};
