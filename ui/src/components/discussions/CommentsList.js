import React, {Component, Fragment} from "react";
import MessageBox from "./MessageBox";
import withStyles from "@material-ui/core/styles/withStyles";
import DiscussionSummary from "./DiscussionSummary";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {Skeleton} from "@material-ui/lab";


const styles = (theme) => ({
    root: {
        // height: 110,
        flexGrow: 1,

    },
});

class CommentsList extends Component {



    getParents = (node, arr) => {
        if (Array.isArray(node.children) && node.children.length > 0){
            arr.push(''+node.id);
            node.children.map((node=> this.getParents(node,arr)));
        }
        return arr;
    }

     renderTree = (nodes) => {



         return (
             <TreeItem
                key={nodes.id}
                nodeId={''+nodes.id}
                label={<MessageBox data={nodes} />}
            >
                {Array.isArray(nodes.children) ? nodes.children.map((node) => this.renderTree(node)) : null}
            </TreeItem>
        )
     };

    renderTreeView =() => {
        const {classes, rootElement,loading} = this.props;
        const expanded = this.getParents(rootElement,[]);


        console.log(expanded);
        return (
                <TreeView
                    className={classes.root}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    expanded={expanded}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    {this.renderTree(rootElement)}
                </TreeView>

        );
    }

    render() {
        const {dataList,rootElement} = this.props;
        // console.log("datalist in comments: ",dataList);

        return (!rootElement) ?
            dataList.map(data=>{
                // console.log("map comments: ",data);
                return <MessageBox data={data} key={data.id} />
            }):
            this.renderTreeView();
        // return <div>message</div>;
    }
}

export default withStyles(styles)(CommentsList);