import React, { Component, forwardRef } from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import { Button, Typography } from '@material-ui/core';
import AddParentForm from './AddParentForm';
const { ipcRenderer } = window.require('electron');


export default class StudentTable extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      columns: [
        { title: 'Student ID', field: 'student_id' },
        { title: 'First', field: 'first_name' },
        { title: 'Middle', field: 'middle_name' },
        { title: 'Last Name', field: 'last_name' },
        { title: 'Math', field: 'math' },
        { title: 'Reading', field: 'reading' },
        { title: 'Attendance', field: 'attendance' }
      ],
      data: [
        {
          student_id: 1231241536,
          first_name: 'Jonah',
          middle_name: 'Steven',
          last_name: 'Lee',
          math: 'true',
          reading: 'false',
          attendance: 'here',
          checkIn: false,
          checkOut: false
        }
      ],
      students: [],
    };
    this.getAllStudents();
    this.backendCall = this.backendCall.bind( this );
  }
  
  tableIcons = {
    Add: forwardRef( ( props, ref ) => <AddBox {...props} ref={ref}/> ),
    Check: forwardRef( ( props, ref ) => <Check {...props} ref={ref}/> ),
    Clear: forwardRef( ( props, ref ) => <Clear {...props} ref={ref}/> ),
    Delete: forwardRef( ( props, ref ) => <DeleteOutline {...props} ref={ref}/> ),
    DetailPanel: forwardRef( ( props, ref ) => <ChevronRight {...props} ref={ref}/> ),
    Edit: forwardRef( ( props, ref ) => <Edit {...props} ref={ref}/> ),
    Export: forwardRef( ( props, ref ) => <SaveAlt {...props} ref={ref}/> ),
    Filter: forwardRef( ( props, ref ) => <FilterList {...props} ref={ref}/> ),
    FirstPage: forwardRef( ( props, ref ) => <FirstPage {...props} ref={ref}/> ),
    LastPage: forwardRef( ( props, ref ) => <LastPage {...props} ref={ref}/> ),
    NextPage: forwardRef( ( props, ref ) => <ChevronRight {...props} ref={ref}/> ),
    PreviousPage: forwardRef( ( props, ref ) => <ChevronLeft {...props} ref={ref}/> ),
    ResetSearch: forwardRef( ( props, ref ) => <Clear {...props} ref={ref}/> ),
    Search: forwardRef( ( props, ref ) => <Search {...props} ref={ref}/> ),
    SortArrow: forwardRef( ( props, ref ) => <ArrowDownward {...props} ref={ref}/> ),
    ThirdStateCheck: forwardRef( ( props, ref ) => <Remove {...props} ref={ref}/> ),
  };
  
  onRowDelete( oldData ) {
    new Promise( resolve => {
      setTimeout( () => {
        resolve();
        this.setState( prevState => {
          const data = [...prevState.data];
          data.splice( data.indexOf( oldData ), 1 );
          return { ...prevState, data };
        } );
      }, 600 );
    } )
  }

  async backendCall( path, arg ) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send( `${path}`, arg, path )
      ipcRenderer.once(`/return${path}`,(event, result) => {
        resolve( result);
      });
    });
  }
  
  getStudent(student_id) {
    this.backendCall('/student/getOne', student_id ).then( ( response ) => {
      console.log('Got student: ' + response.student);
    })
  }
  
  getAllStudents() {
    this.backendCall('/student/getAll', 'wgr').then((response) => {
      this.setState({ students: response })
    })
  }
  
  addStudent( info ) {
    const student = {
      // student_id: 1231241536,
      // first_name: 'john',
      // middle_name: 'lee',
      // last_name: 'fox',
      // math: true,
      // reading: false,
      // notes: 'student test',
      // parent1_id: 1,
      // parent2_id: 2
      student_id: info.student_id,
      first_name: info.first_name,
      middle_name: info.middle_name,
      last_name: info.last_name,
      math: info.math,
      reading: info.reading,
      notes: info.notes,
      parent1_id: info.parent1_id,
      parent2_id: info.parent2_id
    };
    this.backendCall( '/student/add', student ).then( res => console.log( res ) );
  }
  
  checkIn( student_id ) {
    console.log( student_id );
    let checkedIn = null;
    this.backendCall( '/student/checkIn', student_id ).then( ( response ) => {
      checkedIn = response.message;
      console.log(checkedIn)
    } );
    if ( checkedIn === ' Checking In' ) {
      let data = this.state.data;
      data.checkIn = true;
      this.setState( { data: data }, () => { console.log(this.setState(data))} );
    }
  }
  
  components = {
    Action: props => {
      if ( !props.data.checkIn ) {
        return (
          <Button
            onClick={() => this.checkIn( props.data.student_id )}
            color="primary"
            variant="contained"
            style={{ height: 35, width: 110 }}
          >
            Check In
          </Button>
        )
      }
      if ( props.data.checkIn && !props.data.checkOut ) {
        return (
          <Button
            onClick={() => this.checkIn( props.data.student_id )}
            color="primary"
            variant="contained"
            style={{ height: 35, width: 110 }}
          >
            Check In
          </Button>
        )
      }
    }
  };
  
  render() {
    return (
      <>
        <MaterialTable
          icons={this.tableIcons}
          title="Students"
          columns={this.state.columns}
          data={this.state.students}
          options={{ actionsColumnIndex: -1 }}
          components={this.components}
          actions={[
            { icon: 'checkIn' },
          ]}
        />
        <AddParentForm />
        <Typography>{this.props.data}</Typography>
      </>
    );
  }
}