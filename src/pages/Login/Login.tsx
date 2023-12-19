import React from 'react';
import {Label} from "../../components/UI/label/Label";
import {Input} from "../../components/UI/input/Input";
import {Button} from "../../components/UI/button/Button";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import dayjs from "dayjs";
import {initialLoginFormValues, LoginFormType, loginValidation} from "./loginForm.types";
import {fillOptions} from "../../providers/theme/types";
import "./login.scss"
import {createProfile, updateProfile} from "../../utils/database/profile";
type props = {}

export const Login = ({}: props) => {
    const navigate = useNavigate()
    const formik = useFormik<LoginFormType>({
        initialValues: initialLoginFormValues,
        validationSchema: loginValidation,
        // isInitialValid: false,
        // validateOnMount:true,
        onSubmit(values: LoginFormType) {
            createProfile(values)
            // loginApi(values)
            //     .then(res => {
            // one day
            // setCookie('token', res.token, {expires: 1, path: "/"})
            navigate(`/dashboard/calendar/week/${dayjs().format("YYYY-MM-DD")}`)
            // })
            // .catch(console.log)
        },
    })
    return (
        <div className="login-page">
            <form onSubmit={formik.handleSubmit} className="form-wrapper">
                <Label label="name" id="name">
                    <Input
                        id="name"
                        name="name"
                        hasError={formik.errors.name !== undefined}
                        supportText={formik.errors.name}
                        value={formik.values.name}
                        onChange={formik.handleChange} />
                </Label>
                <Label label="email" id="email">
                    <Input
                        autoFocus
                        id="email"
                        name="email"
                        hasError={Boolean(formik.errors.email)}
                        supportText={formik.errors.email}
                        value={formik.values.email}
                        onChange={formik.handleChange} />
                </Label>
                <div className="login-page--actions">
                <Button
                    type="button"
                    fill={fillOptions.link}
                >
                    Continue as Guest
                </Button>
                <Button
                    fullWidth
                    disabled={!formik.isValid}
                    type="submit">
                    Login
                </Button>
                </div>
            </form>
        </div>
    );
};
