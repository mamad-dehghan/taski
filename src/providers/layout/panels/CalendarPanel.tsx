import {DatePicker} from "../../../components/datePicker/DatePicker";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {TaskModel} from "../../../utils/dataModels/task";
import {convertToTaskModel, readDayTasksFromDatabase, readTasksFromDatabase} from "../../../utils/database/task";

export const CalendarPanel = () => {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [tasks, setTasks] = useState<TaskModel[]>([])
    useEffect(() => {
        if (selectedDay)
            readDayTasksFromDatabase(
                dayjs(dayjs(selectedDay).format("YYYY-MM-DD")).toDate()
            ).then(r => {
                setTasks(r.map(convertToTaskModel) as TaskModel[])
            })
        else setTasks([])
    }, [selectedDay])
    return (
        <>
            <DatePicker
                multiSelect={false}
                onChange={({start}) => {
                    setSelectedDay(start)
                }}
            />
            {
                tasks.map(item =>
                    <span key={item.id}>{item.title}/{item.description}</span>
                ).reduce((a,b)=><>{a} <br/> {b}</>,<></>)
            }
        </>
    )
}
