import React, { Component } from 'react';
import { Paper, TextField, Checkbox, Button, FormControl, FormControlLabel } from '@material-ui/core';

export default class StudentTable extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      student_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      math: false,
      reading: false,
      notes: ''
    }
  }
  
  handleCheckbox( subject ) {
    if ( subject === 'math' ) {
      this.setState( { math: !this.state.math } );
    } else {
      this.setState( { reading: !this.state.reading } );
    }
  }
  
  submitStudent() {
  
  }
  
  render() {
    return (
      <>
        <Paper>
          <FormControl onSubmit={this.submitStudent} autoComplete="off">
            <TextField label={'Student ID'} name="student_id" variant="standard"/>
            <TextField label={'First Name'} name="first_name" variant="standard"/>
            <TextField label={'Middle Name'} name="middle_name" variant="standard"/>
            <TextField label={'LastName'} name="last_name" variant="standard"/>
            <FormControlLabel
              style={{justify: 'left'}}
              value="math"
              control={<Checkbox name='math' onChange={() => {
                this.handleCheckbox( 'math' )
              }} />}
              label="Math"
              labelPlacement="start"
            />
            <FormControlLabel
              style={{justify: 'left'}}
              value="math"
              control={<Checkbox name='reading' onChange={() => {
                this.handleCheckbox( 'reading' )
              }} />}
              label="Reading"
              labelPlacement="start"
            />
            <TextField multiline={true} label={'Notes'} rows={4} name="notes" variant="standard"/>
            <Button type={'submit'}>Submit</Button>
          </FormControl>
        </Paper>
      </>
    );
  };
}