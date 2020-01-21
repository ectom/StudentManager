import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import StudentTable from './pages/StudentTable';

class App extends Component {
  state = {
    data: null
  };
  
  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
    .then(res => this.setState({ data: res.express }))
    .catch(err => console.log(err));
  }
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
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