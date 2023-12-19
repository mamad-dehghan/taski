import React, {useState} from 'react';
import {Popup} from "../UI/popup/Popup";
import {DatePicker} from "./DatePicker";
import {Button} from "../UI/button/Button";
import {fillOptions} from "../../providers/theme/types";
import dayjs from "dayjs";

type props = {
    id: string,
    initialValue?: Date,
    multiSelect: false,
    onChange: (field: string, value: Date) => void
} | {
    id: string,
    initialValue?: [Date,Date],
    multiSelect: true,
    onChange: (field: string, value: [Date, Date]) => void
}
//TODO: add input for fix label
export const DatePickerPopup = React.memo(({multiSelect, id, onChange, initialValue}: props) => {
    const [target, setTarget] = useState<DOMRect | undefined>(undefined)
    const [value1, setValue1] = useState< [Date, Date] | [undefined, undefined]>(multiSelect? (initialValue?initialValue:[undefined,undefined]):(initialValue?[initialValue, initialValue]:[undefined,undefined]))
    // console.log(value1);
    return (
        <>
            <Button
                type="button"
                onClick={event => setTarget(event.currentTarget.getBoundingClientRect())}
                fill={fillOptions.outline}>
                {
                    value1[0] ?
                        (multiSelect ?
                            dayjs(value1[0]).format("YYYY-MM-DD") + dayjs(value1[1]).format("YYYY-MM-DD")
                            : dayjs(value1[0]).format("YYYY-MM-DD"))
                        : "Select time"
                }
            </Button>
            <Popup
                target={target}
                id={id + "date-picker-popup"}
                position={[{vertical:"bottom",horizontal:"center"},{vertical:"top",horizontal:"center"}]}
                onClose={() => setTarget(undefined)}>
                <div className="date-picker--popup-container">
                <DatePicker
                    id={id + "date-picker-popup"}
                    initial={value1[0] ? ({start: value1[0], end: value1[1]}) : undefined}
                    onChange={({start, end}) => {
                        if (multiSelect) {
                            setValue1([start, end])
                            onChange(id, [start, end])
                        } else {
                            setValue1([start, start])
                            onChange(id, start)
                        }
                        setTarget(undefined)
                    }} multiSelect={multiSelect} />
                </div>
            </Popup>
        </>
    );
});
