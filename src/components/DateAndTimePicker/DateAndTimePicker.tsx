import React, {useCallback, useContext, useEffect, useId, useState} from 'react';
import {DatePicker} from "../datePicker/DatePicker";
import dayjs from "dayjs";
import {TimePicker} from "../timePicker/TimePicker";
import {Button} from "../UI/button/Button";
import {fillOptions} from "../../providers/theme/types";
import {Popup} from "../UI/popup/Popup";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";
import "./dateAndTimePicker.scss";

type sectionTypes = "time" | "date"
type props = {
    buttonId?: string,
    sections?: Array<sectionTypes>,
    onChange: (date: Date) => void,
    // onClose: () => void,
    value: Date
}

export const DateAndTimePicker = ({buttonId, value, sections = ["date", "time"], onChange}: props) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const id = useId()
    const [innerValue, setInnerValue] = useState<Date>(value)
    const [target, setTarget] = useState<DOMRect | undefined>(undefined)
    // const handleChange = useCallback((value:Date)=>{
    //     setInnerValue(value)
    // },[])
    useEffect(() => {
        setInnerValue(value)
    }, [value]);
    console.log(sections.join(','), '--')
    // @ts-ignore
    const onSubmit = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        // e.preventDefault()
        // console.log(innerValue, "in")
        console.log(innerValue)
        onChange(innerValue)
        setTarget(undefined)
    }, [innerValue])
    // console.log(innerValue, "out")

    return (
        <>
            <Button
                id={buttonId}
                type="button"
                onClick={event => {
                    setTarget(event.currentTarget.getBoundingClientRect());
                }}
                fill={fillOptions.outline}>
                {
                    innerValue ?
                        dayjsLocal(dayjs(innerValue)).format(
                            !sections.includes("time")
                                ? "YYYY-MM-DD"
                                : sections.includes("date")
                                    ? "YYYY-MM-DD hh:mm"
                                    : "hh:mm"
                        )
                        : "Select time"
                }
            </Button>
            <Popup
                // key={sections.join(',')}
                target={target}
                // open={openState === "date"}
                id={id + "date-date-time-picker-popup"}
                position={[{vertical: "bottom", horizontal: "center"}, {vertical: "top", horizontal: "center"}]}
                onClose={() => {
                    // onChange(initialValue);
                    setTarget(undefined)
                }}
            >
                <div className="date-and-time-picker">
                    <Inside key={sections.join(',')} sections={sections} value={innerValue} onChange={setInnerValue} />
                    <div className="date-and-time-picker--actions">
                        <Button
                            fill={fillOptions.link}
                            onClick={() => {
                                setInnerValue(value);
                                setTarget(undefined)
                            }}
                        >Cancel</Button>
                        <Button
                            // type={"submit"}
                            fill={fillOptions.link}
                            onClick={onSubmit}
                        >OK</Button>
                    </div>
                </div>
            </Popup>
        </>
    );
};

type insideProps = {
    value: Date,
    onChange: (date: Date) => void,
    sections: Array<sectionTypes>
}
const Inside = ({value, sections, onChange}: insideProps) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const [innerValue, setInnerValue] = useState<Date>(value)
    const [openState, setOpenState] = useState<"time" | "date">(sections.includes("date") ? "date" : "time")
    useEffect(() => {
        onChange(innerValue)
    }, [innerValue]);
    console.log(sections)

    return (
        <>
            {
                openState === "date"
                    ?
                    <DatePicker
                        multiSelect={false}
                        initialDate={innerValue}
                        onChange={({start}) => {
                            const newDate = dayjsLocal(dayjs(start));
                            setInnerValue(
                                dayjsLocal(
                                    dayjs(innerValue)
                                        .set('year', newDate.get('year'))
                                        .set('month', newDate.get('month'))
                                        .set('date', newDate.get('date'))
                                )
                                    .toDate()
                            );
                            if (sections.includes("time"))
                                setOpenState("time")
                            // console.log("date-",newDate.toDate())
                            // console.log(
                            //     dayjs()
                            //     // newDate.get('month')
                            //     // dayjs(value)
                            //         // .set('year', newDate.get('year'))
                            //         // .set('month', newDate.get('month'))
                            //         .set('date', newDate.get('dateay'))
                            //     .toDate()
                            // )
                        }}
                    />
                    :
                    <TimePicker
                        value={innerValue}
                        onChange={(time) => {
                            const newDate = dayjsLocal(dayjs(time));
                            // console.log(time)
                            setInnerValue(
                                dayjsLocal(dayjs(innerValue))
                                    .set('hour', newDate.get('hour'))
                                    .set('minute', newDate.get('minute'))
                                    .toDate()
                            )
                        }}
                    />
            }
        </>
    )
}
