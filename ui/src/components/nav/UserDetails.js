import React, {Component, Fragment} from 'react';
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import {getInitials, stringToColour} from "../../utils/utils";
import Store from "../../store/Store";
import {constants} from "../../utils/constants";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import withStyles from "@material-ui/core/styles/withStyles";
import {observer} from "mobx-react";
import {autorun} from "mobx";


const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({


    link: {
        textDecoration: 'none',
        color: lightColor,
        '&:hover': {
            color: theme.palette.common.white,
        },
    },
});

@observer
class UserDetails extends Component{



    componentDidMount() {

        this.disposer = autorun(()=>{
            Store.validate();
        })
        //calling endpoint


    }

    componentWillUnmount() {
        this.disposer();
    }

    render() {

        const username = Store.user[constants.userName].charAt(0).toUpperCase() + Store.user[constants.userName].slice(1);
        const {classes} = this.props;
        return (
            (<Fragment>


                    <Grid
                        container
                        direction='row'
                        justify="flex-end"
                        alignItems="center"
                        spacing={3}
                    >

                        <Grid item>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Avatar  style={{backgroundColor: stringToColour(Store.user[constants.userName])}}>
                                        {getInitials(Store.user[constants.userName])}
                                    </Avatar>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" style={{margin:'3px'}}>
                                        {username}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Link className={classes.link} onClick={()=>Store.signOut()} href={'/'} variant="body1">
                                Sign Out
                            </Link>
                        </Grid>
                    </Grid>

            </Fragment>)
        )
    }
}


export default withStyles(styles)(UserDetails);