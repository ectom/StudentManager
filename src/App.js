import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import StudentTable from './pages/StudentTable';
import AddParentForm from './pages/AddParentForm';
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  
  componentDidMount() {
    this.callBackendAPI()
  }
  callBackendAPI = async () => {
    // ipcRenderer.send('/12345', 'ping');
    // ipcRenderer.once('/54321', (event, res) => {
    //   console.log(event, res)
    //   return res
    // })
    ipcRenderer.invoke('/test_backend', 'ping').then((result) => {
      this.setState({ data: result.data })
    })
  };
  
  render() {
    return (
      <>
        <Navbar/>
        <StudentTable data={this.state.data}/>
        <AddParentForm />
      </>
    );
  }
}

export default App;