import "./acell.scss"
import classNames from "classnames";
import {memo, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {useDayObject} from "../../utils/calendar/day";
import {useWeekObject} from "../../utils/calendar/week";
import {useMonthObject} from "../../utils/calendar/month";
import {CalendarShowModel} from "../../utils/calendar/calendar";
import {useNavigate} from "react-router-dom";
import {Button} from "../UI/button/Button";
import {fillOptions} from "../../providers/theme/types";
import {TaskModel} from "../../utils/dataModels/task";
import dayjs, {Dayjs} from "dayjs";
import {convertToTaskModel, readDayTasksFromDatabase} from "../../utils/database/task";
import {ShowTaskDialog} from "../dialogs/ShowTask";
import {useLiveQuery} from "dexie-react-hooks";
import {CalendarContext} from "../../providers/calendarContext/calendarContext";

const day0 = Array.from({length: 1}).map((_a, i) => i)
const seven = Array.from({length: 7}).map((_a, i) => i)
const mon = Array.from({length: 42 - 7}).map((_a, i) => i)
const sch = Array.from({length: 29}).map((_a, i) => i)

type props = {
    // startDay?: Date,
    theDay: Date,
    showModel: CalendarShowModel
}

export const ACell = ({theDay, showModel}: props) => {
    const navigate = useNavigate()
    const {dayjsLocal} = useContext(CalendarContext)
    const [day, setDay] = useState<Dayjs>(dayjsLocal(dayjs(theDay)))
    useEffect(() => {
        console.log(theDay)
        setDay(dayjsLocal(dayjs(theDay)))
    }, [theDay]);

    // console.log(dayTask, "day task");
    const monthObject = useMonthObject(day)
    const weekObject = useWeekObject(day)
    const dayModel = useDayObject(day)

    const daysList = useMemo<Dayjs[]>(() => {
        // TODO: change to model => date obj,
        switch (showModel) {
            case CalendarShowModel.day:
                return dayModel
            case CalendarShowModel.week:
                return weekObject
            case CalendarShowModel.month:
                return monthObject
            case CalendarShowModel.schedule:
                return monthObject
        }
    }, [showModel, dayModel, weekObject, monthObject])
    const [dayTask, setDayTask] = useState<TaskModel[][]>(Array.from({length: daysList.length}).fill([]) as [][])

    useLiveQuery(() => Promise.all(
        daysList.map(item => readDayTasksFromDatabase(item.toDate()))
    ).then(res => setDayTask(res.map(i => i.map(convertToTaskModel)) as TaskModel[][])))
    // console.log(o)
    // useLayoutEffect(() => {
    //     Promise.all(
    //         daysList.map(readDayTasksFromDatabase)
    //     ).then(res => setDayTask(res.map(i => i.map(convertToTaskModel)) as TaskModel[][]));
    //     // readTasksFromDatabase(
    //     //     dayjs(dayjs(daysList[0]).format("YYYY-MM-DD")).toDate(),
    //     //     dayjs(dayjs(daysList.at(-1)).format("YYYY-MM-DD")).toDate()
    //     // )
    //     //     .then(res => {
    //     //         console.log(res);
    //     //         setDayTask(res.map(convertToTaskModel as TaskModel[]).reduce((list, a) => {
    //     //             const dayOfTask = dayjs(a.startTime).format("YYYY-MM-DD");
    //     //             if (list[dayOfTask]) {
    //     //                 list[dayOfTask].push(a)
    //     //                 return list
    //     //             } else {
    //     //                 return {...list, [dayOfTask]: [a]}
    //     //             }
    //     //         }, {})
    //     //     })
    //     // getAllTasks()
    //     //     .then(setDayTask)
    // }, [daysList]);

    // console.log(dayTask)
    const headerDays = useHeader(showModel, day)

    // console.log(createWeekObject(models.monthModel.firstDay).dayList, "??")
    // console.log(models.weekModel)
    return (
        <div className={classNames(
            "calendar-table",
            `${showModel}-view`
        )}>
            <div className="calendar-table--top">
                {
                    headerDays.map((_t, i) =>
                        <div key={`top-${i}`}
                             className={classNames(
                                 "calendar-table--top--cell",
                                 {
                                     // "selected-day": _t.toDateString() === theDay.toDateString(),
                                     // "today": _t.toDateString() === new Date().toDateString(),
                                 }
                             )}>
                            <h6 className="name">{_t.format("ddd")}</h6>
                            <Button
                                onClick={() => navigate(`/dashboard/calendar/day/${dayjs(_t).format("YYYY-MM-DD")}`)}
                                fill={_t.format("YYYY-MM-DD") === dayjsLocal(dayjs()).format("YYYY-MM-DD") ? fillOptions.outline : fillOptions.link}
                                round className="number">{_t.get('date')}</Button>
                        </div>
                    )
                }
            </div>
            <div className="calendar-table--corner" />
            <div className="calendar-table--side">
                {
                    Array.from({length: 24}).map((_t, i) => (
                        <div key={i}
                             className="calendar-table--side--hour-cell">
                            <span className="calendar-table--side--hour-cell-content">
                            {(i % 12) + 1} {i < 11 ? "AM" : "PM"}
                            </span>
                        </div>
                    ))
                }
            </div>
            <div className="calendar-table--days">
                {
                    daysList.map((item, index) => (
                        <OneDay key={item.toJSON()}
                                tasks={dayTask[index]}
                                view={showModel}
                                day={item}
                                thisMonth={true} />
                    ))
                }
            </div>
        </div>
    )
}

type oneDay = {
    day: Dayjs,
    tasks?: TaskModel[],
    thisMonth: boolean,
    view: CalendarShowModel
}
const OneDay = ({day, tasks = [], thisMonth, view}: oneDay) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const navigate = useNavigate()

    const todos = useMemo(() =>
        (tasks.map((task, index) => [task, tasks.length - index]) as [TaskModel, number][]).reduceRight((A, b) => (
                <Wrap>
                    <div className={`tt ${b[1] === 1 ? "last" : ""}`}>
                        <SingleTodo
                            view={view}
                            key={`${b[0].id} ${b[1]}`}
                            task={b[0]}
                        />
                        <span className="other">and {b[1]} other todo(s)</span>
                    </div>
                    {A}
                </Wrap>
            ),
            <></>
        ), [tasks])

    return (
        <div className="day-c"
            // data-day={day.toLocaleDateString()}
        >
            <div className="calendar-table--days--day-details">
                <h6 className="week">{day.format("ddd")}</h6>
                <Button
                    fill={day.format("YYYY-MM-DD") === dayjsLocal(dayjs()).format("YYYY-MM-DD") ? fillOptions.outline : fillOptions.link}
                    onClick={() => navigate(`/dashboard/calendar/day/${dayjs(day).format("YYYY-MM-DD")}`)}
                    className="day" round>{day.get('date')}
                </Button>
            </div>
            <div className="calendar-table--days--task--wrapper" style={{overflowY: "hidden"}}>

                {/*baraye day => bashe*/}
                {/*baraye week => bashe*/}
                {/*baraye month => nabashe*/}
                {/*baraye schedule => nabashe*/}

                {
                    todos
                }

                {/*{*/}
                {/*    // Array.from({length: 24}).map((_t, i) =>*/}
                {/*    Array.from({length: Math.floor(Math.random() * 20)}).map((_t, i) =>*/}
                {/*        // remove this*/}
                {/*        <div key={i} className="calendar-table--days--hour-cell">*/}
                {/*            <div className="calendar-table--days--day-cell--day-number"></div>*/}
                {/*            TODO: add task*/}
                {/*        </div>*/}
                {/*    )*/}
                {/*}*/}
            </div>
        </div>
    )
}

