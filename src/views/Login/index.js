import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Icon, Card } from 'antd';
import {connect} from 'react-redux'
import { Redirect} from 'react-router-dom'
import {login} from '../../actions/user'
import './login.less'

const mapState = state => ({
   isLogin : state.user.isLogin,
   isLoading : state.user.isLoading
})


@connect(mapState, { login })
@Form.create()
class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values)
            }
        })
    };
    
    handleRegister = e =>{
        this.props.history.push('/register')
    }

    render() {
        var usrName;
        const { getFieldDecorator } = this.props.form;
        // console.log(this.props.location.params);
        this.props.location.params ? usrName = this.props.location.params.userName : usrName = ""
        return (
            this.props.isLogin
            ?
            <Redirect to='/summitexam'/>
            :
            <Card title="SummitExam登录" className="login">
                <Form
                name="normal_login"
                className="login-form"
                initialvalues={{
                    remember: false,
                }}
                onSubmit={this.handleSubmit}
                >
                <Form.Item>
                   {getFieldDecorator('username', {
                        rules: [{ required: true, message: '用户名必须' }],
                        initialValue: usrName
                    })(
                    <Input
                        disabled={this.props.isLoading}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="用户名"
                    />,
                    )}
                </Form.Item>
                <Form.Item>
                     {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码必须' }],
                      })(
                        <Input
                          disabled={this.props.isLoading}
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          type="password"
                          placeholder="密码"
                        />,
                      )}
                </Form.Item>
                <Form.Item name="remember" valuepropname="checked"  >
                    {
                        getFieldDecorator('remember', {
                            valuepropname: 'checked',
                            initialValue: false
                        })
                        (<div style={{display:'flex'}}>
                                <Checkbox disabled={this.props.isLoading} style={{flex:1}}>记住我</Checkbox>
                                <div style={{flex:1,textAlign:"right"}}><a onClick={this.handleRegister}>注册账号</a></div>
                        </div>)
                    }
                </Form.Item>
            
                <Form.Item>
                    <Button loading={this.props.loading} type="primary" htmlType="submit" className="login-form-button" style={{width:'100%'}}>
                    登录
                    </Button>
                </Form.Item>
                </Form>
            </Card>
          )
    }
}

export default Login