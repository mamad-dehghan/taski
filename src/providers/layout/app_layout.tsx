import React, {useState} from 'react';
import {AppHeader} from "./app_header";
import {AppSidebar} from "./app_sidebar";
import {Outlet} from "react-router-dom";

import './app_layout.scss'
import {FAB} from "../../components/UI/fab/FAB";
import {Tooltip} from "../../components/UI/tooltip/Tooltip";
import {PlusCircle} from "@phosphor-icons/react";
import {AddTodoDialog} from "../../components/dialogs/AddTask";
import {CalendarProvider} from "../calendarContext/CalendarProvider";

type props = {}

const AppLayout = ({}: props) => {
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    return (
        <div className='app-layout'>
            <CalendarProvider>
            <AppHeader />
            <AppSidebar />
            <div className='app scroller'>
                <Outlet />
            </div>
            <div className="add-todo-fab">
                <Tooltip title="add task">
                    <FAB onClick={() => setOpenAdd(true)}>
                        <PlusCircle />
                        {/*<IconButton Icon={PlusCircle} fill={fillOptions.link}*/}
                        {/*            enable={false} />*/}
                    </FAB>
                </Tooltip>
            </div>
            <AddTodoDialog
                id={`add-todo`}
                open={openAdd}
                onClose={() => {
                    setOpenAdd(false)
                }} />
            </CalendarProvider>
        </div>
    );
};

export default AppLayout;
