import React, { Component } from 'react';
import { Paper, TextField, Button, Typography } from '@material-ui/core';

export default class StudentTable extends Component {
  constructor( props ) {
    super( props );
  }
  
  render() {
    return (
      <>
        <Paper>
          
          <form autoComplete="off">
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </form>
        </Paper>
      </>
    );
  };
}