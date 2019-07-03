import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import PropTypes from 'prop-types';
import routes from '../constants/routes';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function ListPage(props) {
  const classes = useStyles();
  const { list, updateCheckbox, updateText } = props;
  const items = list.map(item => item.name);

  let timer = null;
  let value = '';

  const handleChange = event => {
    console.log(event.target.value);
    value = event.target.value;
  }

  function handleKeyDown(e, index) {
    if (e.keyCode === ENTER_KEY) {
      triggerChange(index);
    }
  }

  function triggerChange(index) {
    updateText(index, value);
  }

  return (
    <List>
      {list
        ? items.map((text, index) => (
            <ListItem key={text}>
              <Checkbox
                checked={list[index].completion}
                onChange={(event, checked) => {
                  updateCheckbox(index, checked);
                  // console.log('ping!');
                  // console.log(text);
                  // console.log(checked);
                  // console.log(this.props);
                }}
              />
              <input type="text" value={text} onChange={handleChange} />
              <InputBase
                className={classes.margin}
                defaultValue={text}
                inputProps={{ 'aria-label': 'naked' }}
                onChange={handleChange}
                onKeyDown={e => {
                  handleKeyDown(e, index);
                }}
              />
            </ListItem>
          ))
        : null}
    </List>
  );
}
