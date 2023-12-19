import React from 'react';
import {Divider} from "../../../components/UI/divider/Divider";
import {createProfile, updateProfile} from "../../../utils/database/profile";
import {Label} from "../../../components/UI/label/Label";
import {Input} from "../../../components/UI/input/Input";
import {Button} from "../../../components/UI/button/Button";
import {useFormik} from "formik";
import {DexieProfileModel} from "../../../utils/dataModels/profile";
import {At, User, UserCircle} from "@phosphor-icons/react";

type props = {
    profile:Omit<DexieProfileModel, "id">
}

export const ProfileSection = ({profile}: props) => {
    const profileForm = useFormik<Omit<DexieProfileModel,"id">>({
        initialValues: profile,
        onSubmit: (values) => {
            console.log(values)
            updateProfile(values)
        }
    })
    return (
        <form className="section" onSubmit={profileForm.handleSubmit}>
            <div className="section-header">
                <p className="section-title">Profile</p>
                <Divider type="fullWidth" />
            </div>
            <Label label={"name"} id={"name"}>
                <Input
                    id={"name"}
                    iconStart={<User/>}
                    value={profileForm.values.name}
                    onChange={profileForm.handleChange}
                />
            </Label>
            <Label label={"email"} id={"email"}>
                <Input
                    id={"email"}
                    iconStart={<At />}
                    value={profileForm.values.email}
                    onChange={profileForm.handleChange}
                />
            </Label>
            {/*<Label label={"profilePic"} id={"profilePic"}>*/}
            {/*    <Input id={"profilePic"} value={theme["--primary-hue"]} onChange={onChange("--primary-hue")} />*/}
            {/*</Label>*/}
            <Button type="submit">submit</Button>
        </form>
    );
};
