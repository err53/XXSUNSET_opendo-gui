import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import LabelIcon from '@material-ui/icons/Label';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import routes from '../constants/routes';

const fs = require('fs');
const dir = require('os')
  .homedir()
  .concat('/.open-do');

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

function ResponsiveDrawer(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [data, setData] = React.useState({
    baseLists: {
      Inbox: [
        {
          Name: 'Welcome to Open Do!',
          Completed: false,
          Priority: 4,
          StartDate: null,
          DueDate: null,
          Project: null,
          Contexts: []
        }
      ],
      Next: []
    },
    userLists: {}
  });
  const [init, setInit] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  async function updateStateFromFile() {
    if (fs.existsSync(dir.concat('/data.json'))) {
      await console.log('File Exists!');
      const obj = JSON.parse(
        await fs.readFileSync(dir.concat('/data.json'), 'utf8')
      );
      await setData(obj);
      await console.log('Parsed File:');
      console.log(obj);
    }
  }

  async function updateFileFromState() {
    await console.log('Writing File...');
    await fs.writeFileSync(
      dir.concat('/data.json'),
      JSON.stringify(data),
      'utf8',
      err => {
        if (err) {
          throw err;
        }
      }
    );
    console.log('File Written!');
  }

  async function initState() {
    // Initialise the state of the app on load
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }
    await updateStateFromFile();
    await updateFileFromState();
    await setInit(true);
    await console.log('Init Finished! Logging data:');
    console.log(data);
  }
  // Run init function on first load
  React.useEffect(() => {
    async function firstInit() {
      if (!init) {
        await console.log('Database has not been initialized!');
        await initState();
      }
      console.log('Database is initialized!');
    }
    firstInit();
  }, []);

  React.useEffect(() => {
    // Run this everytime data is refreshed and on the first run
  }, [data]);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List subheader={<ListSubheader component="div">Lists</ListSubheader>}>
        {['Inbox', 'Next'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <LabelImportantIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        {['Waiting', 'Scheduled', 'Someday'].map(text => (
          <ListItem button key={text}>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography variant="h2" gutterBottom>
          Home
        </Typography>
        <Link to={routes.COUNTER}>to Counter</Link>
      </main>
    </div>
  );
}

export default ResponsiveDrawer;
