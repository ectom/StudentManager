import React, { forwardRef } from 'react';
// import StudentController from '../../server/controllers/student';
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


export default function StudentTable(props) {
  
  const tableIcons = {
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
  
  const [state, setState] = React.useState( {
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
        student_id: 1,
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
  } );
  
  // eslint-disable-next-line no-unused-vars
  function onRowDelete( oldData ) {
    new Promise( resolve => {
      setTimeout( () => {
        resolve();
        setState( prevState => {
          const data = [...prevState.data];
          data.splice( data.indexOf( oldData ), 1 );
          return { ...prevState, data };
        } );
      }, 600 );
    } )
  }
  
  
  // TODO make this the update function once working
  function checkIn( data ) {
    const student = {
      student_id: 1231241536,
      first_name: 'john',
      middle_name: 'lee',
      last_name: 'fox',
      math: true,
      reading: false,
      notes: 'student test',
      parent1_id: 1,
      parent2_id: 2
      // student_id: data.student_id,
      // first_name: data.first_name,
      // middle_name: data.middle_name,
      // last_name: data.last_name,
      // math: data.math,
      // reading: data.reading,
      // notes: data.notes,
      // parent1_id: data.parent1_id,
      // parent2_id: data.parent2_id
    };
    doPost( '/student/add', student ).then( res  => console.log(res));
    
    // StudentController.addStudent(student);
    // TODO update checkIn field to true
  }
  
  async function doPost(path, data) {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: data})
    });
    const body = await response.json();
    
    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  }
  
  async function doGet(path, data=null) {
    let response;
    let body;
    if(data){
      response = await fetch(path, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: data})
      });
    } else {
      response = await fetch(path, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });
      body = await response.json();
    }
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  }
  
  // TODO make checkin function
  function chewckIn( student_id ) {
    console.log( student_id )
  }
  const components = {
    Action: props => {
      if ( !props.data.checkIn ) {
        return (
          <Button
            onClick={() => checkIn( props.data.student_id )}
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
            onClick={() => checkIn( props.data.student_id )}
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
  
  return (
    <>
    <MaterialTable
      icons={tableIcons}
      title="Students"
      columns={state.columns}
      data={state.data}
      options={{ actionsColumnIndex: -1 }}
      components={components}
      actions={[
        { icon: 'checkIn' },
      ]}
    />
    <Typography>{props.data}</Typography>
    </>
  );
}