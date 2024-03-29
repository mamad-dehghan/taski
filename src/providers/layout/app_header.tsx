import React, {useCallback, useContext} from 'react';
import {Tooltip} from "../../components/UI/tooltip/Tooltip";
import {IconButton} from "../../components/UI/iconButton/IconButton";
import {ArrowCircleLeft, ArrowCircleRight, MagnifyingGlass} from "@phosphor-icons/react";
import {fillOptions} from "../theme/types";
import {CalendarContext} from "../calendarContext/calendarContext";
import {Select} from "../../components/UI/select/Select";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {SearchBar} from "./SearchBar/SearchBar";

type props = {}

export const AppHeader = ({}: props) => {
    const {mode, day, dayjsLocal} = useContext(CalendarContext)
    const navigate = useNavigate()
    const handleChangeMode = useCallback((mode: string) => {
        navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
    }, [day])

    const goToPrevious = useCallback(() => {
        switch (mode) {
            case "day":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).subtract(1, "day").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
                break
            case "week":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).subtract(1, "week").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
                break
            case "month":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).subtract(1, "month").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
                break
            case "schedule":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).subtract(1, "month").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
        }
    }, [day, mode])

    const goToNext = useCallback(() => {
        switch (mode) {
            case "day":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).add(1, "day").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
                break
            case "week":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).add(1, "week").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
                break
            case "month":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).add(1, "month").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
                break
            case "schedule":
                navigate(`/dashboard/calendar/${mode}/${dayjsLocal(dayjs(day)).add(1, "month").calendar('gregory').locale('en').format("YYYY-MM-DD")}`)
        }
    }, [day, mode])
    // console.log(mode)

    return (
        <div className="app-header">
            <div className="left-section">
                {
                    mode && day ?
                        <>
                        <IconButton
                            fill={fillOptions.link}
                            Icon={ArrowCircleLeft}
                            onClick={goToPrevious}
                        />
                        <Select<string> options={[
                            {name: "day", value: "day"},
                            {name: "week", value: "week"},
                            {name: "month", value: "month"},
                            {name: "schedule", value: "schedule"}
                        ]}
                                        value={mode}
                                        id={"calendar-mode-header"}
                                        onChange={handleChangeMode} />
                        <IconButton
                            fill={fillOptions.link}
                            Icon={ArrowCircleRight}
                            onClick={goToNext}
                        />
                        </>
                        : undefined
                }
                {/*<span>icon</span>*/}
            </div>
            <div className="right-section">
                <SearchBar/>
            </div>
        </div>
    );
};
