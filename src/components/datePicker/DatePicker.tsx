import React, {ButtonHTMLAttributes, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import classNames from "classnames";
import {useMonthDet, useMonthObject} from "../../utils/calendar/month";
import dayjs, {Dayjs} from "dayjs";
import {readDayTasksCountFromDatabase} from "../../utils/database/task";
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {CaretLeft, CaretRight} from "@phosphor-icons/react";
import {IconButton} from "../UI/iconButton/IconButton";
import {Select} from "../UI/select/Select";
import {v4} from 'uuid';
import "./date-picker.scss"
import {CalendarContext} from "../../providers/calendarContext/calendarContext";
import {GroupButton} from "../UI/groupButtons/GroupButton";

type props = {
    id?: string,
    multiSelect: boolean,
    initial?: { start: Date, end: Date },
    onChange?: ({start, end}: { start: Date, end: Date }) => void,
    initialDate?: Date,
}

export const DatePicker = ({ multiSelect, initial, onChange, initialDate = new Date()}: props) => {
    const [id] = useState(v4())
    const [today,] = useState<Date>(new Date())
    const {dayjsLocal} = useContext(CalendarContext)
    const [date, setDate] = useState<Dayjs>(dayjsLocal(dayjs(initialDate)))

    const dayList = useMonthObject(date)

    // useEffect(() => {
    //     console.log("dayList")
    // }, [dayList]);
    //
    // useEffect(() => {
    //     console.log("date")
    // }, [date]);

    // useEffect(() => {
    //     console.log("dayList")
    // }, [dayList]);

    const badges = useBadge(dayList)

    const {rangeMode, selectedRange, listener, calculateRangeOfItem} = useRange({onChange, multiSelect, initial})

    const monthDet = useMonthDet()
    // console.log(date, dayjsLocal(dayjs(date)))

    const monthDetails = useMemo(() =>
            monthDet.map(i => ({value: i.get("M"), name: i.format("MMM")}))
        , [monthDet])

    // console.log(monthDetails)
    // console.log(dayList)
    // console.log(dayjsLocal(dayjs(today)).toDate().toLocaleDateString(),"today")

    return (
        <div className="date-picker">
            <div className="date-picker--header">
                <div className="date-picker--header-month">
                    <GroupButton>
                        <IconButton
                            key={"prev"}
                            weight={"regular"}
                            fill={fillOptions.link}
                            enable={false}
                            Icon={CaretLeft}
                            onClick={() => setDate(day => day.subtract(1, "month"))}
                        />
                        <Select
                            id={id}
                            fill={fillOptions.link}
                            // color={colorOptions.surface}
                            value={date.get('M')}
                            options={monthDetails}
                            onChange={(value) => {
                                setDate(pre => pre.set('month', value))
                            }} />
                        <IconButton
                            key={"next"}
                            weight={"regular"}
                            fill={fillOptions.link}
                            enable={false}
                            Icon={CaretRight}
                            onClick={() => setDate(day => day.add(1, "month"))}
                        />
                    </GroupButton>
                </div>
                <div className="date-picker--header-year">
                    <GroupButton>
                        <IconButton
                            key={"prev"}
                            weight={"regular"}
                            fill={fillOptions.link}
                            enable={false}
                            Icon={CaretLeft}
                            onClick={() => setDate(day => day.subtract(1, "year"))}
                        />
                        <Select
                            id={id + 'year'}
                            fill={fillOptions.link}
                            // color={colorOptions.surface}
                            // key={date.format('YYYY')}
                            value={date.year()}
                            options={[...Array.from({length: 5}).map((_, i) => ({
                                value: date.year() - i,
                                name: (date.year() - i).toString()
                            })).reverse(), ...Array.from({length: 5}).map((_, i) => ({
                                value: date.year() + i + 1,
                                name: (date.year() + i + 1).toString()
                            }))]}
                            onChange={(value) => {
                                setDate(pre => pre.set('year', value))
                            }} />
                        <IconButton
                            key={"next"}
                            weight={"regular"}
                            fill={fillOptions.link}
                            enable={false}
                            Icon={CaretRight}
                            onClick={() => setDate(day => day.add(1, "year"))}
                        />
                    </GroupButton>
                </div>
            </div>
            <div className="date-picker--days-header">
                {dayList.slice(0, 7).map(i =>
                    <span key={"header" + i.toJSON()} className="date-picker--days-header-item">
                        {dayjsLocal(dayjs(i)).format("dd")}
                    </span>
                )}
            </div>
            <div className={classNames(
                "date-picker--day-container",
                rangeMode && "range-mode"
            )}>
                {
                    dayList.map((item, index) => {
                        // console.log(item.toLocaleDateString())
                        if (item.get('M') === date?.get('M')) {
                            return (
                                <DayInDatePicker
                                    date={item}
                                    draggable={"false"}
                                    key={item.format('D-M')}
                                    // day={item.getDate()}
                                    selected={item.toDate().toLocaleDateString() === selectedRange?.start?.toLocaleDateString() || item.toDate().toLocaleDateString() === selectedRange?.end?.toLocaleDateString()}
                                    {...listener(item.toDate())}
                                    badge={badges[index]}
                                    range={calculateRangeOfItem(item.toDate())}
                                    isToday={item.toDate().toLocaleDateString() === today.toLocaleDateString()} />
                            )
                        } else if (item.toDate().getTime() < date?.toDate().getTime()) {
                            return (
                                <DayInDatePicker
                                    date={item}
                                    key={item.format('D-M')}
                                    // day={item.getDate()}
                                    badge={badges[index]}
                                    disabled
                                    selected={false}
                                    isToday={item.toDate().toLocaleDateString() === today.toLocaleDateString()} />
                            )
                        } else {
                            return (
                                <DayInDatePicker
                                    date={item}
                                    key={item.format('D-M')}
                                    badge={badges[index]}
                                    // day={item.getDate()}
                                    disabled
                                    selected={false}
                                    isToday={item.toDate().toLocaleDateString() === today.toLocaleDateString()} />
                            )
                        }
                    })
                }
            </div>
        </div>
    );
};

type dayProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    // day: number,
    // month?: number,
    // year?: number,
    date: Dayjs,
    badge?: boolean,
    selected: boolean,
    // disabled?: boolean,
    isToday: boolean,
    range?: "in" | "start" | "end",
    // onClick?: () => void
    //TODO: add range
}

