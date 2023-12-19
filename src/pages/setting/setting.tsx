import React, {useLayoutEffect, useState} from 'react';
import {Input} from "../../components/UI/input/Input";
import {DexieProfileModel} from "../../utils/dataModels/profile";
import "./setting.scss"
import {readProfile} from "../../utils/database/profile";
import {ProfileSection} from "./sections/ProfileSection";
import {PreferenceSection} from "./sections/PreferenceSection";
import {Button} from "../../components/UI/button/Button";
import {UserCircle} from "@phosphor-icons/react";
import {createCategory} from "../../utils/database/category";
import {TimePicker} from "../../components/timePicker/TimePicker";
import {DatePicker} from "../../components/datePicker/DatePicker";

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
                <TimePicker />
                <DatePicker multiSelect={false}/>

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
            {/*<Label label={"primary"} id={"primary"}>*/}
            {/*    <Input id={"theme"} value={theme["--primary-hue"]} onChange={onChange("--primary-hue")} />*/}
            {/*</Label>*/}
            {/*<Divider />*/}
            {/*<Label label={"secondary"} id={"secondary"}>*/}
            {/*    <Input id={"theme"} value={theme["--secondary-hue"]} onChange={onChange("--secondary-hue")} />*/}
            {/*</Label>*/}
            {/*<Label label={"tertiary"} id={"tertiary"}>*/}
            {/*    <Input id={"theme"} value={theme["--tertiary-hue"]} onChange={onChange("--tertiary-hue")} />*/}
            {/*</Label>*/}
            {/*<input type="file" onChange={async (event) => {*/}
            {/*    // console.log(event.target.files)*/}
            {/*    if (event.target.files) {*/}
            {/*        const file = event.target.files[0];*/}
            {/*        const reader = new FileReader();*/}
            {/*        reader.onloadend = async function () {*/}
            {/*            console.log('RESULT', reader.result)*/}
            {/*        }*/}
            {/*        reader.readAsDataURL(file);*/}
            {/*        console.log(reader.result)*/}
            {/*    }*/}
            {/*    // const reader = new FileReader();*/}
            {/*    // if (event.target.value) {*/}
            {/*    //*/}
            {/*    //     reader.onloadend = function () {*/}
            {/*    //         console.log('RESULT', reader.result)*/}
            {/*    //     }*/}
            {/*    //     reader.readAsDataURL(event.target.value);*/}
            {/*    // }*/}
            {/*    // console.log(reader)*/}

            {/*}} />*/}
            {/*<Select*/}
            {/*    options={[*/}
            {/*        {*/}
            {/*            name:"firstfirstfirstfirstfirstfirstfirst",*/}
            {/*            value:1*/}
            {/*        },*/}
            {/*        {*/}
            {/*            name:"second",*/}
            {/*            value:2*/}
            {/*        },*/}
            {/*        {*/}
            {/*            name:"third",*/}
            {/*            value:3*/}
            {/*        }*/}
            {/*    ]}*/}
            {/*    id={"four"}*/}
            {/*    onChange={setSelectValue}*/}
            {/*    initialValue={selectValue}*/}
            {/*/>*/}
            {/*{*/}
            {/*    cc ?*/}
            {/*        <Menu*/}
            {/*            id="--"*/}
            {/*            fitContent*/}
            {/*            compact*/}
            {/*            items={[*/}
            {/*                {*/}
            {/*                    title: "avatar",*/}
            {/*                    leadingIcon: UserSquare,*/}
            {/*                    onClick: close*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    title: "manage cookies",*/}
            {/*                    leadingIcon: Cookie,*/}
            {/*                    subMenu: [{*/}
            {/*                        title: "sub menu-e",*/}
            {/*                        onClick: close*/}
            {/*                    }, {*/}
            {/*                        title: "sub menu2-w",*/}
            {/*                        subMenu: [{*/}
            {/*                            title: "first-n",*/}
            {/*                            onClick: close*/}
            {/*                        }, {*/}
            {/*                            title: "second-v",*/}
            {/*                            onClick: close*/}
            {/*                        }]*/}
            {/*                    }]*/}
            {/*                },*/}
            {/*                "separator",*/}
            {/*                {*/}
            {/*                    title: "launch a rocket",*/}
            {/*                    leadingIcon: RocketLaunch,*/}
            {/*                    subMenu: [{*/}
            {/*                        title: "sub menu",*/}
            {/*                        onClick: close*/}
            {/*                    }, {*/}
            {/*                        title: "sub menu2",*/}
            {/*                        subMenu: [{*/}
            {/*                            title: "first",*/}
            {/*                            onClick: close*/}
            {/*                        }, {*/}
            {/*                            title: "second",*/}
            {/*                            onClick: close*/}
            {/*                        }]*/}
            {/*                    }]*/}
            {/*                }*/}
            {/*            ]}*/}
            {/*            targetEl={cc}*/}
            {/*            open*/}
            {/*            onClose={close}*/}
            {/*        />*/}
            {/*        : <></>*/}
            {/*}*/}
            {/*<Select*/}
            {/*    options={[{*/}
            {/*    name:"first",*/}
            {/*    value:"first"*/}
            {/*},{*/}
            {/*    name:"second",*/}
            {/*    value:"second"*/}
            {/*}]}*/}
            {/*        id={"ad"}*/}
            {/*onChange={(value)=>setValue(value)}*/}
            {/*/>*/}
            {/*<DatePicker multiSelect={true} date={new Date(2023, 2, 18)}/>*/}
            {/*<Button fill={fillOptions.fill}>simple</Button>*/}
            {/*<Tooltip title={"adc"}>buisbcaiu</Tooltip>*/}
            {/*<Button fill={fillOptions.outline}>simple</Button>*/}
            {/*<Button fill={fillOptions.link}>simple</Button>*/}
            {/*<Button fill={fillOptions.tonal}>simple</Button>*/}
            {/*<Button fill={fillOptions.elevated}>simple</Button>*/}
            {/*<Checkbox color={colorOptions.success}  checked={checked} onInput={()=>{setChecked(pre=>!pre)}}/>*/}
            {/*<Radio value={"one"} name={"fios"} color={colorOptions.error}  checked={value==="one"} onChange={(e)=>{setValue(e.target.value)}}/>*/}
            {/*<Radio value={"two"} name={"fios"} color={colorOptions.primary}  checked={value==="two"} onChange={(e)=>{setValue(e.target.value)}}/>*/}
            {/*<Radio value={"three"} name={"fios"} color={colorOptions.tertiary} checked={value==="three"} onChange={(e)=>{setValue(e.target.value)}}/>*/}
            {/*<Radio value={"four"} name={"fios"} color={colorOptions.success} checked={value==="four"} onChange={(e)=>{setValue(e.target.value)}}/>*/}
            {/*<Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    hasUncheckedIcon*/}
            {/*    checkedColor={colorOptions.primary}*/}
            {/*    checked={checked}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/><Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    hasUncheckedIcon*/}
            {/*    checkedColor={colorOptions.tertiary}*/}
            {/*    checked={checked}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/><Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    hasUncheckedIcon*/}
            {/*    checkedColor={colorOptions.error}*/}
            {/*    checked={checked}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/><Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    hasUncheckedIcon*/}
            {/*    checkedColor={colorOptions.success}*/}
            {/*    checked={checked}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/><Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    hasUncheckedIcon*/}
            {/*    checkedColor={colorOptions.warning}*/}
            {/*    checked={checked}*/}
            {/*    hasCheckedIcon={false}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/><Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    hasUncheckedIcon={false}*/}
            {/*    uncheckedColor={colorOptions.error}*/}
            {/*    checked={checked}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/><Switch*/}
            {/*    // uncheckedColor={colorOptions.success}*/}
            {/*    // hasUncheckedIcon*/}
            {/*    checkedColor={colorOptions.primary}*/}
            {/*    hasCheckedIcon={false}*/}
            {/*    uncheckedColor={colorOptions.primary}*/}
            {/*    checked={checked}*/}
            {/*    onInput={()=>setChecked(pre=>!pre)}/>*/}
            {/*<IconButton Icon={X} fill={fillOptions.link} color={colorOptions.secondary} enable={false}/>*/}
            {/*<IconButton*/}
            {/*    Icon={X}*/}
            {/*    fill={fillOptions.link}*/}
            {/*    color={colorOptions.secondary}*/}
            {/*    onClick={(event) => {*/}
            {/*        if (cc) {*/}
            {/*            setCc(undefined)*/}
            {/*        } else*/}
            {/*            setCc(event.currentTarget)*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<Switch color={colorOptions.primary} disabled/>*/}
            {/*<Switch color={colorOptions.primary} checked/>*/}
            {/*<Switch color={colorOptions.primary} checked disabled/>*/}
            {/*<Checkbox disabled color={colorOptions.error} checked={false}/>*/}
            {/*<Input id={"name"} fill={fillOptions.outline} label={"name"}/>*/}
            {/*<div className="menu">*/}
            {/*    <div className="menu-item"><ChargingStation className="icon" weight={"regular"}/><span>bkiuasb</span>*/}
            {/*    </div>*/}
            {/*    <div className="menu-item">svmrgt</div>*/}
            {/*    <div className="menu-item">ln iqw wse</div>*/}
            {/*</div>*/}

            {/*<TimePicker/>*/}
        </main>
    );
};
