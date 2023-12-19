import React from 'react';
import {Label} from "../../components/UI/label/Label";
import {Input} from "../../components/UI/input/Input";
import {initialLoginFormValues, LoginFormType, loginValidation} from "../login/loginForm.types";
import {FormikHelpers, useFormik} from "formik";
import {useRequest} from "../../utils/hooks/useRequest";
import {Button} from "../../components/UI/button/Button";

import "../login/login.scss"
import {signUpApi} from "../../utils/api/auth";
import {setCookie} from "typescript-cookie";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";

export const SignUpPage = () => {
    const navigate = useNavigate()
    const {mutate} = useRequest()
    const formik = useFormik<LoginFormType>({
        initialValues: initialLoginFormValues,
        validationSchema: loginValidation,
        // isInitialValid: false,
        // validateOnMount:true,
        onSubmit(values: LoginFormType, formikHelpers: FormikHelpers<LoginFormType>) {
            signUpApi(values)
                .then(res => {
                    // one day
                    setCookie('token', res.token, {expires: 1, path: "/"})
                    navigate(`/dashboard/calendar/week/${dayjs().format("YYYY-MM-DD")}`)
                })
                .catch(console.log)
            // mutate('login', () =>
            //     apiClient.post('/auth/login', values).then((res) => res.data)
            // );
        },
    })
    return (
        <div className="login-page">
            <form onSubmit={formik.handleSubmit} className="form-wrapper">
                <Label label="email" id="email">
                    <Input
                        id="email"
                        name="email"
                        hasError={formik.errors.email !== undefined}
                        supportText={formik.errors.email ?? ""}
                        value={formik.values.email}
                        onChange={formik.handleChange} />
                </Label>
                <Label label="password" id="password">
                    <Input
                        id="password"
                        name="password"
                        hasError={formik.errors.password !== undefined}
                        supportText={formik.errors.password ?? ""}
                        value={formik.values.password}
                        onChange={formik.handleChange} />
                </Label>
                <Button
                    disabled={formik.errors.email !== undefined || formik.errors.password !== undefined}
                    type="submit">
                    SignUp
                </Button>
            </form>
        </div>
    );
};
