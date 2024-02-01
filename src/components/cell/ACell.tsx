import "./acell.scss"
import classNames from "classnames";
import {
    CSSProperties,
    forwardRef,
    memo,
    ReactNode,
    useContext,
    useDeferredValue,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
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
import {EditTodoDialog} from "../dialogs/EditTask";
import {Tooltip} from "../UI/tooltip/Tooltip";
import {readCategoryById} from "../../utils/database/category";
import {CategoryModel} from "../../utils/dataModels/category";

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
        setDay(dayjsLocal(dayjs(theDay)))
    }, [theDay]);

    const monthObject = useMonthObject(day)
    const weekObject = useWeekObject(day)
    const dayModel = useDayObject(day)

    const daysList = useMemo<Dayjs[]>(() => {
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
    ).then(res => setDayTask(res.map(i => i.map(convertToTaskModel)) as TaskModel[][])), [daysList], [])

    const headerDays = useMemo(() => {
        switch (showModel) {
            case CalendarShowModel.day:
                return dayModel
            case CalendarShowModel.week:
                return weekObject
            case CalendarShowModel.month:
                return weekObject
            case CalendarShowModel.schedule:
                return []
        }
    }, [showModel, dayModel, weekObject, monthObject])

    const showModalState = useRef<handleEditType>(null)

    return (
        <>
            <ShowModal ref={showModalState} />
            {
                showModalState.current
                    ? <div className={classNames(
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
                                            onClick={() => navigate(`/dashboard/calendar/day/${dayjs(_t).calendar("gregory").locale('en').format("YYYY-MM-DD")}`)}
                                            fill={_t.format("YYYY-MM-DD") === dayjsLocal(dayjs()).format("YYYY-MM-DD") ? fillOptions.outline : fillOptions.link}
                                            round className="number">{_t.get('date')}</Button>
                                        {
                                            (showModel === CalendarShowModel.day || showModel === CalendarShowModel.week) ?
                                                <div className="calendar-table--top--cell--day-task-wrapper">
                                                    {
                                                        dayTask[i].filter(task => task.isAllDay).map(task =>
                                                            <SingleTodo
                                                                key={task.id}
                                                                task={task}
                                                                view={showModel}
                                                                openShowModal={() => showModalState.current!.setShowModalState(task)}
                                                            />
                                                        )
                                                    }
                                                </div>
                                                : <></>
                                        }
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
                                            thisMonth={true}
                                            setShowModalState={showModalState.current!.setShowModalState}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    : undefined
            }
        </>
    )
}

type oneDay = {
    day: Dayjs,
    tasks?: TaskModel[],
    thisMonth: boolean,
    view: CalendarShowModel,
    setShowModalState: (task: TaskModel | undefined) => void,
}
const OneDay = ({day, tasks = [], thisMonth, view, setShowModalState}: oneDay) => {
    const {dayjsLocal} = useContext(CalendarContext)
    const navigate = useNavigate()

    const todos = useMemo(() =>
        tasks
            .filter(task => (view === CalendarShowModel.day || view === CalendarShowModel.week) ? !task.isAllDay : true)
            .map<[TaskModel, number]>((task, index) => [task, tasks.length - index])
            .reduceRight((A, b) => (
                    <Wrap>
                        <div className={`tt ${b[1] === 1 ? "last" : ""}`}>
                            <SingleTodo
                                key={`${b[0].id} ${b[1]}`}
                                view={view}
                                task={b[0]}
                                openShowModal={() => setShowModalState(b[0])}
                            />
                            <span className="other">and {b[1]} other todo(s)</span>
                        </div>
                        {A}
                    </Wrap>
                ),
                <></>
            ), [tasks, view])

    return (
        <div className="day-c"
            // data-day={day.toLocaleDateString()}
        >
            <div className="calendar-table--days--day-details">
                <h6 className="week">{day.format("ddd")}</h6>
                <Button
                    fill={day.format("YYYY-MM-DD") === dayjsLocal(dayjs()).format("YYYY-MM-DD") ? fillOptions.outline : fillOptions.link}
                    onClick={() => navigate(`/dashboard/calendar/day/${dayjs(day).calendar("gregory").locale('en').format("YYYY-MM-DD")}`)}
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
    view: CalendarShowModel,
    openShowModal: () => void
}
const SingleTodo = memo(({task, view, openShowModal}: singleTodoProps) => {
    const taskCategory = useLiveQuery(() => readCategoryById(task.categoryId), [task.categoryId])
    const {dayjsLocal} = useContext(CalendarContext)

    return (
        <span
            style={{
                ...((task.isAllDay || view === CalendarShowModel.month || view === CalendarShowModel.schedule) ? {} : {
                    top: `${100 * (task.startTime.getHours() + task.startTime.getMinutes() / 60) / 24}%`,
                    height: `${dayjs(task.endTime).diff(dayjs(task.startTime)) / (10 * 60 * 60 * 24)}%`,
                    maxHeight: "-webkit-fill-available",
                }),
                minHeight: "1.75rem",
                //TODO: multi line ellipsis
                //TODO: check for multi task
                // @ts-ignore
                '--category-color': taskCategory?.color
            }}
            className="content"
        >
            <Tooltip title={<TaskRichTooltip task={task} category={taskCategory}
                                             timeFormatted={dayjsLocal(dayjs(task.startTime)).format('YYYY-MM-DD hh:mm')} />}>
            {/*<span className="another-content"*/}
                {/*    data-hour={task.startTime.getHours()}*/}
                {/*    style={{*/}
                {/*        // top: (view === CalendarShowModel.day || view === CalendarShowModel.week) ? `${100 * (task.startTime.getHours() + task.startTime.getMinutes() / 60) / 24}%` : undefined,*/}
                {/*        // height: (view === CalendarShowModel.day || view === CalendarShowModel.week) ? `${dayjs(task.endTime).diff(dayjs(task.startTime)) / (10 * 60 * 60 * 24)}%` : undefined,*/}
                {/*        // maxHeight: "-webkit-fill-available",*/}
                {/*        // minHeight: "1.75rem",*/}
                {/*        //TODO: multi line ellipsis*/}
                {/*        //TODO: check for multi task*/}
                {/*        // @ts-ignore*/}
                {/*        // '--category-color': 'red'*/}
                {/*}}>*/}
                <div
                    className={classNames("inside-of-content", task.isDone && "done")}
                    onClick={openShowModal}
                >
                {task.title}
                </div>
                {/*</span>*/}
            </Tooltip>
        </span>
    )
})
type handleEditType = {
//     // showTaskElement: JSX.Element,
    setShowModalState: (task: TaskModel | undefined) => void,
}

const ShowModal = memo(forwardRef<handleEditType, {}>(({}, ref) => {
    const [task, setShowModalState] = useState<TaskModel | undefined>(undefined)
    const [showOpenState, setShowOpenState] = useState<boolean>(false)
    const [editOpenState, setEditOpenState] = useState<boolean>(false)
    useImperativeHandle(ref, () => ({
        setShowModalState: (task: TaskModel | undefined) => {
            setShowModalState(task)
            setEditOpenState(false)
            setTimeout(
                () => setShowOpenState(true)
                , 10
            )
        }
    }), [])
    const deferShowOpenState = useDeferredValue(showOpenState)
    if (!task && !deferShowOpenState)
        return <></>
    return (
        <>
            <ShowTaskDialog
                open={showOpenState}
                task={task}
                onClose={() => {
                    setShowOpenState(false)
                }}
                onOpenEditDialog={() => {
                    setShowOpenState(false)
                    setEditOpenState(true)
                }}
            />
            <EditTodoDialog
                key={task?.id}
                open={editOpenState}
                onClose={() => {
                    // setShowModalState(undefined)
                    setEditOpenState(false)
                }}
                task={task!}
            />
        </>
    )
}))

type taskTooltipType = { category?: CategoryModel, task: TaskModel, timeFormatted: string }
const TaskRichTooltip = ({category, task, timeFormatted}: taskTooltipType) => {
    return (
        <span style={{'--category-color': category?.color} as CSSProperties} className="task-rich-tooltip">
                <span className="task-rich-tooltip--category">{category?.title}</span>
            <span className="task-rich-tooltip--content">
                <span className="task-rich-tooltip--title"><b>{task.title}</b></span>
                <span className="task-rich-tooltip--priority"><b>Priority:</b> {task.priority}</span>
                <span className="task-rich-tooltip--time"><b>Start Time:</b> {timeFormatted}</span>
            </span>
        </span>
    )
}