const Wrap = (props: { children?: ReactNode }) => <div
    className="calendar-table--days--task--single-task-wrapper">{props?.children}</div>
type singleTodoProps = {
    task: TaskModel,
    view: CalendarShowModel
}
const SingleTodo = memo(({task, view}: singleTodoProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    // console.log(task.title, `${dayjs(task.endTime).diff(dayjs(task.startTime)) / (10 * 60 * 60 * 24)}%`)
    return (
        <>
            <span
                className="content"
                data-hour={task.startTime.getHours()}
                style={{
                    top: (view === CalendarShowModel.day || view === CalendarShowModel.week) ? `${100 * (task.startTime.getHours() + task.startTime.getMinutes() / 60) / 24}%` : undefined,
                    height: (view === CalendarShowModel.day || view === CalendarShowModel.week) ? `${dayjs(task.endTime).diff(dayjs(task.startTime)) / (10 * 60 * 60 * 24)}%` : undefined,
                    maxHeight: "-webkit-fill-available",
                    minHeight: "1.75rem"
                }}
                onClick={() => setOpenModal(true)}>
                {task.title}
            </span>
            <ShowTaskDialog
                id={`show-todo-${task.id}`}
                open={openModal}
                task={task}
                onClose={() => {
                    setOpenModal(false)
                }} />
        </>
    )
})
const useHeader = (model: CalendarShowModel, date: Dayjs): Dayjs[] => {
    const {dayjsLocal} = useContext(CalendarContext)
    // const [week, setWeek] = useState<Dayjs[]>(calcHeader(dayjsLocal, model, date))
    const week1 = useWeekObject(dayjsLocal(dayjs(date).startOf("month")));
    // console.log("change in header")
    // const [list, setList] = useState<Dayjs[]>([])
    // useEffect(() => {
    //     // const firstDay = dayjs(date).startOf("month")
    //     setWeek(calcHeader(dayjsLocal, model, date))
    // }, [model, date, dayjsLocal]);

    return (model === CalendarShowModel.day ? [week1[0]] : week1)
}

// const calcHeader = (dayjsLocal: (a: Dayjs) => Dayjs, model: CalendarShowModel, date: Dayjs) => {
//     return (model === CalendarShowModel.day ? [week1[0]] : week1)
// }
