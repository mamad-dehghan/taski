import React, {FormEvent, useCallback, useState} from 'react';

import "./time-picker.scss"
import {Button} from "../UI/button/Button";
import {fillOptions} from "../../providers/theme/types";
import classNames from "classnames";
import dayjs from "dayjs";

const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// const hours = [1]

const convertDateToStringObj = (time?: Date) => {
    return {
        hour: dayjs(time).get("hour"),
        min: dayjs(time).get("minute"),
    }
}

type props = {
    initialTime?: Date
}

export const TimePicker = ({initialTime}: props) => {
    const [pmZone, setPmZone] = useState<boolean>(false);
    const [time, setTime] = useState<{ min: number, hour: number }>(convertDateToStringObj(initialTime))
    const onTimeChange = useCallback((type: "min" | "hour", value: string) => {
        if (!Number.isNaN(+value)) {
            setTime(prevTime => ({
                ...prevTime,
                [type]: +value
            }))
        }
    }, [])
    return (
        <div className="time-picker vertical">
            <div className="time-picker--title">Select time</div>
            <div className="time-picker--input">
                <div className="time">
                    <input className="hour"
                           value={time.hour}
                           onChange={e=>onTimeChange("hour",e.target.value)} />
                    <div className="separator">:</div>
                    <input className="minute"
                           value={time.min}
                           onChange={e=>onTimeChange("min",e.target.value)} />
                </div>
                <div className="zone">
                    <button className={classNames("am", !pmZone && "active")} onClick={() => setPmZone(false)}>Am
                    </button>
                    <button className={classNames("pm", pmZone && "active")} onClick={() => setPmZone(true)}>Pm</button>
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
            <div className="time-picker--footer">
                <Button fill={fillOptions.link}>Cancel</Button>
                <Button fill={fillOptions.link}>OK</Button>
            </div>
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
