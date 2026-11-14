import React, {useContext} from "react";
import {ACell} from "../../components/cell/ACell";
import {ScheduleView} from "../../components/schedule/ScheduleView";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";
import {CalendarShowModel} from "../../utils/calendar/calendar";

export const Calendar = () => {
    const {mode, day} = useContext(CalendarContext)
    if (!day || !mode)
        return <></>

    if (mode === CalendarShowModel.schedule)
        return <ScheduleView key={day.toJSON() + mode} />

    return (
        <ACell key={day.toJSON() + mode} showModel={mode} theDay={day} />
    );
};
