import React, {useCallback, useId} from 'react';
import {Dialog, DialogActions, DialogBody, DialogHelpText, DialogTitle} from "../UI/dialog/Dialog";
import {Button} from "../UI/button/Button";
import {Label} from "../UI/label/Label";
import {Input} from "../UI/input/Input";
import {useFormik} from "formik";
import {TaskModel} from "../../utils/dataModels/task";
import {taskValidations} from "../../utils/modelValidations/task";
import {object} from "yup";
import {colorOptions, fillOptions} from "../../providers/theme/types";
import {DatePickerPopup} from "../datePicker/DatePickerPopup";
import {Select} from "../UI/select/Select";
import dayjs from "dayjs";
import {updateTaskInDatabase} from "../../utils/database/task";
import {useLiveQuery} from "dexie-react-hooks";
import {readAllCategories} from "../../utils/database/category";
import {TagInput} from "../tagInput/TagInput";
import {DateAndTimePicker} from "../DateAndTimePicker/DateAndTimePicker";
import {Shrink} from "../UI/Shrink/Shrink";
import {Switch} from "../UI/switch/Switch";

type props = {
    // id: string,
    open: boolean,
    onClose: () => void,
    onSubmit?: () => void,
    task: TaskModel
}

export const EditTodoDialog = ({ open, task, onClose}: props) => {
    const categories = useLiveQuery(readAllCategories,[open])??[]
    // console.log(categories)
    const id = useId()
    // console.log(categories)
    const form = useFormik<TaskModel>({
        initialValues: task,
        validationSchema: object().shape(taskValidations),
        onSubmit: values => {
            updateTaskInDatabase(values)
                .then(console.log)
                .catch(console.log)
                .finally(onClose)
        }
    })

    const handleDatePickerChange = useCallback((field: "startTime" | "endTime") => {
        return (value:Date) =>
            form.setFieldValue(field, value)
    }, [])

    // console.log(form.values.title)
    // console.log(dayjs(form.values.startTime).format("HH:mm:ss"))
    return (
        <Dialog open={open} onClose={onClose} id={id}>
            <form style={{display: "contents"}} onSubmit={form.handleSubmit}>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogHelpText>{task.description}</DialogHelpText>
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
                    </Label>
                    <Label label={"priority"} id={"priority"}>
                        <Select
                            id={"priority"}
                            // color={colorOptions.secondary}
                            value={form.values.priority}
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
                            // color={colorOptions.secondary}
                            value={form.values.categoryId}
                            options={categories.map(c => ({value: c.id, name: c.title}))}
                            onChange={(value) => form.setFieldValue("categoryId", value)}
                        />
                    </Label>
                    <Label label="start time" id="startTime">
                        <DateAndTimePicker
                            value={form.values.startTime}
                            onChange={handleDatePickerChange("startTime")}
                            sections={form.values.isAllDay ? ["date"] : ["time","date"]}
                        />
                    </Label>
                    <Label label={"All day"} id={"isAllDay"}>
                        <Switch id={"isAllDay"} checked={form.values.isAllDay} onChange={form.handleChange} />
                    </Label>
                    <Shrink direction={"up"} active={form.values.isAllDay}>
                        <Label label="end time" id="endTime">
                            <DateAndTimePicker
                                value={form.values.endTime}
                                onChange={handleDatePickerChange("endTime")}
                            />
                        </Label>
                    </Shrink>
                </DialogBody>
                <DialogActions>
                    <Button fill={fillOptions.outline} onClick={onClose} type="reset">cancel</Button>
                    <Button disabled={!form.isValid} type="submit">edit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
