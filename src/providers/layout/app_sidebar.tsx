import React, {useContext, useState} from 'react';
import {themeContext} from "../theme/theme_provider";
import {IconButton} from "../../components/UI/iconButton/IconButton";
import {fillOptions} from "../theme/types";
import TaskiLogo from "/logo.svg";
import {Tooltip} from "../../components/UI/tooltip/Tooltip";
import {AppSidePanel} from "./app_side_panel";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";
import {Menu} from "../../components/UI/menu/menu";
import {Calendar, FadersHorizontal, Gear, Moon, Rows, SpotifyLogo, SunDim, UserCircle} from "@phosphor-icons/react";

type props = {}

const links = [{
    path: "dashboard/month"
}]

export enum panels {
    calendar = "calendar",
    schedule = "schedule",
    preference = "preference",
    categories = "categories"
}

export const AppSidebar = ({}: props) => {
    const navigate = useNavigate()
    const [profileMenu, setProfileMenu] = useState<HTMLElement | undefined>(undefined)
    const [activePanel, setActivePanel] = useState<panels | undefined>(undefined)
    const onsideItemClick = (item: panels) => () =>
        setActivePanel(prevState => {
            if (prevState !== item)
                return item
            else return undefined
        })
    // TODO: add active

    return (
        <div className={classNames('app-sidebar', activePanel && 'open')}>
            <div className="app-side-menu">
                <div className="top-section">
                    <img alt={"logo"} src={TaskiLogo} className="taski-logo" />
                    <Tooltip title="account">
                        <IconButton
                            dataFocused={Boolean(profileMenu)}
                            onClick={e => setProfileMenu(e.currentTarget)}
                            Icon={UserCircle}
                            fill={fillOptions.link}
                            enable={false} />
                    </Tooltip>
                    {
                        profileMenu ?
                            <Menu id={"profile-popup"}
                                  hideLeadingIcon
                                  compact
                                  fitContent
                                  onClose={() => setProfileMenu(undefined)}
                                  items={[{
                                      title: "edit profile",
                                      onClick: () => {
                                      },
                                  }, "separator", {
                                      type: "nested",
                                      title: "logout",
                                      subMenu: [{
                                          title: "in 1 top",
                                          onClick: () => {
                                          }
                                      }, {
                                          title: "in 1 center",
                                          onClick: () => {
                                          }
                                      }, {
                                          type: "nested",
                                          title: "in 1 bottom",
                                          subMenu: [{
                                              title: "in 2 top",
                                              onClick: () => {
                                              }
                                          }, {
                                              title: "in 2 bottom",
                                              onClick: () => {
                                              }
                                          }]
                                      }]
                                  }]}
                                  targetEl={profileMenu.getBoundingClientRect()}
                                  open={true} />
                            : undefined
                    }
                </div>
                <div className="center-section">
                    <Tooltip title="calendar">
                        <IconButton
                            dataFocused={activePanel === "calendar"}
                            Icon={Calendar}
                            fill={fillOptions.link}
                            onClick={onsideItemClick(panels.calendar)}
                            enable={activePanel === "calendar"} />
                    </Tooltip>
                    <Tooltip title="categories">
                        <IconButton
                            dataFocused={activePanel === "categories"}
                            Icon={Rows}
                            fill={fillOptions.link}
                            onClick={onsideItemClick(panels.categories)}
                            enable={activePanel==="categories"} />
                    </Tooltip>
                    {/*<Tooltip title="schedule">*/}
                    {/*<Tooltip title="components">*/}
                    {/*    <IconButton*/}
                    {/*        dataFocused={activePanel === "schedule"}*/}
                    {/*        Icon={Rows}*/}
                    {/*        fill={fillOptions.link}*/}
                    {/*        onClick={onsideItemClick(panels.schedule)}*/}
                    {/*        enable={false} />*/}
                    {/*</Tooltip>*/}
                    {/*<Tooltip title="preference">*/}
                    {/*    <IconButton*/}
                    {/*        dataFocused={activePanel === "preference"}*/}
                    {/*        Icon={FadersHorizontal}*/}
                    {/*        fill={fillOptions.link}*/}
                    {/*        onClick={onsideItemClick(panels.preference)}*/}
                    {/*        enable={false} />*/}
                    {/*</Tooltip>*/}
                </div>
                <div className="bottom-section">
                    <Tooltip title="calendar">
                        <IconButton onClick={() => navigate("/dashboard/calendar/month/2023-12-20")}
                                    Icon={FadersHorizontal} fill={fillOptions.link}
                                    enable={false} />
                    </Tooltip>
                    <Tooltip title="login">
                        <IconButton onClick={() => navigate("/login")} Icon={SpotifyLogo} fill={fillOptions.link}
                                    enable={false} />
                    </Tooltip>
                    <Tooltip title="settings">
                        <IconButton onClick={() => navigate("/dashboard/setting")} Icon={Gear} fill={fillOptions.link}
                                    enable={false} />
                    </Tooltip>
                    <DarkModeButton />
                </div>
                {/*<SidebarItem name={"first"} Icon={DiamondsFour}/>*/}
                {/*<SidebarItem name={"second"} Icon={DiamondsFour}/>*/}
                {/*<SidebarItem name={"third"} Icon={Calendar}/>*/}
                {/*<SidebarItem name={"fourth"} Icon={CalendarCheck}/>*/}
                {/*<SidebarItem name={"fifth"} Icon={Command}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.tonal} enable={true}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.tonal} enable={false}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.fill} enable={true}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.fill} enable={false}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.outline} enable={true}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.outline} enable={false}/>*/}
                {/*<IconButton Icon={UserCircle} fill={fillOptions.link} enable={true}/>*/}
                {/*<IconButton Icon={Article} fill={fillOptions.link} enable={false}/>*/}
                {/*<IconButton Icon={Cards} fill={fillOptions.link} enable={false}/>*/}
            </div>
            <AppSidePanel active={activePanel} />
        </div>
    );
};

const DarkModeButton = () => {
    const {darkMode, setDarkMode} = useContext(themeContext)
    return (
        <Tooltip title={darkMode ? "light mode" : "dark mode"}>
            <IconButton Icon={darkMode ? SunDim : Moon}
                        onClick={() => setDarkMode(!darkMode)}
                        fill={fillOptions.link}
                        enable={false}
            />
        </Tooltip>
    )
}