const DayInDatePicker = ({date, isToday, range, selected, badge, className, ...others}: dayProps) => {

    return (
        <div
            className={classNames(
                "date-picker--day",
                others.disabled && "disabled",
                selected && "selected",
                isToday && "is-today",
                badge && "with-badge",
                range === "start" && "start-range",
                range === "end" && "end-range",
                range === "in" && "in-range",
                className
            )}
        >
            <span className="range-section" />
            <button className="content" {...others}>
                {date.format("D")}
            </button>
        </div>
    )
}

type rangeProps = {
    multiSelect: boolean,
    initial?: { start: Date, end: Date },
    onChange?: ({start, end}: { start: Date, end: Date }) => void,
}

const useRange = ({onChange, multiSelect, initial}: rangeProps) => {
    const [touching, setTouching] = useState<boolean>(false)
    const [rangeMode, setRangeMode] = useState<boolean>(false)
    const [selectedRange, setSelectedRange] = useState<{ start: Date, end: Date } | undefined>(initial)

    useEffect(() => {
        document.onpointerup = () => {
            setRangeMode(false)
        }

        return () => {
            document.onpointerup = null
        }
    }, [])

    useEffect(() => {
        // console.log(selectedRange)
        if (touching && onChange && selectedRange) {
            onChange(selectedRange)
        }
    }, [selectedRange])

    const calculateRangeOfItem = useCallback((item: Date): "in" | "start" | "end" | undefined => {
        if (!selectedRange)
            return undefined
        if (selectedRange.start === selectedRange.end)
            return undefined
        if (Math.min(selectedRange.start.getDate(), selectedRange.end.getDate()) === item.getDate())
            return "start"
        if (Math.max(selectedRange.start.getDate(), selectedRange.end.getDate()) === item.getDate())
            return "end"
        if (Math.min(selectedRange.start.getDate(), selectedRange.end.getDate()) < item.getDate() && Math.max(selectedRange.start.getDate(), selectedRange.end.getDate()) > item.getDate())
            return "in"
        return undefined
    }, [selectedRange])

    const multiModeEventListener = useCallback((item: Date) => ({
        onPointerDown: () => {
            if (!rangeMode) {
                setRangeMode(true)
                setSelectedRange({start: item, end: item})
            }
        },
        onPointerEnter: () => {
            if (rangeMode)
                setSelectedRange(pre => pre?.start ? ({start: pre.start, end: item}) : undefined)
        },
        onPointerUp: () => {
            if (rangeMode) {
                setTouching(true)
                setSelectedRange(pre => pre?.start ? ({start: pre.start, end: item}) : undefined)
                setRangeMode(false)
            }
        }
    }), [rangeMode])

    const singleModeEventListener = useCallback((item: Date) => ({
        onClick: () => {
            setTouching(true)
            setSelectedRange({start: item, end: item})
        }
    }), [])

    return ({
        rangeMode,
        selectedRange,
        listener: multiSelect ? multiModeEventListener : singleModeEventListener,
        calculateRangeOfItem
    })
}

const useBadge = (dayList: Dayjs[]) => {
    const [badges, setBadges] = useState<boolean[]>(Array.from({length: dayList.length}).fill(false) as boolean[])

    useEffect(() => {
        if (dayList.length) {
            Promise.all(
                dayList.map((item) => readDayTasksCountFromDatabase(item.toDate()))
            ).then(res => setBadges(res.map(Boolean)));
        }
    }, [dayList]);

    return (badges)
}
