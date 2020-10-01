import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import {Copyright} from "../utils/utils";
import Container from '@material-ui/core/Container';
import withStyles from "@material-ui/core/styles/withStyles";




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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class RegisterScreen extends Component {
    state = {
        username: '',
        password1: '',
        password2: '',
    };

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

        console.log(this.state.username);
        console.log(this.state.password1);
        console.log(this.state.password2);
        e.preventDefault();
    }


    render() {
        const {classes} = this.props;
        return (
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
                            name="password1"
                            label="Password"
                            type="password"
                            id="password1"
                            autoComplete="current-password"
                            value={this.state.password1}
                            onChange={this.onInputChange}

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
                            autoComplete="current-password"
                            value={this.state.password2}
                            onChange={this.onInputChange}

                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Register
                        </Button>
                        <Grid container
                              direction="row"
                              justify="flex-end">
                            <Grid item  >
                                <Link href="#" variant="body2">
                                    Already have an account?
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

export default withStyles(styles)(RegisterScreen);