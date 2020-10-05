import React, {useEffect, useState} from "react";
import {  MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import naomi from '../assets/images/naomi.jpeg';
import roy from '../assets/images/roy.jpeg';
import itamar2 from '../assets/images/itamar2.jpg';
import Grow from "@material-ui/core/Grow";


const styles = (theme) =>({
    avatar:{
        margin:'auto',

        width: '150px',
        height:'150px',
        webkitBoxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12) !important',
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12) !important'

    }
});

const TeamPage = (props) => {
    const [open,setOpen] = useState(false);
    const {classes} = props;
    useEffect(()=>{
        setOpen(true);

        return function cleanup () {
            setOpen(false);
        }
    },[])
    return (
        <Grow in={open} mountOnEnter unmountOnExit timeout={750}>
            <MDBCard className="my-5 px-5 pb-5 text-center">
                <MDBCardBody>
                    <h2 className="h1-responsive font-weight-bold my-4">
                        Our talented & experienced team delivers amazing results
                    </h2>
                    <h6 className=" h4-responsive font-weight-bold w-responsive mx-auto mb-5">
                        We have a can-do attitude backed up by delivering<br/>high-end,
                       creative solutions on time and on budget
                    </h6>
                    <MDBRow>
                        <MDBCol lg="4" md="6"  className="mb-lg-0 mb-5 ">
                            <Avatar
                                tag="img"
                                src={naomi}
                                className={clsx(classes.avatar,'d-flex justify-content-center')}
                                alt="naomi avatar"

                            />
                            <h5 className="font-weight-bold mt-4 mb-3">Naomi Kriger</h5>
                            <p className="text-uppercase blue-text">BackEnd Developer</p>
                            <p className="grey-text">
                                Our BackEnd developer. Developed the server side using Python and Django.
                                Naomi also works as a Python developer in a Fintech company
                                and has previous experience as a Risk & Data Analyst.
                                Experienced with SQL & MongoDB, and familiar with Java.
                            </p>
                            <ul className="list-unstyled mb-0">
                                <a href="https://www.linkedin.com/in/naomi-kriger/"
                                   target="_blank" rel="noopener noreferrer"
                                   className="p-2 fa-lg">
                                    <MDBIcon fab icon="linkedin-in"  />
                                </a>
                            </ul>
                        </MDBCol>

                        <MDBCol lg="4" md="6" className="mb-lg-0 mb-5">
                            <Avatar
                                tag="img"
                                src={itamar2}
                                className={classes.avatar}
                                alt="Sample avatar"
                            />
                            <h5 className="font-weight-bold mt-4 mb-3">Itamar Glick</h5>
                            <p className="text-uppercase blue-text">FrontEnd Developer</p>
                            <p className="grey-text">
                                Our FrontEnd developer. Developed the UI using ReactJS
                                with Material-UI and MobX. In addition to developing Minerva,
                                Itamar also works as a Citrix and System Administrator,
                                where he writes scripts in PowerShell that are UX/UI empowered by WPF.
                            </p>
                            <ul className="list-unstyled mb-0">
                                <a href="https://www.linkedin.com/in/itamar-glick-03735847/"
                                   target="_blank" rel="noopener noreferrer"
                                   className="p-2 fa-lg">
                                    <MDBIcon fab icon="linkedin-in"  />
                                </a>
                            </ul>
                        </MDBCol>

                        <MDBCol lg="4" md="6" className="mb-lg-0 mb-5">
                            <Avatar
                                tag="img"
                                src={roy}
                                className={classes.avatar}
                                alt="Sample avatar"
                            />
                            <h5 className="font-weight-bold mt-4 mb-3">Roy Lewin</h5>
                            <p className="text-uppercase blue-text">BackEnd Developer</p>
                            <p className="grey-text">
                                Our BackEnd developer. Developed the server side using Python and Django.
                                Roy also works as a BackEnd developer in a fraud-prevention company,
                                Experienced with Python and developing data streaming services to Hadoop and SQL.
                            </p>
                            <ul className="list-unstyled mb-0">
                                <a href="https://www.linkedin.com/in/roy-lewin-8519a773/"
                                   target="_blank" rel="noopener noreferrer"
                                   className="p-2 fa-lg">
                                    <MDBIcon fab icon="linkedin-in"  />
                                </a>

                            </ul>
                        </MDBCol>


                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </Grow>
    );
}

export default withStyles(styles)(TeamPage);