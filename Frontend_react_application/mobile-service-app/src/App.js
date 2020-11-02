import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Signup from './components/auth/Signup'
import AdminLogin from './components/admin/AdminLogin'
import Login from './components/auth/Login'
import UserDashboard from './components/dashboard/UserDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import EditPersonDetails from './components/dashboard/EditPersonDetails'
import logo from './images/5.jpg'
import 'nprogress/nprogress.css'

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
            <Route path="/login" component={Login}></Route>
            <Route path="/admin/login" component={AdminLogin}></Route>
            <Route path="/dashboard/edit" component={EditPersonDetails}></Route>
            <Route path="/dashboard" component={UserDashboard}></Route>
            <Route path="/admin/dashboard" component={AdminDashboard}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
