import React, {useContext, useMemo, useState} from 'react';
import {AppHeader} from "./app_header";
import {AppSidebar} from "./app_sidebar";
import {Outlet} from "react-router-dom";
import {CalendarProvider} from "../calendarContext/CalendarProvider";
import {Tooltip} from "../../components/UI/tooltip/Tooltip";
import {FAB} from "../../components/UI/fab/FAB";
import {PlusCircle} from "@phosphor-icons/react";
import {AddTodoDialog} from "../../components/dialogs/AddTask";
import {CalendarContext} from "../calendarContext/calendarContext";
import './app_layout.scss'
import dayjs from "dayjs";

type props = {}

const AppLayout = ({}: props) => {
    return (
        <div className='app-layout'>
            <CalendarProvider>
                <AppHeader />
                <AppSidebar />
                <div className='app scroller'>
                    <Outlet />
                </div>
                <AddTodoFab />
            </CalendarProvider>
        </div>
    );
};

export default AppLayout;

const AddTodoFab = () => {
    const {mode, day} = useContext(CalendarContext)
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const startTime = useMemo(() => day ?
        dayjs(day).set('hour', (new Date()).getHours()).set('minute', (new Date()).getMinutes())
        : undefined, [day])
    if (!day || !mode)
        return <></>
    // console.log(startTime?.toDate().toJSON())
    // console.log(startTime?.toDate().toJSON())
    return (
        <>
            <div className="add-todo-fab">
                <Tooltip title="add task">
                    <FAB onClick={() => setOpenAdd(true)}>
                        <PlusCircle />
                    </FAB>
                </Tooltip>
            </div>
            <AddTodoDialog
                key={startTime?.toDate().toString()}
                initialValues={{
                    startTime: startTime?.toDate(),
                    endTime: startTime?.add(1,'hour').toDate(),
                }}
                id={`add-todo`}
                open={openAdd}
                onClose={() => {
                    setOpenAdd(false)
                }} />
        </>

    )
}
