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
import Package from './components/service/Package'
import FNF from './components/service/FNF'
import Flexiplan from './components/service/Flexiplan'
import ConnectWithOthers from './components/service/ConnectWithOthers'
//import SocketConnection from './components/SocketConnection'
import History from './components/History'
import Feedback from './components/service/Feedback'
import Recharge from './components/service/Recharge'
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
            <Route path="/package" component={Package}></Route>
            <Route path="/fnf" component={FNF}></Route>
            <Route path="/flexiplan" component={Flexiplan}></Route>
            <Route path="/connect" component={ConnectWithOthers}></Route>
            <Route path="/history" component={History}></Route>
            <Route path="/feedback" component={Feedback}></Route>
            <Route path="/recharge" component={Recharge}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
