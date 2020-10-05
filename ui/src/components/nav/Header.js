import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Store from "../../store/Store";
import {autorun} from "mobx";
import UserDetails from "./UserDetails";
import {NavLink} from "react-router-dom";

import HomeIcon from '@material-ui/icons/Home';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function Header(props) {
  const { classes, onDrawerToggle } = props;

  useEffect(()=>autorun(()=>{
    Store.validate();
  }));

  const userinfo = Store.signedIn ?
     <UserDetails/>:
      null;

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>

        <Toolbar>
          <Grid container
                direction='row'
                alignItems='center'
                justify='space-between'
                spacing={1}
               >
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item>
              <Grid
                  container
                  direction='row'
                  alignItems='center'
                  justify='flex-start'
                  spacing={1}
              >
                <Grid item>
                  <Link className={classes.link}
                        component={NavLink} to='/' exact
                        activeStyle={{
                          fontWeight: 'bold',

                          color: 'white',
                        }}
                        variant="body1"
                  >
                   <HomeIcon />
                  </Link>
                </Grid >
                <Grid item>
                  <Link className={classes.link}
                        component={NavLink} to='/about' exact
                        activeStyle={{
                          fontWeight: 'bold',

                          color: 'white'
                        }}
                        variant="body1"
                  >
                    Meet The Team
                  </Link>
                </Grid >
              </Grid>
            </Grid>

            <Grid item >
              {userinfo}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
