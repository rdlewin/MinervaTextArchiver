import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import withStyles from "@material-ui/core/styles/withStyles";
import {Copyright} from "../utils/utils";
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Zoom from "@material-ui/core/Zoom";
import {doSignIn} from "../utils/utils";


const styles = (theme) => ({
    logo:{

        // backgroundColor: theme.palette.secondary.main,
        backgroundImage: 'url("/images/minerva.png")',
        backgroundRepeat : 'no-repeat',
        backgroundSize: 'cover',
        width : '300px',
        height: '200px',
        //margin: 'auto',
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
    avatarLocked: {
        margin: theme.spacing(1),
        backgroundColor: 'red',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignInScreen extends Component {
    state = {
        username: '',
        password: '',
        error:'',
        signedIn: false,
        from:null,
    };

    componentDidMount() {
        console.log(this.props);
        this.setState({from:this.props.location.state.from});
    }

    onInputChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        });
    };

    onSubmitLogin = e =>{
        e.preventDefault();
        this.setState({error:''});
        this.signIn();

    }

    async signIn(){
        try {
            await doSignIn(this.state.username.toLowerCase(),this.state.password);
            this.setState({signedIn:true});
            if (this.props.addApp){
                this.props.addApp();
            }
            else {
                setTimeout(() => {
                    this.props.history.replace(this.state.from);
                }, 3000);
            }

        } catch (err) {
            console.log('error:',err.response);
            if (err.response.status === 401){
                this.setState({error:'Bad User Name or Password!', password:''});
            }
        }

    }

    render() {
        const {classes} = this.props;

        return (
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <div className={classes.paper}>
                    <div className={classes.logo}/>
                    {this.state.signedIn ?
                        (<Avatar className={classes.avatar}>
                            <Zoom in={this.state.signedIn} timeout={3000}>
                                <LockOpenOutlinedIcon/>
                            </Zoom>
                        </Avatar>) :
                        (<Avatar className={classes.avatarLocked}>
                            <LockOutlinedIcon/>
                        </Avatar>)
                    }

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form
                        className={classes.form}
                        noValidate
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
                            autoComplete="username"
                            autoFocus
                            value={this.state.username}
                            onChange={this.onInputChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={this.state.password}
                            onChange={this.onInputChange}

                        />
                        <Typography  variant="h6" color='error' style={{textAlign:'center'}}>
                            {this.state.error}
                        </Typography>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container
                              direction="row"
                              justify="flex-end">
                            <Grid item  >
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>

                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        );
    }


}

export default withStyles(styles)(SignInScreen);