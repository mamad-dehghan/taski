import React, {useEffect} from 'react';
import {colorOptions} from "../../providers/theme/types";
import {Dialog} from "../../components/UI/dialog/dialog";
import {useToast} from "../../utils/hooks/useToast";
import {useDialog} from "../../utils/hooks/useDialog";
import {Divider} from "../../components/UI/divider/divider";


export const Setting = () => {
    const {toast} = useToast();
    const {addDialog, closeDialog} = useDialog();
    useEffect(() => {
        toast("Setting", "this is a toast", colorOptions.primary)
        addDialog("1", (<Dialog>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.HelpText>Lorem ipsum dolor sit amet, consectetur.</Dialog.HelpText>
            <Divider/>
            <Dialog.Body>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam!</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae!
                </div>
            </Dialog.Body>
            <Divider/>
            <Dialog.Actions>
                <button onClick={() => closeDialog("1")}>Close</button>
                <button>Submit</button>
            </Dialog.Actions>
        </Dialog>))
        addDialog("2", (<Dialog>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.HelpText>Lorem ipsum dolor sit amet, consectetur.</Dialog.HelpText>
            <Divider/>
            <Dialog.Body>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam!</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae!
                </div>
            </Dialog.Body>
            <Divider/>
            <Dialog.Actions>
                <button onClick={() => closeDialog("2")}>Close</button>
                <button>Submit</button>
            </Dialog.Actions>
        </Dialog>))
        addDialog("3", (<Dialog>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.HelpText>Lorem ipsum dolor sit amet, consectetur.</Dialog.HelpText>
            <Divider/>
            <Dialog.Body>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam!</div>
                <div style={{height: "20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam.</div>
            </Dialog.Body>
            <Divider/>
            <Dialog.Actions>
                <button onClick={() => closeDialog("3")}>Close</button>
                <button>Submit</button>
            </Dialog.Actions>
        </Dialog>))
    }, [])
    return (
        <main>

        </main>
    );
};
