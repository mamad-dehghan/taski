import {ORDER_MARGIN} from "./calendar";
import {useContext, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";

enum Day {
    Saturday = "Saturday",
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
}

export const dayDetails = Object.freeze<{ reference: Day, fullName: string, shortName: string, order: number }[]>([
    {
        reference: Day.Saturday,
        fullName: "Saturday",
        shortName: "Sat",
        order: 1,
    },
    {
        reference: Day.Sunday,
        fullName: "Sunday",
        shortName: "Sun",
        order: 2,
    },
    {
        reference: Day.Monday,
        fullName: "Monday",
        shortName: "Mon",
        order: 3,
    },
    {
        reference: Day.Tuesday,
        fullName: "Tuesday",
        shortName: "Tue",
        order: 4,
    },
    {
        reference: Day.Wednesday,
        fullName: "Wednesday",
        shortName: "Wed",
        order: 5,
    },
    {
        reference: Day.Thursday,
        fullName: "Thursday",
        shortName: "Thu",
        order: 6,
    },
    {
        reference: Day.Friday,
        fullName: "Friday",
        shortName: "Fri",
        order: 7,
    },
])

export const getDayDetails = (date: Date) => {
    return dayDetails[(date.getDay() + ORDER_MARGIN + 1) % 7]
}

export const createDayObject = (date: Date) => {
    const dayInWeek = date.getDay();
    const dayInMonth = date.getDate();
    const firstDay = date
    return {
        firstDay,
        dayList: [firstDay]
    }

}
export const useDayObject = (date: Dayjs) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const [list, setList] = useState<Dayjs[]>([dayjsLocal(dayjs(date))])
    useEffect(() => {
        setList([dayjsLocal(dayjs(date))])
    }, []);
    return list
}
