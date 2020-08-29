import React,{Component} from "react";
import MessageBox from "./MessageBox";
import withStyles from "@material-ui/core/styles/withStyles";
import DiscussionSummary from "./DiscussionSummary";


const styles = (theme) => ({

});

class CommentsList extends Component {


    render() {
        const {dataList} = this.props;
        console.log(dataList);
        return  (!dataList) ?
            null:
            dataList.map(data=>{
                return <MessageBox data={data} key={data.id} />
            });
    }
}

export default withStyles(styles)(CommentsList);