import {useContext, useEffect, useState} from "react";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";
import dayjs, {Dayjs} from "dayjs";

export const useWeekObject = (date: Dayjs) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const [list, setList] = useState<Dayjs[]>(calcWeekObject(date, dayjsLocal))
    useEffect(() => {
        setList(calcWeekObject(date, dayjsLocal))
    }, []);

    return list
}
const calcWeekObject = (date: Dayjs, dayjsLocal: (a: dayjs.Dayjs) => dayjs.Dayjs): Dayjs[] => {
    const currDay = dayjsLocal(dayjs(date)).startOf('day');
    const firstWeekDay = dayjsLocal(dayjs(currDay)).startOf('week')
    return Array.from({length: 7}).map((_, i) => dayjsLocal(dayjs(firstWeekDay)).add(i, 'day'))
}
