import React, {Component} from 'react';
import DiscussionSummary from "../components/DiscussionSummary";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from '../data/axios';
import {autorun, toJS} from "mobx";
import Skeleton from "@material-ui/lab/Skeleton";
import Store from "../store/Store";
import {DelayInput} from "react-delay-input";
import {constants} from "../utils/constants";



const styles = (theme) => ({

    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '15px'
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },

});


function DelayInputCustom(props) {
    const {  onChange, ...other } = props;

    return (
        <DelayInput
            {...other}
            onChange={(values) => {
                onChange({
                    target: {
                        value: values.target.value,
                    },
                });
            }}
            minLength={3}
            delayTimeout={600}

        />
    );
}



class DiscussionScreen extends Component{
    state = {
        dataList : [],
        loading : true,

    }


    onSearchChanged = (event) =>{
        console.log(event.target.value);
        Store.setFilter({[constants.filterFreeText]:event.target.value});
    }

    onReload = () => {
        this.getDiscussions(Store.filters);
    }

    componentDidMount() {
        this.disposer = autorun(()=>{
            this.getDiscussions(Store.filters);
        })
        //calling endpoint


    }

    componentWillUnmount() {
        this.disposer();
    }

    async getDiscussions(filter={}) {
        this.setState({loading:true});
        //const response = await axios.get('/discussions');
        const postObj = {
            user_id: Store.user[constants.userID],
            filters: toJS(Store.filters),
            page_num: 0,
            page_size: 100
        };
        console.log(postObj);
        try {
            const response = await axios.post('discussions/summary', postObj,{
                headers:{
                    authorization: 'Bearer ' + Store.user[constants.userToken]
                },
            })
            const discussions = (response.data.length > 0)?
                response.data:
                [{discussion_id:'error'}];
            this.setState({
                dataList: discussions,
                loading: false,
            });

        } catch (e) {
            this.setState({
                dataList: [{discussion_id:'error'}],
                loading: false,
            });
        }
        finally {
            Store.setLastUpdate(Date.now());
        }
    }

    renderAppbar () {
        const {classes} = this.props;
        return(
           <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
               <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SearchIcon className={classes.block} color="inherit" />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder="Search Message contents"
                                onChange={this.onSearchChanged}
                                InputProps={{
                                    disableUnderline: true,
                                    className: classes.searchInput,
                                    inputComponent: DelayInputCustom,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip title="Reload">
                                <IconButton onClick={this.onReload}>
                                    <RefreshIcon className={classes.block} color="inherit" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
       );
    }

    renderDiscussionList(){
        const {dataList,loading, lastUpdate} = this.state;
        return (dataList.length > 0 || !loading)?
            dataList.map(data=>{
                return <DiscussionSummary key={data.discussion_id} data={data}  loading={loading} />
            }):
            <DiscussionSummary loading={loading} />;

    }

    render() {
        return (
            <div>
                {this.renderAppbar()}
                {this.renderDiscussionList()}
            </div>
        )
    }
}


export default withStyles(styles)(DiscussionScreen);