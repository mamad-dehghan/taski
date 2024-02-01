import React, {useCallback, useEffect, useState} from 'react';

import "./time-picker.scss"
import classNames from "classnames";
import dayjs from "dayjs";

const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// const hours = [1]

const convertDateToStringObj = (time?: Date) => {
    const hour = dayjs(time).get("hour")
    return {
        hour: hour % 12,
        min: dayjs(time).get("minute"),
        pmZone: hour > 12
    }
}

type props = {
    initialTime?: Date,
    onChange: (time: Date) => void,
    value: Date,
}

export const TimePicker = ({initialTime, onChange, value}: props) => {
    const [time, setTime] = useState<{
        min: number,
        hour: number,
        pmZone: boolean
    }>(convertDateToStringObj(initialTime ?? value))
    const onTimeChange = useCallback((type: "min" | "hour", value: string) => {
        if (!Number.isNaN(+value)) {
                const newTime = {
                    ...time,
                    [type]: +value
                }
                onChange(dayjs().set('minute', newTime.min).set('hour',newTime.hour + (newTime.pmZone ? 12 : 0)).toDate())
                // console.log(dayjs().set('minute', newTime.min).set('hour',newTime.hour + (newTime.pmZone ? 12 : 0)).toDate())
                // console.log(dayjs([newTime.min, newTime.hour + (newTime.pmZone ? 12 : 0)].join(","), "hour,minute").toDate())
            setTime(prevTime => {
                return newTime
            })
            // onChange(dayjs({hour:time.hour,min:time.min}).toDate())
        }
    }, [time])
    const onZoneChange = useCallback((value: boolean) => {
            const newTime = {
                ...time,
                pmZone: value
            }
            onChange(dayjs().set('minute', newTime.min).set('hour',newTime.hour + (newTime.pmZone ? 12 : 0)).toDate())
            console.log(dayjs().set('minute', newTime.min).set('hour',newTime.hour + (newTime.pmZone ? 12 : 0)).toDate())
        setTime(prevTime => {
            return newTime
        })
        // onChange(dayjs({hour:time.hour,min:time.min}).toDate())
    }, [time])
    useEffect(() => {
        setTime(convertDateToStringObj(value));
    }, [value]);
    return (
        <div className="time-picker vertical">
            <div className="time-picker--title">Select time</div>
            <div className="time-picker--input">
                <div className="time">
                    <input className="hour"
                           min={0}
                           max={11}
                           // type="text" inputmode="numeric" pattern="[0-9]*"
                           type={"number"}
                           value={time.hour}
                           onChange={e => onTimeChange("hour", e.target.value)} />
                    <div className="separator">:</div>
                    <input className="minute"
                           type={"number"}
                           min={0}
                           max={59}
                           value={time.min}
                           onChange={e => onTimeChange("min", e.target.value)} />
                </div>
                <div className="zone">
                    <button className={classNames("am", !time.pmZone && "active")} onClick={() => onZoneChange(false)}>Am
                    </button>
                    <button className={classNames("pm", time.pmZone && "active")} onClick={() => onZoneChange(true)}>Pm
                    </button>
                </div>
            </div>
            {/*<div className="time-picker--visual">*/}
            {/*    <div className="hours-wrapper">*/}
            {/*        <div className="sikh"></div>*/}
            {/*        <div className="center"></div>*/}
            {/*        {*/}
            {/*            hours.map(hour => (*/}
            {/*                <HourInTimePicker key={hour} hour={hour}/>*/}
            {/*            ))*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="time-picker--footer">*/}
            {/*    <Button fill={fillOptions.link}>Cancel</Button>*/}
            {/*    <Button fill={fillOptions.link}>OK</Button>*/}
            {/*</div>*/}
        </div>
    );
};

type hourProps = {
    hour: number
}

const HourInTimePicker = ({hour}: hourProps) => {
    return (
        <button className="hour-wrapper">
            <div className="hour">
                {hour}
            </div>
        </button>
    )
}
