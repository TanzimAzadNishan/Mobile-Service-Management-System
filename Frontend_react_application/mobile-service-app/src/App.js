import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Signup from './components/auth/Signup'
import logo from './images/5.jpg'

class App extends Component{
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <img src={logo} alt="logo" className="logo"/>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/signup" component={Signup}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
