import React, {Component} from 'react';
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {getInitials} from "../utils/utils";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {red} from "@material-ui/core/colors";
import withStyles from "@material-ui/core/styles/withStyles";


const styles = (theme) => ({
    root: {
        display: 'flex',
        marginBottom : '25px',
        marginLeft : '25px',
        maxWidth :'600px',

    },
    avatar: {
        backgroundColor: red[500],
    },
});

class MessageBox extends Component{

    render() {
        const {classes,data} = this.props;
        return(

            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Discussion" className={classes.avatar}>
                            {getInitials(data.sender_name)}
                        </Avatar>
                    }
                    title={`${data.sender_name}`}
                    subheader={`${data.sent_date}`}

                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {data.content}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(MessageBox);