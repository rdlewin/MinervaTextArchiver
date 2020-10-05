import React, {Component, Fragment} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import {Copyright, doSignIn} from "../utils/utils";
import Container from '@material-ui/core/Container';
import withStyles from "@material-ui/core/styles/withStyles";
import { decode } from 'js-base64';
import axios from "axios";
import ModalDialog from "../components/modal/ModalDialog";
import CircularProgress from "@material-ui/core/CircularProgress";

// /register/{user_uid}/{token}


const styles = (theme) => ({
    logo:{
        backgroundImage: 'url("/images/minerva.png")',
        backgroundRepeat : 'no-repeat',
        backgroundSize: 'cover',
        width : '300px',
        height: '200px',
        margin: theme.spacing(1),

    },

    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#9370db',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {

        position: 'fixed',
        top: '50%',
        left: '50%',

        '& > * + *': {


        },
    },
});

class RegisterScreen extends Component {
    state = {
        username: '',
        email: '',
        password1: '',
        password2: '',
        errors:{
            username: '',
            email: '',
            password1: '',
            password2: ''
        },
        formError:'',
        openError:false,
        openSuccess:false,
        loading:true,

    };

    componentDidMount() {
       this.getUserInfo();
    }

    onInputChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        const error = this.validate(name,value);
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            newState.errors = {...prevstate.errors};
            newState.errors[name] = error;
            return newState;
        });
    };

    validate = (name,value) =>{
        let error;
        switch (name){
            case 'username':
                if (value.length < 4){
                    error = 'User Name Must be at least 4 letters. ';
                }
                break;
            case 'email':
                const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
                if (!regex.test(value)){
                    error = 'Please Enter a Valid E-Mail';
                }
                break;
            case 'password1':
                if (value.length < 6){
                    error = 'User Name Must be at least 6 letters. ';
                }
                break;
            case 'password2':
                if (this.state.password1 !== value){
                    error = 'Passwords are not the same'
                }
                break;
        }


        return error;
    }


    onSubmitLogin = e =>{
        e.preventDefault();
        const {errors} = this.state;
        let errorFound = false;
        Object.keys(errors).forEach (prop=>{
            if (errors[prop]){

                this.setState({formError:'Form Still Has Errors.'});
                errorFound = true;
                return false;
            }


        });

        if (errorFound){
            return;
        }
        this.setState({formError:''});

        this.registerUser();
    }

    async getUserInfo(){
        const {user_uid, token} = this.props.match.params;
        const id = decode(user_uid);
        const url = `/account/register/${user_uid}/${token}`;
        console.log('register- post url:',url);

        try {
            const response = await axios.get(url);
            this.setState({
                username: response.data.username
            });
            this.setState({loading:false});
        }
        catch (e){
            this.setState({openError:true});
        }
    }

    async registerUser(){
        const {user_uid, token} = this.props.match.params;
        const id = decode(user_uid);
        const url = `/account/register/${user_uid}/${token}`;
        console.log('register- post url:',url);
        const postObj = {
            username: this.state.username,
            password: this.state.password1
        };
        try {
            const response = await axios.post(url, postObj);
            await doSignIn(this.state.username,this.state.password1);
            this.setState({openSuccess:true});

        }
        catch (e){
            this.setState({openError:true});
        }

    }

    onDialogClose(){

        window.location.replace('/');
    }

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                {this.state.loading?
                    <div className={classes.root}>
                        <CircularProgress />
                    </div>:

                    <Container component="main" maxWidth="xs" >
                        <CssBaseline />
                        <div className={classes.paper}>
                            <div className={classes.logo}/>
                            <Avatar className={classes.avatar}>
                                <FaceIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Register To Minerva
                            </Typography>
                            <form
                                className={classes.form}

                                onSubmit={this.onSubmitLogin}
                            >
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="User Name"
                                    name="username"
                                    autoComplete="off"
                                    autoFocus
                                    value={this.state.username}
                                    onChange={this.onInputChange}
                                    error={this.state.errors.username}
                                    helperText={this.state.errors.username}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-Mail"
                                    name="email"
                                    autoComplete="off"
                                    value={this.state.email}
                                    onChange={this.onInputChange}
                                    error={this.state.errors.email}
                                    helperText={this.state.errors.email}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password1"
                                    label="Password"
                                    type="password"
                                    id="password1"
                                    autoComplete="off"
                                    value={this.state.password1}
                                    onChange={this.onInputChange}
                                    error={this.state.errors.password1}
                                    helperText={this.state.errors.password1}

                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password2"
                                    label="Confirm Password"
                                    type="password"
                                    id="password2"
                                    autoComplete="off"
                                    value={this.state.password2}
                                    onChange={this.onInputChange}
                                    error={this.state.errors.password2}
                                    helperText={this.state.errors.password2}

                                />
                                <Grid container
                                      direction="row"
                                      justify="center">
                                    <Grid item  >
                                        <Typography color='secondary' style={{fontWeight:'bold'}} variant="h6">
                                            {this.state.formError}
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Register
                                </Button>

                            </form>
                        </div>
                        <Box mt={8}>
                            <Copyright />
                        </Box>
                    </Container>
                }
                <ModalDialog
                    title={'Registration Error'}
                    content={' This link has either Expired or had already been used'}
                    open={this.state.openError}
                    onCancel={this.onDialogClose}


                />
                <ModalDialog
                    title={'Registration Successful'}
                    content={'User has been registered, Performing Signing in..'}
                    open={this.state.openSuccess}
                    onCancel={this.onDialogClose}


                />
            </Fragment>
        );
    }


}

export default withStyles(styles)(RegisterScreen);