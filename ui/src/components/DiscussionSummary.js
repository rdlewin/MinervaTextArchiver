import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import clsx from "clsx";
import CommentsList from "./CommentsList";
import Button from "@material-ui/core/Button";
import {getInitials, getHierarchy} from "../utils/utils";
import Chip from "@material-ui/core/Chip";
import axios from "../data/axios";
import Skeleton from "@material-ui/lab/Skeleton";


const styles = (theme) => ({
    root: {
        // maxWidth: 345,
        marginBottom : '25px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    },
    moreComments: {
        marginBottom: '25px',
    },
    content:{
        overflow: 'auto',
    },
});


 class DiscussionSummary extends Component{

     state = {
         expanded: false,
         rootElement : null,
         disabled : false,
         commentsLoading : false,
         commentsInitiated : false
     };

     onToggleComments = () => {

         this.setState({
             expanded: !this.state.expanded

         });
     };


     onLoadComments = () => {
        this.setState({commentsLoading : true, commentsInitiated : true});
         this.getComments().then(data=>{

             this.setState({
                 rootElement : getHierarchy(data),
                 disabled : true,
                 commentsLoading : false
             })});


     }
     async getComments() {
         const response = await axios.get('/messages');
         return response.data;

     }

     renderCommentsList() {
         const {rootElement,commentsLoading,commentsInitiated} = this.state;
         const {data} = this.props;
        // console.log(dataList);
        //  console.log(data.latest_messages);

         return commentsInitiated?
             (commentsLoading?
                     (<Skeleton variant="rect" width="80%" height={100}/>):
                     (<CommentsList rootElement={rootElement} />)):
             (<CommentsList dataList={data.latest_messages} />);

     }

    render() {
        const {classes,data,loading} = this.props;
        const {expanded, dataList} = this.state;
        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        loading?(
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        ) : (

                            <Avatar aria-label="Discussion" className={classes.avatar}>
                                {getInitials(data.first_message.sender_name)}
                            </Avatar>
                        )
                    }
                    title={loading? (<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }}/>):
                        (data.hashtag || 'General Discussion')}
                    subheader={loading? (<Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }}/>):
                        (`${data.first_message.sender_name}, ${data.first_message.sent_date}`)}
                />
                <CardContent>
                    {loading ? (
                        <React.Fragment>

                            <Skeleton animation="wave" height={150} width="80%" />
                        </React.Fragment>
                        ) : (
                        <Typography variant="body2" color="textSecondary" component="p">
                            {data.first_message.content}
                        </Typography>
                    )}
                </CardContent>
                <CardActions disableSpacing>
                    {loading ? null :
                        (<Button size="small" color="primary" onClick={this.onToggleComments}>
                            {`${data.message_count} Messages`}
                        </Button>
                        )}
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent className={classes.content}>
                        {!loading && data.message_count > 2 &&
                            <Chip
                            icon={<ChatOutlinedIcon />}
                            label={`Show ${data.message_count - 2} More Comments`}
                            clickable
                            disabled={this.state.disabled}
                            color="primary"
                            onClick={this.onLoadComments}
                            className={classes.moreComments}
                            />
                        }

                        {loading? null : this.renderCommentsList()}
                    </CardContent>
                </Collapse>
            </Card>
        );
    }



 }

export default withStyles(styles)(DiscussionSummary);