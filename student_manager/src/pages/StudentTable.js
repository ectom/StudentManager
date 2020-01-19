import React, { forwardRef } from 'react';
// import Database from '../models/mydb';
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
import Button from '@material-ui/core/Button';


export default function StudentTable() {
  
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
  
  function checkIn( student_id ) {
    console.log( student_id )
    // TODO update checkIn field to true
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
  );
}