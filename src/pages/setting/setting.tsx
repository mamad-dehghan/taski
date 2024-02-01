import React, {ChangeEvent, useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {DexieProfileModel} from "../../utils/dataModels/profile";
import "./setting.scss"
import {readProfile} from "../../utils/database/profile";
import {ProfileSection} from "./sections/ProfileSection";
import {PreferenceSection} from "./sections/PreferenceSection";
import {DatePicker} from "../../components/datePicker/DatePicker";
import {X} from "@phosphor-icons/react";
import {fillOptions} from "../../providers/theme/types";
import {FilterChip} from "../../components/UI/chip/Chip";
import {Input} from "../../components/UI/input/Input";

export const Setting = () => {
    const [profile, setProfile] = useState<DexieProfileModel>()
    useLayoutEffect(() => {
        (async () => {
            const profile = await readProfile()
            setProfile(profile)
        })()
    }, []);
    const [categoryInput, setCategoryInput] = useState<string>("")
    const [colorInput, setColorInput] = useState<string>("#fff")
    // console.log(categoryInput)
    // console.log((colorInput))
    // const [checked, setChecked] = useState<boolean>(false)
    // const [value, setValue] = useState("one")
    // const [cc, setCc] = useState<HTMLElement | undefined>(undefined)

    // const {overrideTheme, theme} = useTheme()
    // const o =useLiveQuery(()=>readTasksFromDatabase(dayjs("2023-9-20", "YYYY-MM-DD").toDate(), dayjs("2023-11-30", "YYYY-MM-DD").toDate()))
    // console.log(o)
    // console.log(readTasksFromDatabase(dayjs("2023-9-20", "YYYY-MM-DD").toDate(), dayjs("2023-11-30", "YYYY-MM-DD").toDate()))
    // const close = useCallback(()=>{
    //     // console.log("close")
    //     setCc(undefined)
    // },[])
    // const onChange = useCallback((variable: keyof themeT) => ({target: {value}}: { target: { value: string } }) => {
    //     console.log(value)
    //     if (!isNaN(+value))
    //         overrideTheme({[variable]: +value})
    // }, [])

    return (
        <main className="setting-page">
            {/*<Input*/}
            {/*    id={"assac"}*/}
            {/*    value={categoryInput}*/}
            {/*    fullWidth*/}
            {/*    iconEnd={<UserCircle />}*/}
            {/*    onInput={e => setCategoryInput(e.currentTarget.value)}*/}
            {/*/>*/}
            {/*<Input*/}
            {/*    id={"aegr"}*/}
            {/*    fullWidth*/}
            {/*    type={"color"}*/}
            {/*    value={colorInput}*/}
            {/*    onInput={e => setColorInput(e.currentTarget.value)}*/}
            {/*    // iconEnd={<div style={{width:"1em",height:"1em", aspectRatio:"1",borderRadius:"1em",backgroundColor:"red"}} > </div>}*/}
            {/*/>*/}
            {/*<Button icon={<UserCircle />} fullWidth*/}
            {/*        onClick={() => {*/}
            {/*            createCategory({title: categoryInput, color: colorInput})*/}
            {/*        }}*/}
            {/*>add category</Button>*/}
            <div style={{display: "flex"}}>
                {/*<TimePicker />*/}
                <DatePicker multiSelect={false} />
            </div>
            {
                profile
                    ? <ProfileSection profile={profile} />
                    : undefined
            }
            {
                profile?.preference
                    ? <PreferenceSection preference={profile.preference} />
                    : undefined
            }

        </main>
    );
};
