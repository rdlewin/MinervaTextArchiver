import React, {Component, Fragment} from 'react';
import Store from "../../store/Store";
import {observer} from 'mobx-react';
import {constants} from "../../utils/constants";
import { Redirect} from "react-router-dom";
import ModalDialog from "../modal/ModalDialog";
import axios from 'axios';
import { decode } from 'js-base64';


//  /addapp/{user_uid}/{token}/{app_id}/{app_user_uid}
@observer
class AddApp extends Component {
    state = {
        needSignIn: false,
        openError1: false,
        openError2:false,
    }
    componentDidMount() {
        console.log('register', this.props);
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
        const id = decode(user_uid);
        if (Store.user[constants.userID] == id){

            const url = `/account/add_app/${user_uid}/${token}/${app_id}/${app_user_uid}`;
            console.log('addApp post url:',url)
            try {
                const response = await axios.post(url, {},{
                    headers: {
                        authorization: 'Bearer ' + Store.user[constants.userToken],
                    }
                });

            }
            catch (e){
                this.setState({openError2:true});
            }
        }
        else{
            this.setState({openError1:true});
        }


    }


    onDialogClose(){
        window.location.replace('/');
    }

    onDialogSignIn(){
        Store.signOut();
        location.reload();
    }

    render (){

        return (
            this.state.needSignIn ?
                <Redirect to={{
                    pathname: '/signin',
                    state: { from: this.props.match.url }}}/>:
                <Fragment>
                    <ModalDialog
                        title={'User Error'}
                        content={' This link is not for the Current User. Please Sign In Again'}
                        open={this.state.openError1}
                        onCancel={this.onDialogClose}
                        onOk={this.onDialogSignIn}
                        buttonText={'Sign In'}

                    />
                    <ModalDialog
                        title={'Server Error'}
                        content={'This link has either Expired or had already been used'}
                        open={this.state.openError2}
                        onCancel={this.onDialogClose}


                    />
                </Fragment>
        )
    }
}


export default AddApp;