import React , {Component} from 'react';
import SignInScreen from "../../layout/SignInScreen";
import Store from "../../store/Store";
import {observer} from 'mobx-react';
import {constants} from "../../utils/constants";
import {autorun} from "mobx";
import { Redirect} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import ModalDialog from "../modal/ModalDialog";

//addapp/Nw/aatlyd-c65ac02e79d1dd34c06e868927d4f94b/1/NTc4ODAwNTMy

//{user_uid}/{token}/{app_id}/{app_user_uid}
@observer
class AddApp extends Component {
    state = {
        needSignIn: false,
        open: false,
    }
    componentDidMount() {

        this.checkUser();

    }

    checkUser(){
        if (!Store.signedIn){
            this.setState({needSignIn:true});
            console.log('not signed');
        }
        else{
            this.onAddApp();
        }

    }




    async onAddApp(){
        console.log('inside add app onaddApp');
        await Store.validate();
        console.log('user',Store.user[constants.userID]);
        const {user_uid, token, app_id,app_user_uid} = this.props.match.params;
        const id = atob(user_uid+'==');
        if (Store.user[constants.userID] == id){
            console.log('register', this.props.match.params);
        }
        else{
            this.setState({open:true});
        }


    }

    transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    onDialogClose(){
        // this.setState({open:false});
        window.location.replace('/');
    }

    onDialogSignIn(){
        //this.setState({open:false});
        Store.signOut();
        location.reload();
    }

    render (){

        return (
            this.state.needSignIn ?
                <Redirect to={{
                    pathname: '/signin',
                    state: { from: this.props.match.url }}}/>:
                <ModalDialog
                    title={'User Error'}
                    content={' This link is not for the Current User. Please Sign In Again'}
                    open={this.state.open}
                    onCancel={this.onDialogClose}
                    onOk={this.onDialogSignIn}
                    buttonText={'Sign In'}

                />

        )
    }
}


export default AddApp;