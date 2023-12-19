import React from 'react';
import {Dialog} from "../UI/dialog/Dialog";
import {Button} from "../UI/button/Button";
import {Label} from "../UI/label/Label";
import {Input} from "../UI/input/Input";
import {useFormik} from "formik";
import {TaskModel} from "../../utils/dataModels/task";
import {taskValidations} from "../../utils/modelValidations/task";
import {object} from "yup";
import {fillOptions} from "../../providers/theme/types";
import {DatePickerPopup} from "../datePicker/DatePickerPopup";
import {Select} from "../UI/select/Select";
import dayjs from "dayjs";
import {updateTaskInDatabase} from "../../utils/database/task";

type props = {
    id: string,
    open: boolean,
    onClose: () => void,
    onSubmit?: () => void,
    task: TaskModel
}

export const EditTodoDialog = ({id, open, task, onClose}: props) => {
    const form = useFormik({
        initialValues: task,
        validationSchema: object().shape(taskValidations),
        onSubmit: values => {
            updateTaskInDatabase(values)
                .then(console.log)
                .catch(console.log)
                .finally(onClose)
        }
    })
    // console.log(form.values.title)
    // console.log(dayjs(form.values.startTime).format("HH:mm:ss"))
    return (
        <Dialog open={open} onClose={onClose} id={id}>
            <form style={{display: "contents"}} onSubmit={form.handleSubmit}>
                <Dialog.Title>{task.title}</Dialog.Title>
                <Dialog.HelpText>{task.description}</Dialog.HelpText>
                <Dialog.Body>
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
                        <Input
                            id={'tags'}
                            name={'tags'}
                            value={form.values.tags}
                            hasError={form.errors['tags'] !== undefined}
                            supportText={form.errors['tags']}
                            onChange={form.handleChange} />
                    </Label>
                    <Label label={"priority"} id={"priority"}>
                        <Select
                            id={"priority"}
                            initialValue={"low"}
                            options={[
                                {name: "low", value: "low"},
                                {name: "medium", value: "medium"},
                                {name: "high", value: "high"},
                            ]}
                            onChange={(value) => form.setFieldValue("priority", value)} />
                    </Label>
                    <Label label="start time" id="startTime">
                        <input type={"time"}
                               id={"startTime"}
                               value={dayjs(form.values.startTime).format("HH:mm:ss")}
                               onChange={event=>form.setFieldValue("startTime", dayjs(`${dayjs(form.values.startTime).format("YYYY-MM-DD")} ${event.target.value}`,"YYYY-MM-DD hh:mm:ss").toDate())} />
                                {/*onChange={event => form.setFieldValue("startTime", new Date(new Date(form.values.startTime).setHours(+event.target.value.split(":")[0], +event.target.value.split(":")[1], +event.target.value.split(":")[2])))} />*/}
                        <DatePickerPopup id={"startTime"} multiSelect={false} onChange={form.setFieldValue}
                                         initialValue={form.values.startTime} />
                    </Label>
                    <Label label="end time" id="endTime">
                        <input type={"time"}
                               id={"endTime"}
                               value={dayjs(form.values.endTime).format("HH:mm:ss")}
                               onChange={event => form.setFieldValue("endTime", new Date(new Date(form.values.endTime).setHours(+event.target.value.split(":")[0], +event.target.value.split(":")[1], +event.target.value.split(":")[2])))} />
                        <DatePickerPopup id={"endTime"} multiSelect={false} onChange={form.setFieldValue}
                                         initialValue={form.values.endTime} />
                    </Label>
                </Dialog.Body>
                <Dialog.Actions>
                    <Button fill={fillOptions.outline} onClick={onClose} type="reset">cancel</Button>
                    <Button disabled={!form.isValid} type="submit">edit</Button>
                </Dialog.Actions>
            </form>
        </Dialog>
    );
};
