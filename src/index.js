import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import zhCN from 'antd/es/locale/zh_CN';
import {LocaleProvider}  from 'antd'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import {mainRouter} from './routes'
import './index.less'
import store from './store'
import { Provider } from 'react-redux'


ReactDOM.render(
    <Provider store={store}>
        <LocaleProvider locale={zhCN}> 
            <Router>
                <Switch>
                    <Route path="/summitexam" component={App}/>
                    {
                        mainRouter.map(item=>{
                            return <Route key={item.pathname} path={item.pathname} component={item.component}/>
                        })
                    }
                    
                    <Redirect to="/summitexam" from="/"  exact/>
                    <Redirect to="/404"/>
                </Switch>
            </Router>
        </LocaleProvider>
    </Provider>,
    document.getElementById('root')
);

