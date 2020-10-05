import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AppsIcon from '@material-ui/icons/Apps';
import ApplicationsList from "../applications/ApplicationsList";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import HashtagFilter from "../filters/HashtagFilter";
import TimeFiltersRadio from "../filters/TimeFiltersRadio";

const categories = [
  {
    id: 'Filters',
    children: [
        { id: 'HashTag', icon: <LocalOfferIcon />, childElement: <HashtagFilter/>},
        { id: 'Date Range', icon: <DateRangeIcon /> ,childElement: <TimeFiltersRadio/>},
    ],
  },
];

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemActiveItem: {
    backgroundColor: '#9370db',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  appIcon:{
    color: theme.palette.common.white,
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  logo:{
    backgroundImage: 'url("/images/minerva.png")',
    backgroundRepeat : 'no-repeat',
    backgroundSize: 'contain',
    width : '150px',
    height: '100px',
    margin: 'auto',
  },
  inlineItem: {
    display: 'inline-block',
    paddingTop: 1,
    paddingBottom: 1,
    marginBottom : theme.spacing(2),
    color: 'rgba(255, 255, 255, 0.7)',

  },
});

function Navigator (props) {
  const { classes, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={classes.firebase}>
          <div className={classes.logo}></div>
        </ListItem>
        <ListItem className={classes.categoryHeader}>
          <ListItemIcon className={clsx(classes.itemIcon,classes.appIcon)}>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText
              classes={{
                primary: classes.categoryHeaderPrimary,
              }}
          >
            Applications
          </ListItemText>
        </ListItem>

        <ApplicationsList />


        <Divider className={classes.divider} />
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, childElement }) => (
              <ListItem
                key={childId}

                className={clsx(classes.inlineItem)}
              >
                <div style={{display: 'flex'}} className={classes.item}>
                  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                    }}
                  >
                    {childId}
                  </ListItemText>
                </div>
                {childElement}
              </ListItem>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
