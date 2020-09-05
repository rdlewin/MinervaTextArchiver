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
import Skeleton from "@material-ui/lab/Skeleton";


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



class DiscussionScreen extends Component{
    state = {
        dataList : [],
        loading : true
    }



    onReload = () => {
        this.setState({loading:true});
        this.getDiscussions().then(data=>{
            this.setState({
                dataList : data,
                loading:false
            })});
    }

    componentDidMount() {
        //calling endpoint
        this.getDiscussions().then(data=>{
            this.setState({
                dataList : data,
                loading:false
            })});

    }

   async getDiscussions() {
        const response = await axios.get('/discussions');
        return response.data;

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
                                placeholder="Search Author, #Hashtag, Message contents"
                                InputProps={{
                                    disableUnderline: true,
                                    className: classes.searchInput,
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
        const {dataList,loading} = this.state;
        return (dataList.length > 0 || !loading)?
            dataList.map(data=>{
                return <DiscussionSummary data={data} key={data.id} loading={loading} />
            }):
            <DiscussionSummary loading={loading}/>;

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