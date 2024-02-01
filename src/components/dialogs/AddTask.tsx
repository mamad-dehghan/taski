import React, {useCallback, useEffect} from 'react';
import {Dialog, DialogActions, DialogBody, DialogHelpText, DialogTitle} from "../UI/dialog/Dialog";
import {Button} from "../UI/button/Button";
import {Label} from "../UI/label/Label";
import {Input} from "../UI/input/Input";
import {useFormik} from "formik";
import {TaskModel} from "../../utils/dataModels/task";
import {taskValidations} from "../../utils/modelValidations/task";
import {object} from "yup";
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {Select} from "../UI/select/Select";
import {createTaskInDatabase} from "../../utils/database/task";
import {useLiveQuery} from "dexie-react-hooks";
import {readAllCategories} from "../../utils/database/category";
import {Switch} from "../UI/switch/Switch";
import {Shrink} from "../UI/Shrink/Shrink";
import {DateAndTimePicker} from "../DateAndTimePicker/DateAndTimePicker";
import {TagInput} from "../tagInput/TagInput";
import {useToast} from "../../utils/hooks/useToast";
// import * as utils from "utils"

type props = {
    id: string,
    open: boolean,
    onClose: () => void,
    onSubmit?: () => void,
    initialValues: Partial<Omit<TaskModel, "id">>,
}
const defaultInitialValues: Omit<TaskModel, "id"> = {
    title: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(Date.now() + 2340000),
    File: undefined,
    tags: "",
    priority: "low",
    isDone: false,
    isAllDay: false,
    categoryId: undefined
}

export const AddTodoDialog = ({id, initialValues, open, onClose}: props) => {
    const categories = useLiveQuery(readAllCategories,[open]) ?? [];
    const {toast} = useToast()
    // console.log(initialValues.startTime,'start')
    const form = useFormik<Omit<TaskModel, "id">>({
        initialValues: {...defaultInitialValues, ...initialValues},
        validationSchema: object().shape(taskValidations),
        onSubmit: values => {
            createTaskInDatabase(values)
                //add toast
                .then(e => {
                    toast('success-add', 'رویداد با موفقیت اضافه شد.', colorOptions.success)
                    onClose()
                })
                .catch((e: Error) => {
                    toast('failed-add', e.message, colorOptions.error)
                    console.log(e.message)
                    console.log(e.cause)
                })
            // .finally(onClose)
        }
    })
    useEffect(() => form.resetForm(), [open]);
    // console.log(form.errors)
    // console.log(form.values)
    // console.log(form.values.categoryId)

    const handleDatePickerChange = useCallback((field: "startTime" | "endTime") => {
        return (value:Date) =>
            form.setFieldValue(field, value)
    }, [])

    return (
        <Dialog id={id} open={open} onClose={onClose}>
            <form style={{display: "contents"}} onSubmit={form.handleSubmit}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogHelpText>Creating a new task</DialogHelpText>
                <DialogBody>
                    <Label label={"title"} id={"title"}>
                        <Input
                            autoFocus
                            id={'title'}
                            name={'title'}
                            value={form.values.title}
                            hasError={form.errors['title'] !== undefined}
                            supportText={form.errors['title']}
                            onChange={form.handleChange} />
                    </Label>
                    <Label label={"description"} id={"description"}>
                        <Input
                            id={'description'}
                            name={'description'}
                            value={form.values.description}
                            hasError={form.errors['description'] !== undefined}
                            supportText={form.errors['description']}
                            onChange={form.handleChange} />
                    </Label>
                    <Label label={"tags"} id={"tags"}>
                        <TagInput
                            id={'tags'}
                            name={'tags'}
                            value={form.values.tags || ""}
                            hasError={form.errors['tags'] !== undefined}
                            supportText={form.errors['tags']}
                            onChange={(value: string) => form.setFieldValue("tags", value, true)}
                        />
                        {/*<Input*/}
                        {/*    id={'tags'}*/}
                        {/*    name={'tags'}*/}
                        {/*    value={form.values.tags}*/}
                        {/*    hasError={form.errors['tags'] !== undefined}*/}
                        {/*    supportText={form.errors['tags']}*/}
                        {/*    onChange={form.handleChange} />*/}
                    </Label>
                    <Label label={"priority"} id={"priority"}>
                        <Select
                            fill={fillOptions.outline}
                            id={"priority"}
                            initialValue={"low"}
                            options={[
                                {name: "low", value: "low"},
                                {name: "medium", value: "medium"},
                                {name: "high", value: "high"},
                            ]}
                            onChange={(value) => form.setFieldValue("priority", value)} />
                    </Label>
                    <Label label={"category"} id={"category"}>
                        <Select
                            id={"category"}
                            value={form.values.categoryId}
                            options={categories.map(c => ({value: c.id, name: c.title}))}
                            onChange={(value) => form.setFieldValue("categoryId", value)}
                        />
                    </Label>
                    {/*TODO: fix when set date time will reset*/}
                    <Label label="start time" id="startTime">
                        <DateAndTimePicker
                            value={form.values.startTime}
                            onChange={handleDatePickerChange("startTime")}
                            sections={form.values.isAllDay ? ["date"] : ["time","date"]}
                        />
                        {/*<input type={"time"}*/}
                        {/*       id={"startTime"}*/}
                        {/*       value={dayjs(form.values.startTime).format("HH:mm:ss")}*/}
                        {/*       onChange={event => form.setFieldValue("startTime", dayjs(`${dayjs(form.values.startTime).format("YYYY-MM-DD")} ${event.target.value}`, "YYYY-MM-DD hh:mm:ss").toDate())} />*/}
                        {/*/!*onChange={event => form.setFieldValue("startTime", new Date(new Date(form.values.startTime).setHours(+event.target.value.split(":")[0], +event.target.value.split(":")[1], +event.target.value.split(":")[2])))} />*!/*/}
                        {/*<DatePickerPopup id={"startTime"} multiSelect={false} onChange={form.setFieldValue}*/}
                        {/*                 initialValue={form.values.startTime} />*/}
                    </Label>
                    <Label label={"All day"} id={"isAllDay"}>
                        <Switch id={"isAllDay"} checked={form.values.isAllDay} onChange={form.handleChange} />
                    </Label>
                    <Shrink direction={"up"} active={form.values.isAllDay}>
                        <Label label="end time" id="endTime">
                            {/*<input type={"time"}*/}
                            {/*       id={"endTime"}*/}
                            {/*       value={dayjs(form.values.endTime).format("HH:mm:ss")}*/}
                            {/*       onChange={event => form.setFieldValue("endTime", dayjs(`${dayjs(form.values.endTime).format("YYYY-MM-DD")} ${event.target.value}`, "YYYY-MM-DD hh:mm:ss").toDate())} />*/}
                            {/*onChange={event => form.setFieldValue("endTime", new Date(new Date(form.values.endTime).setHours(+event.target.value.split(":")[0], +event.target.value.split(":")[1], +event.target.value.split(":")[2])))} />*/}
                            {/*<DatePickerPopup id={"endTime"} multiSelect={false} onChange={form.setFieldValue}*/}
                            {/*                 initialValue={form.values.endTime} />*/}
                            <DateAndTimePicker
                                value={form.values.endTime}
                                onChange={handleDatePickerChange("endTime")}
                            />
                        </Label>
                    </Shrink>
                </DialogBody>
                <DialogActions>
                    <Button fill={fillOptions.link} onClick={onClose} type="button">cancel</Button>
                    <Button disabled={!form.isValid} type="submit">create</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
