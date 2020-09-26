import React, {Component} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import {observer} from "mobx-react";
import Store from "../store/Store";
import {constants} from "../utils/constants";
import clsx from "clsx";

const styles = (theme) => ({
    root:{
        backgroundColor: '#18202c',
            '&:hover,&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        color: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'flex-start',
    },
    active:{
        backgroundColor: '#009be5',
    },

});

const StyledBadge = withStyles((theme) => ({
    badge: {
        // right: -10,
        // top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
        backgroundColor : 'purple',

    },
}))(Badge);

@observer
class GroupItem extends Component {

    render(){
        const {group,onClick,classes,appId} = this.props
        const activeGroup = Store.filters[constants.filterApp] === appId
            && Store.filters[constants.filterGroup].find(item=> item === group.group_id)?
            clsx(classes.active,classes.root) :
            classes.root;
        return (
            <div key={group.group_id} className={activeGroup}>

                    <Button className={activeGroup} onClick={()=>onClick(group.group_id,appId)} fullWidth={true}>

                            {group.group_name}

                    </Button>

                <StyledBadge badgeContent={group.num_discussions} max={99} color="primary">
                </StyledBadge>
            </div>
        )
    }
}

export default withStyles(styles)(GroupItem);