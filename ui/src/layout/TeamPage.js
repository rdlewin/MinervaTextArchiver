import React from "react";
import {  MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import naomi from '../assets/images/naomi.jpeg';
import roy from '../assets/images/roy.jpeg';
import itamar from '../assets/images/itamar.jpg';

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
    const {classes} = props;
    return (
        <MDBCard className="my-5 px-5 pb-5 text-center">
            <MDBCardBody>
                <h2 className="h1-responsive font-weight-bold my-5">
                    Our amazing team
                </h2>
                <p className="grey-text w-responsive mx-auto mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
                    error amet numquam iure provident voluptate esse quasi, veritatis
                    totam voluptas nostrum quisquam eum porro a pariatur veniam.
                </p>
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
                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci sed quia non numquam modi tempora eius.
                        </p>
                        <ul className="list-unstyled mb-0">
                            <a href="#!" className="p-2 fa-lg">
                                <MDBIcon fab icon="linkedin-in"  />
                            </a>
                        </ul>
                    </MDBCol>

                    <MDBCol lg="4" md="6" className="mb-lg-0 mb-5">
                        <Avatar
                            tag="img"
                            src={itamar}
                            className={classes.avatar}
                            alt="Sample avatar"
                        />
                        <h5 className="font-weight-bold mt-4 mb-3">Itamar Glick</h5>
                        <p className="text-uppercase blue-text">FrontEnd Developer</p>
                        <p className="grey-text">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            ipsa accusantium doloremque rem laudantium totam aperiam.
                        </p>
                        <ul className="list-unstyled mb-0">
                            <a href="#!" className="p-2 fa-lg">
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
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa
                            qui officia deserunt mollit anim est fugiat nulla id eu laborum.
                        </p>
                        <ul className="list-unstyled mb-0">
                            <a href="#!" className="p-2 fa-lg">
                                <MDBIcon fab icon="linkedin-in"  />
                            </a>

                        </ul>
                    </MDBCol>


                </MDBRow>
            </MDBCardBody>
        </MDBCard>
    );
}

export default withStyles(styles)(TeamPage);