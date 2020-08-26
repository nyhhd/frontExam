import React, { Component } from 'react'
import {register, checkData} from '../../requests'
import { Form, Input, InputNumber, Button, Card } from 'antd'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
  
const validateMessages = {
    required: 'This field is required!',
    types: {
        email: 'Not a validate email!',
        number: 'Not a validate number!',
    },
    number: {
        range: 'Must be between ${min} and ${max}',
    },
};
  
@Form.create()
class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 'text',
        };
    }
    
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                register(values)
                    .then(resp =>{
                        this.props.history.push({
                            pathname:'/login',
                            params:{userName:values.userUsername}
                        })
                        console.log(resp);
                    })
            }
        })
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('userPassword')) {
          callback('两次密码输入不一致!');
        } else {
          callback();
        }
    };

    validateSqlData = (rule, value, callback) => {
        var type = "";
        if(rule.field == "userUsername"){
            type = 1
        }else if(rule.field == "userEmail"){
            type = 3
        }else if(rule.field == "userPhone"){
            type = 2
        }
        if(null != value && value != "" && type != ""){
            checkData(type,value).then(
                resp => {
                    if(resp.code != 200){
                        callback(resp.msg);
                    }else{
                        callback();
                    }
                }
            )
        }else{
            callback();
        } 
    }

    handleStuts = () =>{
        this.setState({
            type:"password"
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Card title="在线考试系统用户注册" extra={
                <Button type="primary" ghost onClick= {() =>{
                    this.props.history.push('/login')
                }}>返回登录</Button>} style={{margin:'0 auto',width:800,alignItems: 'center'}} onClick={this.handleStuts}>
                    <Form {...layout} name="nest-messages"  onSubmit={this.handleSubmit} validatemessages={validateMessages}>
                        <Form.Item  label="用户登录名">
                            {getFieldDecorator('userUsername', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入用户登录名',
                                    },
                                    {
                                        validator: this.validateSqlData,
                                    },
                                ],
                            })(<Input  name="userUsername"/>)}
                        </Form.Item>
                        <Form.Item  label="用户昵称">
                            {getFieldDecorator('userNickname', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入用户昵称',
                                    }
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="用户密码" >
                        {getFieldDecorator('userPassword', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码!',
                                }
                            ],
                            initialValue: ""
                        })(<Input type={this.state.type}/>)}
                        </Form.Item>
                        <Form.Item label="确认密码" >
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: '请确认你的密码!',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input type={this.state.type}/>)}
                        </Form.Item>
                        <Form.Item  label="用户邮箱">
                            {getFieldDecorator('userEmail', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入邮箱',
                                    },
                                    {
                                        validator: this.validateSqlData,
                                    }
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item  label="手机号">
                            {getFieldDecorator('userPhone', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入你的手机号',
                                    },
                                    {
                                        validator: this.validateSqlData,
                                    }
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item  label="自我描述">
                            {getFieldDecorator('userDescription', {
                            })(<Input.TextArea />)}
                        </Form.Item>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 12 }}>
                            <Button type="primary" htmlType="submit">
                            提交
                            </Button>
                        </Form.Item>
                    </Form>
            </Card>
        )
    }
}
export default Register;