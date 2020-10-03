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
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import CommentsList from "./CommentsList";
import Button from "@material-ui/core/Button";
import {getInitials, getHierarchy, stringToColour} from "../../utils/utils";
import Chip from "@material-ui/core/Chip";
import axios from "../../data/axios";
import Skeleton from "@material-ui/lab/Skeleton";
import Zoom from "@material-ui/core/Zoom";
import Slide from "@material-ui/core/Slide";
import Store from "../../store/Store";
import {observer} from "mobx-react";
import {reaction, toJS} from "mobx";
import {constants} from "../../utils/constants";

const styles = (theme) => ({
    root: {
        // maxWidth: 345,
        marginBottom : '25px'
    },
    errorHeader:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

@observer
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

    componentDidMount() {
        console.log('discussion Summary data:',this.props.data);
        this.disposer = reaction(()=>Store.lastUpdate,
            (lastUpdate)=>{
            // console.log('reseting comments', lastUpdate);
            this.setState({
                expanded: false,
                rootElement : null,
                disabled : false,
                commentsLoading : false,
                commentsInitiated : false
            });

        })
        //calling endpoint


    }

    componentWillUnmount() {
        this.disposer();
    }

    componentDidUpdate(prevProps){
         if (prevProps.update !== this.props.update ){

         }
    }


    onLoadComments = () => {
        this.setState({commentsLoading : true, commentsInitiated : true});
         this.getComments().then(data=>{
             console.log(data);
             this.setState({
                 disabled : true,
                 commentsLoading : false,
                 rootElement: getHierarchy(data)
             })});


     }
     async getComments() {
         // const response = await axios.get('/messages');
         const postObj = {
             user_id: Store.user[constants.userID],
             discussion_id: this.props.data.discussion_id,
             page_num: 0,

         };
         const response = await axios.post('messages',postObj,{
             headers:{
                 authorization: 'Bearer ' + Store.user[constants.userToken]
             },
         });
         // console.log('Messages:',response);
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

     renderDiscussions(){
         const {classes,data,loading} = this.props;
         const {expanded} = this.state;
         const numMoreMessages = (data.message_count - data.latest_messages.length) >= 0?
             data.message_count - data.latest_messages.length:
             0;

         return (
             data.discussion_id !== 'error' ?
                 (
                     <Slide direction="left" mountOnEnter unmountOnExit in={!loading} timeout={600}>
                         <Card className={classes.root}>
                             <CardHeader
                                 avatar={
                                     <Avatar aria-label="Discussion" style={{backgroundColor: stringToColour(data.first_message.sender_name)}}>
                                         {getInitials(data.first_message.sender_name)}
                                     </Avatar>
                                 }
                                 title={data.hashtag || 'General Discussion'}
                                 subheader={`${data.first_message.sender_name}, ${data.first_message.sent_date}`}
                             />
                             <CardContent>
                                 <Typography variant="body2" color="textSecondary" component="p">
                                     {data.first_message.content}
                                 </Typography>

                             </CardContent>
                             <CardActions disableSpacing>
                                 <Button size="small" color="primary" onClick={this.onToggleComments}>
                                     {`${data.message_count} Messages`}
                                 </Button>
                             </CardActions>
                             <Collapse in={expanded} timeout="auto" unmountOnExit>
                                 <CardContent className={classes.content}>
                                     {!loading && data.message_count > 3 &&  !this.state.disabled &&
                                     <Chip
                                         icon={<ChatOutlinedIcon />}
                                         label={`Show ${numMoreMessages} More Comments`}
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
                     </Slide>
                 ):
                 (
                     <Card className={clsx(classes.root,classes.errorHeader)}>
                         <CardHeader
                           className={classes.errorHeader}
                             avatar={
                                 <SpeakerNotesOffIcon/>
                             }
                             title={'No Discussions Found!'}
                             subheader={`Try again later`}
                         />

                     </Card>
                 )

         );
     }

    render() {
        const {classes,data,loading} = this.props;
        const {expanded} = this.state;
        return (
            loading ? (
                <Card className={classes.root}>
                    <CardHeader
                        avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
                        title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }}/>}
                        subheader={<Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }}/>}
                    />
                    <CardContent>
                        <Skeleton animation="wave" height={150} width="80%" />
                    </CardContent>
                </Card>
            ):
                this.renderDiscussions()
        );
    }



 }

export default withStyles(styles)(DiscussionSummary);