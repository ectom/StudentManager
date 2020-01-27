import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import StudentTable from './pages/StudentTable';
const { ipcRenderer, remote } = window.require('electron');
// const electron = require('electron');
// const fs = electron.remote.require('fs');
// const ipcRenderer  = electron.ipcRenderer;

class App extends Component {
  state = {
    data: null
  };
  
  componentDidMount() {
    // Call our fetch function below once the component mounts
    const res = this.callBackendAPI()
    this.setState({ data: res.data });
    console.log(this.state.data)
    
  }
  callBackendAPI = async () => {
    // ipcRenderer.send('/express_backend')
    // ipcRenderer.once('/backend_reply', ( err, result ) => {
    //   console.log('got config', result)
    // })
    ipcRenderer.send('/12345', 'ping');
    ipcRenderer.on('/54321', (event, res) => {
      console.log(event, res)
      return res
    })
    // const response = await fetch('/express_backend');
    // const body = await response.json();
    // if (response.status !== 200) {
    //   throw Error(body.message)
    // }
    // return body;
  };
  
  render() {
    return (
      <>
        <Navbar/>
        <StudentTable data={this.state.data}/>
      </>
    );
  }
}

export default App;