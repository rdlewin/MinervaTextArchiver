import React,{Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import PropTypes from 'prop-types';




class ModalDialog extends Component{
    state = {
        open: false,

    }


    componentDidMount() {
        const { open} = this.props
        this.setState({open:open});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.open !== this.props.open){
            this.setState({open:this.props.open});
        }
    }



    render() {

        const {transition,title,content,buttonText} = this.props;

        const selectedTransition = transition? transition:
            React.forwardRef(function Transition(props, ref) {
            return <Slide direction="up" ref={ref} {...props} />;
        });

        return (
            <Dialog
                open={this.state.open}
                TransitionComponent={selectedTransition}
                keepMounted
                onClose={e=>this.setState({open:false})}
            >
                <DialogTitle id="user-error-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={e=>{
                            const {onCancel} = this.props;

                            if(onCancel && typeof onCancel === 'function'){
                                onCancel();
                             }

                            this.setState({open:false});
                        }}
                        color="secondary"
                    >
                        Close
                    </Button>
                    {buttonText ? (
                        <Button
                            onClick={(e) =>{
                                const {onOk} = this.props;

                                if(onOk && typeof onOk === 'function'){
                                    onOk();
                                }
                                this.setState({open:false});
                            }}
                            color="primary"
                        >
                            {buttonText}
                        </Button>
                        ):
                        null
                    }

                </DialogActions>
            </Dialog>
        );
    }
}

ModalDialog.propTypes = {
    transition:PropTypes.func,
    title:PropTypes.string.isRequired,
    content:PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func

}

export default ModalDialog;