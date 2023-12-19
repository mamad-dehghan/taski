import React from "react";
import {ACell} from "./components/cell/ACell";
import {CalendarShowModel} from "./utils/calendar/calendar";

// const days: { day: number, weekDay: "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" }[] = [
//     {day: 1, weekDay: "Sat"}, {day: 2, weekDay: "Sun"}, {
//         day: 3,
//         weekDay: "Mon"
//     }, {day: 4, weekDay: "Tue"}, {day: 5, weekDay: "Wed"}, {
//         day: 6,
//         weekDay: "Thu"
//     }, {day: 7, weekDay: "Fri"}, {day: 8, weekDay: "Sat"}, {
//         day: 9,
//         weekDay: "Sun"
//     }, {day: 1, weekDay: "Mon"}, {day: 11, weekDay: "Tue"}, {
//         day: 12,
//         weekDay: "Wed"
//     }, {day: 13, weekDay: "Thu"}, {day: 14, weekDay: "Fri"}, {
//         day: 15,
//         weekDay: "Sat"
//     }, {day: 16, weekDay: "Sun"}, {day: 17, weekDay: "Mon"}, {
//         day: 18,
//         weekDay: "Tue"
//     }, {day: 19, weekDay: "Wed"}, {day: 20, weekDay: "Thu"}, {
//         day: 21,
//         weekDay: "Fri"
//     }, {day: 22, weekDay: "Sat"}, {day: 23, weekDay: "Sun"}, {
//         day: 24,
//         weekDay: "Mon"
//     }, {
//         day: 25,
//         weekDay: "Tue"
//     }, {day: 26, weekDay: "Wed"}, {day: 27, weekDay: "Thu"}, {
//         day: 28,
//         weekDay: "Fri"
//     }, {day: 29, weekDay: "Sat"}, {day: 30, weekDay: "Sun"}, {
//         day: 31,
//         weekDay: "Mon"
//     }]

function App() {
    return (
        <div className="container" style={{height:"100%", backgroundColor:"inherit"}}>
            {/*<ACell showModel="day" />*/}
            {/*<ACell showModel="week" />*/}
            <ACell showModel={CalendarShowModel.month} theDay={new Date(new Date().setMonth(6))} />
            {/*<ACell showModel="schedule" />*/}
        </div>
    )
}

export default App
