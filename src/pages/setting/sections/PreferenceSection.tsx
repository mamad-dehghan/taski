import {DexieProfileModel} from "../../../utils/dataModels/profile";
import {Divider} from "../../../components/UI/divider/Divider";
import {Label} from "../../../components/UI/label/Label";
import {Input} from "../../../components/UI/input/Input";
import {Button} from "../../../components/UI/button/Button";
import React from "react";
import {useFormik} from "formik";
import {readProfile, updateProfile} from "../../../utils/database/profile";
import {useTheme} from "../../../utils/hooks/useTheme";
import {colorOptions} from "../../../providers/theme/types";
import {ColorTranslator} from "colortranslator";


type props = {
    preference: Omit<DexieProfileModel, "id">["preference"]
}

export const PreferenceSection = ({preference}: props) => {
    console.log(preference)
    const {overrideTheme} = useTheme()
    const preferenceForm = useFormik<Record<string, string>>({
        initialValues: JSON.parse(preference),
        onSubmit: (values) => {
            console.log(values)
            overrideTheme({
                "--primary-hue": +values?.["primary"],
                "--secondary-hue": +values?.["secondary"],
                "--tertiary-hue": +values?.["tertiary"],
            })
        }
    })
    // console.log(new ColorTranslator('hsl(50 20% 90% / 0.5)').HEX)
    // console.log(`hsl(${Math.floor(+preferenceForm.values["primary"]?? 0)} 0% 0% / 1)`)
    // console.log(new ColorTranslator(`hsl(${preferenceForm.values["primary"]?? 0}, 0%, 0%)`).HEX)
    // console.log(new ColorTranslator(`hsl(${Math.floor(+preferenceForm.values["primary"]?? 0)} 0% 0% / 1)`).H)
    console.log(preferenceForm.values["primary"],new ColorTranslator({h:+preferenceForm.values["primary"],s:"34%",l:"48%"}).HEX)
    return (
        <form className="section" onSubmit={preferenceForm.handleSubmit}>
            <div className="section-header">
                <p className="section-title">Preference</p>
                <Divider type="fullWidth" />
            </div>
            <Label label={"primary"} id={"primary"}>
                {/*<Input id={"primary"}*/}
                {/*       value={preferenceForm.values["primary"] ?? 0}*/}
                {/*       onChange={(event) => preferenceForm.setFieldValue("primary", +event.target.value)}*/}
                {/*/>*/}
            <Input
                id={"primary"}
                // fullWidth
                type={"color"}
                value={new ColorTranslator({h:+preferenceForm.values["primary"],s:"34%",l:"48%"}).HEX}
                // onInput={e=>preferenceForm.setFieldValue("primary",new ColorTranslator(e.currentTarget.value).H)}
                onChange={e => {
                    console.log(e.currentTarget.value)
                    preferenceForm.setFieldValue("primary", new ColorTranslator(e.currentTarget.value).H)
                }}
                // iconEnd={<div style={{width:"1em",height:"1em", aspectRatio:"1",borderRadius:"1em",backgroundColor:"red"}} > </div>}
            />
            </Label>
            <Label label={"secondary"} id={"secondary"}>
                <Input id={"secondary"}
                       color={colorOptions.secondary}
                       value={preferenceForm.values["secondary"] ?? 0}
                       onChange={(event) => preferenceForm.setFieldValue("secondary", +event.target.value)}
                />
            </Label>
            <Label label={"tertiary"} id={"tertiary"}>
                <Input id={"tertiary"}
                       color={colorOptions.tertiary}
                       value={preferenceForm.values["tertiary"] ?? 0}
                       onChange={(event) => preferenceForm.setFieldValue("tertiary", +event.target.value)}
                />
            </Label>
            {/*<Label label={"name"} id={"name"}>*/}
            {/*    <Input id={"name"}*/}
            {/*           value={preferenceForm.values.name}*/}
            {/*           onChange={preferenceForm.handleChange}*/}
            {/*    />*/}
            {/*</Label>*/}
            {/*<Label label={"email"} id={"email"}>*/}
            {/*    <Input id={"email"}*/}
            {/*           value={preferenceForm.values.email}*/}
            {/*           onChange={preferenceForm.handleChange}*/}
            {/*    />*/}
            {/*</Label>*/}
            {/*<Label label={"profilePic"} id={"profilePic"}>*/}
            {/*    <Input id={"profilePic"} value={theme["--primary-hue"]} onChange={onChange("--primary-hue")} />*/}
            {/*</Label>*/}
            <Button type="submit">submit</Button>
        </form>
    )
}
