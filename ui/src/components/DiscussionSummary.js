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
import {getInitials} from "../utils/utils";
import Chip from "@material-ui/core/Chip";


const styles = (theme) => ({
    root: {
        // maxWidth: 345,
        marginBottom : '25px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    moreComments: {
        marginBottom: '25px',
    },
});


 class DiscussionSummary extends Component{

     state = {
         expanded: false,
         dataList : []

     };

     onToggleComments = () => {

         this.setState({
             expanded: !this.state.expanded

         });
     };


     onLoadComments = () => {
         console.log("Reload button was clicked");
         this.getComments().then(data=>{
             this.setState({
                 dataList : data
             })});
     }
     async getComments() {
         const demiData =[
             [
                 {
                     id : '2',
                     author: 'Naomi Kriger',
                     createdDate: '7.8.2020 8:05',
                     content:'This impressive paella is a perfect party dish and a fun meal to cook' +
                         ' together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.'

                 },
                 {
                     id : '7',
                     author: 'ron rozen',
                     createdDate: '9.8.2020 19:45',
                     content:'במקום לחכות לאחרי המשבר, בואו לגלות עכשיו אלו מקצועות יהיו הכי מבוקשים בהייטק!'
                 },
                 {
                     id:'17',
                     author: 'ilia shifrin',
                     createdDate: '20.8.2020 8:05',
                     content:'This impressive paella is a perfect party dish and a fun meal to cook' +
                         ' together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.'
                 },
                 {
                     id: '20',
                     author: 'jenia bartel',
                     createdDate: '18.8.2020 19:45',
                     content:'במקום לחכות לאחרי המשבר, בואו לגלות עכשיו אלו מקצועות יהיו הכי מבוקשים בהייטק!'
                 },
             ],
             [
                 {
                     id : '2',
                     author: 'Moshe Zuchmer',
                     createdDate: '7.8.2020 8:05',
                     content:'This impressive paella is a perfect party dish and a fun meal to cook' +
                         ' together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.'

                 },
                 {
                     id : '7',
                     author: 'nati spn',
                     createdDate: '9.8.2020 19:45',
                     content:'במקום לחכות לאחרי המשבר, בואו לגלות עכשיו אלו מקצועות יהיו הכי מבוקשים בהייטק!'
                 },
                 {
                     id:'17',
                     author: 'hodaya nir',
                     createdDate: '20.8.2020 8:05',
                     content:'This impressive paella is a perfect party dish and a fun meal to cook' +
                         ' together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.'
                 },
                 {
                     id: '20',
                     author: 'eliran franco',
                     createdDate: '18.8.2020 19:45',
                     content:'במקום לחכות לאחרי המשבר, בואו לגלות עכשיו אלו מקצועות יהיו הכי מבוקשים בהייטק!'
                 },
             ]
         ];
         return this.props.data.id === '1' ? demiData[0]:demiData[1];
     }

     renderCommentsList() {
         const {dataList} = this.state;
         const {data:{latest_messages}} = this.props;
        console.log(dataList);

         return (!dataList.length)?
             <CommentsList dataList={latest_messages}/>:
             <CommentsList dataList={dataList}/>;
     }

    render() {
        const {classes,data} = this.props;
        const {expanded, dataList} = this.state;
        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Discussion" className={classes.avatar}>
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
                    <CardContent>
                        {data.message_count > 2 &&
                            <Chip
                            icon={<ChatOutlinedIcon />}
                            label={`Show ${data.message_count - 2} More Comments`}
                            clickable
                            color="primary"
                            onClick={this.onLoadComments}
                            className={classes.moreComments}
                            />
                        }

                        {this.renderCommentsList()}
                    </CardContent>
                </Collapse>
            </Card>
        );
    }



 }

export default withStyles(styles)(DiscussionSummary);