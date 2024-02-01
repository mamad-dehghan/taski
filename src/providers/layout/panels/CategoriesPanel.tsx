import React from 'react';
import {Input} from "../../../components/UI/input/Input";
import {Button} from "../../../components/UI/button/Button";
import {createCategory} from "../../../utils/database/category";
import {useFormik} from "formik";
import {CategoryModel} from "../../../utils/dataModels/category";
import {object} from "yup";
import {categoryValidations} from "../../../utils/modelValidations/category";
import {useToast} from "../../../utils/hooks/useToast";
import {colorOptions} from "../../theme/types";

type props = {}

export const CategoriesPanel = ({}: props) => {
  const {toast} = useToast()
    const form = useFormik<Omit<CategoryModel, "id">>({
        initialValues: {
            title: "",
            color: `#${Math.floor(Math.random()*(8**6)).toString(16)}`,
            description: ""
        },
        validationSchema: object(categoryValidations),
        onSubmit: values => {
            console.log(values);
            createCategory(values)
                .then(res=>{
                    toast("add-category+","category added successfully",colorOptions.success)
                })
                .catch((error:Error)=>{
                    toast("add-category-","category exist with same name",colorOptions.error)
                })
        }
    })
    console.log(form.values);
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <form onSubmit={form.handleSubmit} style={{display: "contents"}}>
                <Input
                    fullWidth
                    id="new-category-title"
                    name="title"
                    value={form.values.title}
                    onChange={form.handleChange}
                />
                <Input
                    fullWidth
                    id="new-category-color"
                    name="color"
                    type="color"
                    value={form.values.color}
                    onChange={form.handleChange}
                    // onChange={e => {
                    //     form.setFieldValue("color", e.currentTarget.value, true)
                    // }}
                />
                <Button
                    disabled={!form.isValid}
                >Add</Button>
            </form>
        </div>
    );
};
