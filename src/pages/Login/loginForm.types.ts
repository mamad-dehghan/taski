import * as Yup from "yup";

export type LoginFormType = {
    name: string
    email: string,
    profilePic?: string,
    preference: string
}
export const loginValidation = Yup.object().shape({
    name: Yup.string().min(3).required(),
    email: Yup.string().email(),
    profilePic: Yup.string(),
})
export const initialLoginFormValues: LoginFormType = {
    email: "",
    name: "",
    profilePic: undefined,
    preference: "{}"
}
