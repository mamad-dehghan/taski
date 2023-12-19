import {useParams} from "react-router-dom";
import {CalendarShowModel, findDateFromParams} from "../../utils/calendar/calendar";
import {useContext, useMemo} from "react";
import {ACell} from "../../components/cell/ACell";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";

export const Calendar = () => {
    const {mode,day} = useContext(CalendarContext)
    if (!day || !mode)
        return <></>

    return (
        <ACell key={day.toJSON()+mode} showModel={mode} theDay={day} />
    );
};
