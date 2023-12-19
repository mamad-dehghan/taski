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
    // if (isNaN(date as number))
    //     return undefined
    // else
        return date
}
