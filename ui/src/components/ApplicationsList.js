import React, {Component, Fragment} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import DiscussionSummary from "./DiscussionSummary";
import clsx from "clsx";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import GroupItem from "./GroupItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Button} from "@material-ui/core";
import axios from "../data/axios";

const styles = (theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    item: {
        backgroundColor: '#18202c',
        paddingTop: 1,
        paddingBottom: 1,
        color: 'rgba(255, 255, 255, 0.7)',

        '&:hover:not(.Mui-expanded),&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },

    },

    icon:{
        color: 'rgba(255, 255, 255, 0.7)',
    },
    groups:{
        display: 'block',
        width: '100%',
        maxHeight: '100px',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
            width: '0.6em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            outline: '1px solid slategrey'
        }
    }
});


// list: {
//     overflowY: "auto",
//         margin: 0,
//         padding: 0,
//         listStyle: "none",
//         height: "100%",

const ITEM_HEIGHT = 48;

class ApplicationsList extends Component {
    state = {
        dataList : [],

    };



    onAppClick = (event) => {
        console.log("onAppClicked",event)
        const {target} = event;
        alert(`app clicked - ${target.innerText}`);
        event.stopPropagation();

    };

    onClose = () => {
        this.setState({
            anchorEl : null,
            open : false
        });
    };

    onGroupClicked = (event) => {
        this.setState({
            anchorEl : null,
            open : false
        });
        console.log(`${event.currentTarget} was clicked`);
    };

    componentDidMount() {
       this.getApplicationsList().then(data=>{
           this.setState({
            dataList : data
           })});
    }

    async getApplicationsList(){
       const response = await axios.get('apps');
       return response.data;

    }


    renderApplications() {
        const {classes} = this.props;
        const {dataList} = this.state;
        return (!dataList) ?
            null:
            dataList.map(data=>{
                const {groups} = data;
                return (
                    <div className={classes.root}>
                        <Accordion className={classes.item}>
                            <AccordionSummary

                                expandIcon={<ExpandMoreIcon className={classes.icon}/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Button value={data.app_name} onClick={this.onAppClick} className={clsx(classes.heading,classes.item)}>{data.app_name}</Button>
                            </AccordionSummary>
                            <AccordionDetails className={classes.groups}>
                                {groups.map((group) => (
                                    <GroupItem key={group.group_name}  onClick={this.onGroupClicked} group={group}/>

                                ))}

                            </AccordionDetails>
                        </Accordion>

                    </div>

                )
            });
    }

    render(){
        return this.renderApplications();
    }
}

export default withStyles(styles)(ApplicationsList);