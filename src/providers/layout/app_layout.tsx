import React from 'react';
import {AppHeader} from "./app_header";
import {AppSidebar} from "./app_sidebar";
import {Outlet} from "react-router-dom";

import './app_layout.scss'

type props = {}

const AppLayout = ({}: props) => {
    return (
        <div className='app-layout'>
            <AppHeader/>
            <AppSidebar/>
            <div className='app'>
                <Outlet/>
            </div>
        </div>
    );
};

export default AppLayout;
