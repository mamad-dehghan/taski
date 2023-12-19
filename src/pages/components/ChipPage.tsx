import React from 'react';
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {v4} from "uuid";
import {AssistChip, FilterChip} from "../../components/UI/chip/Chip";
import {Airplane} from "@phosphor-icons/react";

const options1 = [
    {
        name: "fill",
        values: [fillOptions.outline, fillOptions.elevated]
    },
    {
        name: "iconSide",
        values: ["start", "end"]
    },
    {
        name: "disabled",
        values: [true, false]
    },
]

const options2 = [
    {
        name: "fill",
        values: [fillOptions.outline, fillOptions.elevated]
    },
    {
        name: "enable",
        values: [true, false]
    },
    {
        name: "disabled",
        values: [true, false]
    }
]

type props = {}

export const ChipPage = ({}: props) => {
    return (
        <div style={{display:"flex",flexFlow:"row wrap", gap:"0.5rem", padding:"1rem"}}>
            {
                options1[0].values.map(fill => (
                    options1[1].values.map(iconSide => (
                    options1[2].values.map(disabled => (
                            <AssistChip key={v4()} assist={true} icon={Airplane} fill={fill} iconSide={iconSide} disabled={disabled}>
                                button
                            </AssistChip>
                    ))
                    ))
                ))
            }
            {
                options2[0].values.map(fill => (
                        options2[1].values.map(enable => (
                        options2[2].values.map(disabled => (
                            <FilterChip key={v4()} filter={true} fill={fill} disabled={disabled} enable={enable}>
                                button
                            </FilterChip>
                        ))
                    ))
                ))
            }
        </div>
    );
};
