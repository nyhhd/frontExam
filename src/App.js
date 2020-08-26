import React, { Component } from 'react';
import {Route,Switch, Redirect} from 'react-router-dom'
import {summitExamRouter} from './routes'

import {Frame} from './components'
import { connect } from 'react-redux'

//控制导航栏菜单显示


const mapState = state => ({
  isLogin: state.user.isLogin,
  user: state.user
})

@connect(mapState)
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      menus:[]
    }
    
  }

  componentDidMount(){
    this.change()
  }

  change = () => {
    const menus = summitExamRouter.filter(route=>{
      const userRoleId = this.props.user.userRoleId;
      let roles
      if(undefined != route.isRole){
        roles = route.isRole.indexOf(userRoleId);
      }
      return route.isNav === true && (roles != -1)
    });
    this.setState({
      menus
    })
  }

  render(){
    return (
      this.props.isLogin
      ?
      <Frame menus={this.state.menus}>
        <Switch>
            {
              summitExamRouter.map(route =>{
                return (
                  <Route 
                    key={route.pathname}
                    path={route.pathname}
                    component={route.component}
                  />
                )
              })
            }
            <Redirect to={summitExamRouter[0].pathname} from='/summitexam' exact />
            <Redirect to="/404" />
        </Switch>
      </Frame>
      :
      <Redirect to='/login' />
    );
  }
}


export default App;
