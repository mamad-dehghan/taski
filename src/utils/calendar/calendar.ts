import dayjs from "dayjs";

export enum CalendarShowModel {
    day = "day",
    week = "week",
    month = "month",
    schedule = "schedule"
}

export const ORDER_MARGIN: number = 0

const simpleRegexChecker = /^[0123][0-9]{3}-[0-1]?[0-9]-[0123]?[0-9]$/;

export const findDateFromParams = (param: string): Date | undefined => {
    const date = dayjs(param, "YYYY-MM-DD").toDate()
    if (isNaN(date))
        return undefined
    else
        return date
    // if (param.match(simpleRegexChecker)) {
    //     const first = param.indexOf("-")
    //     const second = param.lastIndexOf("-")
    //     const dayParam = +param.substring(second + 1)
    //     const monthParam = +param.substring(first + 1, second) - 1
    //     const yearParam = +param.substring(0, first)
    //     const allowMonth = monthParam < 12 && monthParam > -1
    //     if (allowMonth) {
    //         const allowDayInMonth = monthDetails[monthParam].length >= dayParam
    //         if (allowDayInMonth) {
    //             // console.log(new Date(`${monthParam}/${dayParam}/${yearParam}`))
    //             return (new Date(yearParam, monthParam, dayParam))
    //         }
    //     }
    // }
    // return undefined
}
