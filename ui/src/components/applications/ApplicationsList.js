import React, {Component, Fragment} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import GroupItem from "./GroupItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Button} from "@material-ui/core";
import axios from "../../data/axios";
import {observer} from "mobx-react";
import Store from "../../store/Store";
import {constants} from "../../utils/constants";
import Box from "@material-ui/core/Box";
import {autorun} from "mobx";


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
    active:{
        backgroundColor: '#009be5',
    },
    errorHeader:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',

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


const ITEM_HEIGHT = 48;
@observer
class ApplicationsList extends Component {
    state = {
        dataList : [],
        errorMessage : '',

    };



    onAppClick = (event, appId) => {
        Store.setFilter({[constants.filterApp]: appId, [constants.filterGroup]:[]});
        event.stopPropagation();

    };

    onClose = () => {
        this.setState({
            anchorEl : null,
            open : false
        });
    };

    onGroupClicked = (groupId,appId) => {
        this.setState({
            anchorEl : null,
            open : false
        });

        let newGroups = [];
        if (Store.filters[constants.filterApp] === appId){

            if (Store.filters[constants.filterGroup].find(item=>item === groupId)){
                newGroups = Store.filters[constants.filterGroup].filter(item=> item !== groupId);
            }
            else{
                newGroups = [...Store.filters[constants.filterGroup],groupId];

            }

        }
        else if (groupId){
            newGroups =  [groupId];
        }


        Store.setFilter({[constants.filterGroup]:newGroups,[constants.filterApp]:appId});
    };

    onAllAppsClicked(){
        Store.setFilter({[constants.filterGroup]:[],[constants.filterApp]:null});
    }

    componentDidMount() {

        this.disposer = autorun(()=>{
            this.getApplicationsList().then(data=>{
                console.log('applist:',data);
                let error = '';
                if (data.length === 0){
                    error = 'No Applications Returned!!';
                }
                this.setState({
                    dataList : data,
                    errorMessage : error,
                })
            });
        });

    }

    componentWillUnmount() {
        this.disposer();
    }

    async getApplicationsList(){
       // const response = await axios.get('apps');

        const postObj = {
            user_id: Store.user[constants.userID],
        };
        console.log('applications did mount', postObj);
        const response = await axios.post('apps/groups',postObj,{
            headers:{
                authorization: 'Bearer ' + Store.user[constants.userToken]
            },
        });
        return response.data;

    }


    renderApplications() {
        const {classes} = this.props;
        const {dataList,errorMessage} = this.state;

        const box = errorMessage?
            (<Box className={classes.errorHeader}>
                {errorMessage}
            </Box>):
            null;

        return (dataList.length === 0) ?
            box:

            dataList.map(data=> {
                const {groups} = data;
                const activeApp = Store.filters[constants.filterApp] === data.app_id ?
                    classes.active :
                    null;
                return (
                    <div key={data.app_id} className={classes.root}>
                        <Accordion className={classes.item}>
                            <AccordionSummary
                                className={activeApp}
                                expandIcon={<ExpandMoreIcon className={classes.icon}/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Button value={data.app_name}
                                        onClick={(event) => this.onAppClick(event, data.app_id)}
                                        className={clsx(classes.heading, classes.item,activeApp)}>{data.app_name}</Button>
                            </AccordionSummary>
                            <AccordionDetails className={classes.groups}>
                                {groups.map((group) => (
                                    <GroupItem key={group.id} appId={data.app_id}
                                               onClick={this.onGroupClicked} group={group}/>

                                ))}

                            </AccordionDetails>
                        </Accordion>

                    </div>

                )
            });
    }

    render(){
        const {classes} = this.props;
        const noActiveApp = (!Store.filters[constants.filterGroup].length && !Store.filters[constants.filterApp]) ?
            classes.active:
            null;
        return (
            <Fragment>
                <Button
                    onClick={this.onAllAppsClicked}
                    className={clsx(classes.heading,classes.item, noActiveApp)}
                >
                    Show All Applications
                </Button>
                {this.renderApplications()}
            </Fragment>

        );
    }
}

export default withStyles(styles)(ApplicationsList);