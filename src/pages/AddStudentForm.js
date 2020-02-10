import React, { Component } from 'react';
import { Paper, TextField, Checkbox, Button, FormControl, FormControlLabel } from '@material-ui/core';
const { ipcRenderer } = window.require('electron');

// TODO make this a modal, create correct creation flow: parents -> students

export default class StudentForm extends Component {
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
    this.backendCall = this.backendCall.bind( this );
  }
  
  handleCheckbox( subject ) {
    if ( subject === 'math' ) {
      this.setState( { math: !this.state.math } );
    } else {
      this.setState( { reading: !this.state.reading } );
    }
  }
  
  async backendCall( path, arg ) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send( `${path}`, arg, path )
      ipcRenderer.once(`/return${path}`,(event, result) => {
        resolve( result);
      });
    });
  }
  
  submitStudent() {
    console.log(this.state)
    this.backendCall('/student/add', { data: this.state }).then((response) => {
      console.log(response)
    })
  }
  
  handleInput(event, key) {
    this.setState({ [key]: event.target.value });
  }
  
  render() {
    return (
      <>
        <Paper>
          <FormControl autoComplete="off">
            <TextField label={'Student ID'} name="student_id" variant="standard" onChange={(e) => this.handleInput(e,'student_id')}/>
            <TextField label={'First Name'} name="first_name" variant="standard" onChange={(e) => this.handleInput(e,'first_name')}/>
            <TextField label={'Middle Name'} name="middle_name" variant="standard" onChange={(e) => this.handleInput(e,'middle_name')}/>
            <TextField label={'LastName'} name="last_name" variant="standard" onChange={(e) => this.handleInput(e,'last_name')}/>
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
            <TextField multiline={true} label={'Notes'} rows={4} name="notes" variant="standard" onChange={(e) => this.handleInput(e,'notes')}/>
            <Button onClick={() => this.submitStudent()}>Submit</Button>
          </FormControl>
        </Paper>
      </>
    );
  };
}