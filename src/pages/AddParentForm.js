import React, { Component } from 'react';
import { Backdrop, Typography, Paper, Modal, Fade, TextField, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Select, MenuItem } from '@material-ui/core';
const { ipcRenderer } = window.require('electron');

// TODO make this a modal, create correct creation flow: parents -> students

export default class ParentForm extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      parent: {
        first_name: '',
        middle_name: '',
        last_name: '',
        carrier: '',
        phone_number: '',
        email: '',
        messaging: false,
        emailing: false,
        guardian: '',
        notes: ''
      },
      modal: false
    };
    this.backendCall = this.backendCall.bind( this );
  }
  
  handleCheckbox( subject ) {
    if ( subject === 'messaging' ) {
      this.setState( { messaging: !this.state.messaging } );
    } else {
      this.setState( { emailing: !this.state.emailing } );
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
  
  submitParent() {
    console.log(this.state)
    this.backendCall('/parent/add', { data: this.state.parent }).then((response) => {
      console.log(response)
    })
  }
  
  handleInput(event, key) {
    this.setState({ [key]: event.target.value });
  }
  
  handleSelector(e){
    this.setState({guardian: e.target.value});
  };
  
  handleOpen = () => {
    this.setState({ modal: true });
  };
  
  handleClose = () => {
    this.setState({ modal: false});
  };
  
  
  classes = {
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white'
    },
    paper: {
      backgroundColor: 'white',
      minWidth: 500,
      padding: 75,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 30
    }
  };
  
  render() {
    return (
      <>
        <Button type="button" onClick={this.handleOpen}>
          Add Parent
        </Button>
        <Modal
          style={this.classes.modal}
          open={this.state.modal}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.modal}>
            <Paper style={this.classes.paper}>
              <FormControl autoComplete="off">
                <Typography style={this.classes.title}>Add Parent</Typography>
                <TextField label={'First Name'} name="first_name" variant="standard" onChange={(e) => this.handleInput(e,'first_name')}/>
                <TextField label={'Middle Name'} name="middle_name" variant="standard" onChange={(e) => this.handleInput(e,'middle_name')}/>
                <TextField label={'Last Name'} name="last_name" variant="standard" onChange={(e) => this.handleInput(e,'last_name')}/>
                <TextField label={'Cell Phone Carrier'} name="carrier" variant="standard" onChange={(e) => this.handleInput(e,'carrier')}/>
                <TextField label={'Phone Number'} name="phone_number" variant="standard" onChange={(e) => this.handleInput(e,'phone_number')}/>
                <TextField label={'Email'} name="email" variant="standard" onChange={(e) => this.handleInput(e,'email')}/>
                <FormControl>
                  <InputLabel>Guardian</InputLabel>
                  <Select
                    value={this.state.guardian}
                    onChange={(e) => this.handleSelector(e)}
                  >
                    <MenuItem value={'Father'}>Father</MenuItem>
                    <MenuItem value={'Mother'}>Mother</MenuItem>
                    <MenuItem value={'Uncle'}>Uncle</MenuItem>
                    <MenuItem value={'Aunt'}>Aunt</MenuItem>
                    <MenuItem value={'Brother'}>Brother</MenuItem>
                    <MenuItem value={'Sister'}>Sister</MenuItem>
                    <MenuItem value={'Cousin'}>Cousin</MenuItem>
                    <MenuItem value={'Other'}>Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  style={{justify: 'left'}}
                  value="messaging"
                  control={<Checkbox name='messaging' onChange={() => {
                    this.handleCheckbox( 'messaging' )
                  }} />}
                  label="Can we text you"
                  labelPlacement="start"
                />
                <FormControlLabel
                  style={{justify: 'left'}}
                  value="emailing"
                  control={<Checkbox name='emailing' onChange={() => {
                    this.handleCheckbox( 'emailing' )
                  }} />}
                  label="Can we email you?"
                  labelPlacement="start"
                />
                <TextField multiline={true} label={'Notes'} rows={4} name="notes" variant="standard" onChange={(e) => this.handleInput(e,'notes')}/>
                <Button onClick={() => this.submitParent()}>Submit</Button>
              </FormControl>
            </Paper>
          </Fade>
        </Modal>
      </>
    );
  };
}
