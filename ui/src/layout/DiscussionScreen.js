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
        dataList : []
    }



    onReload = () => {
        console.log("Reload button was clicked");
        this.getDiscussions().then(data=>{
            this.setState({
                dataList : data
            })});
    }

    componentDidMount() {
        //calling endpoint
        this.getDiscussions().then(data=>{
            this.setState({
            dataList : data
        })});

    }

    async getDiscussions() {
        const demiData =[
            {
                discussion_id : 1,
                hashtag : '#C++TermA',
                group_id : 12,
                // groupName : 'MTA - year 2018',
                message_count : 20,
                last_updated : '"2020-08-22T18:50:32.087Z',
                first_message: {
                    discussions : [
                        {
                            hashtag : "#C++TermA",
                            id: 1
                        }
                    ],
                    app_message_id: 1800986,
                    id: 1,
                    reply_to_id : null,
                    sender_id : 2,
                    sender_name: 'Itamar Dror Glick',
                    sent_date: '2020-08-22T18:43:47.792Z',
                    last_updated : '2020-08-22T18:43:47.792Z',
                    content:'This impressive paella is a perfect party dish and a fun meal to cook' +
                             ' together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.'
                },
                latest_messages: [
                    {
                        discussions : [
                            {
                                hashtag : "#C++TermA",
                                id: 1
                            }
                        ],
                        app_message_id: 1800989,
                        id: 19,
                        reply_to_id : 1,
                        sender_id : 3,
                        sender_name: 'ilia shifrin',
                        sent_date: '2020-08-22T19:53:47.792Z',
                        last_updated : '2020-08-22T19:53:47.792Z',
                        content:'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated '
                    },
                    {
                        discussions : [
                            {
                                hashtag : "#C++TermA",
                                id: 1
                            }
                        ],
                        app_message_id: 1800997,
                        id: 20,
                        reply_to_id : 17,
                        sender_id : 4,
                        sender_name: 'jenia bartel',
                        sent_date: '2020-08-23T14:22:47.792Z',
                        last_updated : '2020-08-23T14:22:47.792Z',
                        content:'במקום לחכות לאחרי המשבר, בואו לגלות עכשיו אלו מקצועות יהיו הכי מבוקשים בהייטק!'
                    }
                ]
            },
            {
                discussion_id : 2,
                hashtag : null,
                group_id : 12,
                // groupName : 'MTA - year 2018',
                message_count : 4,
                last_updated : '"2020-08-22T18:50:32.087Z',
                first_message: {
                    discussions : [
                        {
                            hashtag : null,
                            id: 2
                        }
                    ],
                    app_message_id: 1801086,
                    id:1,
                    reply_to_id : null,
                    sender_id : 5,
                    sender_name: 'Roy Lewin',
                    sent_date: '2020-08-22T18:43:47.792Z',
                    last_updated : '2020-08-22T18:43:47.792Z',
                    content:'One morning, when Gregor Samsa woke from troubled dreams, he found '
                },
                latest_messages: [
                    {
                        discussions : [
                            {
                                hashtag : null,
                                id: 2
                            }
                        ],
                        app_message_id: 1801102,
                        id: 3,
                        reply_to_id : 1,
                        sender_id : 6,
                        sender_name: 'Eliran Franco',
                        sent_date: '2020-08-22T19:53:47.792Z',
                        last_updated : '2020-08-22T19:53:47.792Z',
                        content:'He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections '
                    },
                    {
                        discussions : [
                            {
                                hashtag : null,
                                id: 2
                            }
                        ],
                        app_message_id: 1801104,
                        id: 4,
                        reply_to_id : 1,
                        sender_id : 7,
                        sender_name: 'Hodaya Nir',
                        sent_date: '2020-08-23T14:22:47.792Z',
                        last_updated : '2020-08-23T14:22:47.792Z',
                        content:'במקום לחכות לאחרי המשבר, בואו לגלות עכשיו אלו מקצועות יהיו הכי מבוקשים בהייטק!'
                    }
                ]
            },

        ];
        return demiData;
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
        const {dataList} = this.state;
        return (!dataList) ?
            null:
            dataList.map(data=>{
                return <DiscussionSummary data={data} key={data.id} />
            });

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