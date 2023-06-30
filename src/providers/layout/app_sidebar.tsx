import React, {useContext, useState} from 'react';
import {SidebarItem} from "../../components/UI/sidebarItem/sidebarItem";
import {Bus, Calendar, CalendarCheck, Command, DiamondsFour, Icon, Moon, SunDim} from "@phosphor-icons/react";
import {themeContext} from "../theme/theme_provider";

type props = {}


const links=[{
    path:"dashboard/month"
}]

export const AppSidebar = ({}: props) => {
    return (
        <div className='app-sidebar'>
            <SidebarItem name={"first"} Icon={DiamondsFour}/>
            <SidebarItem name={"second"} Icon={DiamondsFour}/>
            <SidebarItem name={"third"} Icon={Calendar}/>
            <SidebarItem name={"fourth"} Icon={CalendarCheck}/>
            <SidebarItem name={"fifth"} Icon={Command}/>
            <DarkModeButton />
        </div>
    );
};

const DarkModeButton = ()=>{
    const {darkMode, setDarkMode} = useContext(themeContext)
    return(
        <div className={`sidebar-item close ${darkMode?"active":""}`}
             onClick={()=>setDarkMode(!darkMode)}
        >
            {
                darkMode?
                    <SunDim size={24} weight="regular"/>
                    :
                    <Moon size={24} weight="regular"/>
            }
        </div>
    )
}
