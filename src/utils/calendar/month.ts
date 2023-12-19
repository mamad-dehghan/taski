import dayjs, {Dayjs} from "dayjs";
import {useContext, useEffect, useState} from "react";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";

enum Month {
    January = "January",
    February = "February",
    March = "March",
    April = "April",
    May = "May",
    June = "June",
    July = "July",
    August = "August",
    September = "September",
    October = "October",
    November = "November",
    December = "December"
}

export const monthDetails = Object.freeze<{
    reference: Month,
    fullName: string,
    shortName: string,
    order: number,
    length: number,
    daysBefore: number,
    hasLeap: boolean
}[]>([
    {
        reference: Month.January,
        fullName: "January",
        shortName: "Jan",
        order: 1,
        length: 31,
        daysBefore: 0,
        hasLeap: false
    },
    {
        reference: Month.February,
        fullName: "February",
        shortName: "Feb",
        order: 2,
        length: 28,
        daysBefore: 31,
        hasLeap: true
    },
    {
        reference: Month.March,
        fullName: "March",
        shortName: "Mar",
        order: 3,
        length: 31,
        daysBefore: 59,
        hasLeap: false
    },
    {
        reference: Month.April,
        fullName: "April",
        shortName: "Apr",
        order: 4,
        length: 30,
        daysBefore: 90,
        hasLeap: false
    },
    {
        reference: Month.May,
        fullName: "May",
        shortName: "May",
        order: 5,
        length: 31,
        daysBefore: 120,
        hasLeap: false
    },
    {
        reference: Month.June,
        fullName: "June",
        shortName: "Jun",
        order: 6,
        length: 30,
        daysBefore: 151,
        hasLeap: false
    },
    {
        reference: Month.July,
        fullName: "July",
        shortName: "Jul",
        order: 7,
        length: 31,
        daysBefore: 181,
        hasLeap: false
    },
    {
        reference: Month.August,
        fullName: "August",
        shortName: "Aug",
        order: 8,
        length: 31,
        daysBefore: 212,
        hasLeap: false
    },
    {
        reference: Month.September,
        fullName: "September",
        shortName: "Sep",
        order: 9,
        length: 30,
        daysBefore: 243,
        hasLeap: false
    },
    {
        reference: Month.October,
        fullName: "October",
        shortName: "Oct",
        order: 10,
        length: 31,
        daysBefore: 273,
        hasLeap: false
    },
    {
        reference: Month.November,
        fullName: "November",
        shortName: "Nov",
        order: 11,
        length: 30,
        daysBefore: 304,
        hasLeap: false
    },
    {
        reference: Month.December,
        fullName: "December",
        shortName: "Dec",
        order: 12,
        length: 31,
        daysBefore: 334,
        hasLeap: false
    }
])

export const useMonthDet = () => {
    const {dayjsLocal} = useContext(CalendarContext)
    return Array.from({length: 12}).map((_, i) => dayjsLocal(dayjs(new Date())).startOf('year').set('month', i))
}

// .. TODO: check for leap year
const getPreviousMonth = (date: Date) => {
    return monthDetails[(date.getMonth() + 11) % 12]
}
// const getNextMonth = (date: Date) => {
//     return monthDetails[(date.getMonth() + 1) % 12]
// }
// const getMonthInfo = (date: Date) => {
//     return monthDetails[date.getMonth()]
// }
const getCurrentMonthLength = (date: Date) => monthDetails[date.getMonth()].length
// export const createMonthObject = (date: Date) => {
//     const dayInWeek = date.getDay();
//     const dayInMonth = date.getDate();
//     const previousMonthDays = (dayInWeek - dayInMonth + 36) % 7;
//     const previousMonthFirstDay = getPreviousMonth(date).length - previousMonthDays + 1;
//     const previousMonthDaysList = Array.from({length: previousMonthDays}, (x, i) => i + previousMonthFirstDay);
//     const currentMonthDays = getCurrentMonthLength(date);
//     const currentMonthDaysList = Array.from({length: currentMonthDays}, (x, i) => i + 1);
//     const nextMonthDays = (34 - dayInWeek - (getCurrentMonthLength(date) - dayInMonth)) % 7;
//     const nextMonthDaysList = Array.from({length: nextMonthDays}, (x, i) => i + 1);
//
//     return {
//         previousMonthDays,
//         previousMonthFirstDay,
//         previousMonthDaysList,
//         currentMonthDays,
//         currentMonthDaysList,
//         nextMonthDays,
//         nextMonthDaysList
//     }
// }
// fix for 12-01-2023
// export const createMonthObjectOriginal = (date: Date) => {
//     const tempDate = new Date(date)
//     const dayInWeek = date.getDay();
//     const dayInMonth = date.getDate();
//     const currentMonth = date.getMonth();
//     const previousMonthDays = (dayInWeek - dayInMonth + 36) % 7;
//     // add margin
//     const previousMonthFirstDay = getPreviousMonth(date).length - previousMonthDays + 1;
//     const previousMonthDaysList = Array.from({length: previousMonthDays}, (_, i) => new Date(tempDate.setMonth(currentMonth - 1, i + previousMonthFirstDay)));
//     const currentMonthDaysList = Array.from({length: getCurrentMonthLength(date)}, (_, i) => new Date(tempDate.setMonth(currentMonth, i + 1)))
//     const nextMonthDays = (34 - dayInWeek - (getCurrentMonthLength(date) - dayInMonth)) % 7;
//     const nextMonthDaysList = Array.from({length: nextMonthDays}, (_, i) => new Date(tempDate.setMonth(currentMonth + 1, i + 1)));
//     return {
//         firstDay: previousMonthDaysList[0] ?? currentMonthDaysList[0],
//         dayList: [...previousMonthDaysList, ...currentMonthDaysList, ...nextMonthDaysList]
//     }
// }
export const useMonthObject = (date: Dayjs) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const [list, setList] = useState<Dayjs[]>(calcMonthObject(date, dayjsLocal))
    useEffect(() => {
        setList(calcMonthObject(date, dayjsLocal))
    }, [date]);

    return list
}
const calcMonthObject = (date: Dayjs, dayjsLocal: (a: Dayjs) => dayjs.Dayjs): Dayjs[] => {
    const firstCurrMonDay = dayjsLocal(dayjs(date)).set('D', 1);
    // console.log("f", firstCurrMonDay.toDate())
    const lastCurrMonDay = firstCurrMonDay.endOf('month').startOf('day');
    // console.log("l", lastCurrMonDay.toDate())
    const currMonLength = lastCurrMonDay.get("D");
    // console.log("len", currMonLength)
    const preMonDays = dayjsLocal(dayjs(firstCurrMonDay)).get('d');
    // console.log("pre", preMonDays)
    const nextMonthDays = 6 - dayjsLocal(dayjs(lastCurrMonDay)).get('d');
    const preMonth = Array.from({length: preMonDays}).map((_, i) => dayjsLocal(dayjs(firstCurrMonDay)).subtract(i + 1, 'day')).reverse()
    const currMonth = Array.from({length: currMonLength}).map((_, i) => dayjsLocal(dayjs(firstCurrMonDay)).add(i, 'day'))
    const nextMonth = Array.from({length: nextMonthDays}).map((_, i) => dayjsLocal(dayjs(lastCurrMonDay)).add(i + 1, 'day'))
    return [...preMonth, ...currMonth, ...nextMonth]
}
