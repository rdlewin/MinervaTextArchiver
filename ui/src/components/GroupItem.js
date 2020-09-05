import React, {Component} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";

const styles = (theme) => ({
    root:{
        backgroundColor: '#18202c',
            '&:hover,&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        color: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'flex-start',
    },

});

const StyledBadge = withStyles((theme) => ({
    badge: {
        // right: -10,
        // top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',

    },
}))(Badge);


class GroupItem extends Component {

    render(){
        const {group,onClick,classes} = this.props

        return (
            <div className={classes.root}>

                    <Button className={classes.root} onClick={onClick} fullWidth={true}>

                            {group.group_name}

                    </Button>

                <StyledBadge badgeContent={group.num_discussions} color="secondary">
                </StyledBadge>
            </div>
        )
    }
}

export default withStyles(styles)(GroupItem);