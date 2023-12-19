import React from 'react';
import {colorOptions} from "../../providers/theme/types";
import {v4} from "uuid";
import {Switch} from "../../components/UI/switch/Switch";

const options = [
    {
        name: "checkedColor",
        values: [colorOptions.error, colorOptions.warning, colorOptions.primary, colorOptions.tertiary, colorOptions.primary, colorOptions.secondary, colorOptions.surface]
    },
    {
        name: "uncheckedColor",
        values: [colorOptions.error, colorOptions.warning, colorOptions.primary, colorOptions.tertiary, colorOptions.primary, colorOptions.secondary, colorOptions.surface]
    },
    {
        name: "hasCheckedIcon",
        values: [true, false]
    },
    {
        name: "hasUncheckedIcon",
        values: [true, false]
    },
    {
        name: "checked",
        values: [true, false]
    },
]

type props = {}

export const SwitchPage = ({}: props) => {
    return (
        <div style={{display:"flex",flexFlow:"row wrap", gap:"0.5rem", padding:"1rem"}}>
            {
                options[0].values.map(checkedColor => (
                    options[1].values.map(uncheckedColor => (
                        options[2].values.map(hasCheckedIcon => (
                            options[3].values.map(hasUncheckedIcon => (
                                options[4].values.map(checked => (
                                    <Switch key={v4()} checkedColor={checkedColor} uncheckedColor={uncheckedColor}
                                            hasCheckedIcon={hasCheckedIcon} hasUncheckedIcon={hasUncheckedIcon}
                                            checked={checked}
                                    />
                                ))
                            ))
                        ))
                    ))
                ))
            }
        </div>
    );
};
