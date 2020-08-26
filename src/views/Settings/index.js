import React, { Component } from 'react'
import {Menu, message} from 'antd'
import {connect} from 'react-redux'

import { Form, Input, Button } from 'antd'
import md5 from 'js-md5'
import {updateUser} from '../../requests'
import { logout } from '../../actions/user'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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
  
const mapState = state => ({
    user : state.user
})

@Form.create()
@connect(mapState, {logout })
class Settings extends Component {
    constructor(props){
        super(props)
        this.state = {
            flag:true,
            type: 'text',
        }
    }

    
    handleStuts = () =>{
        this.setState({
            type:"password"
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const user = this.props.user;
                if(undefined != values.userNickname && "" != values.userNickname){
                    user.userNickname = values.userNickname
                }
                if(undefined != values.userPassword && "" != values.userPassword){
                    user.userPassword = md5(values.userPassword)
                }
                updateUser(user)
                    .then(resp => {
                        if(resp.code == 200){
                            message.success(resp.msg);
                            this.props.logout()
                        }else{
                            message.error(resp.msg)
                        }
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

    validateData = (rule, value, callback) => {
        if(null != value && value != ""){
            if(md5(value) != this.props.user.userPassword){
                callback("密码输入错误");
            }else{
                callback();
            }
        }else{
            callback();
        }
    }

    validateStringData = (rule, value, callback) => {
        const user = this.props.user
        var str = "";
        if(null != value && value != ""){
            if(rule.field == "userNickname" && value == user.userNickname){
                str = "和原昵称重复";
            }else if(rule.field == "userPassword" && value == user.userPassword){
                str = "和原密码重复";
            }  
        }
        if(str != ""){
            callback(str);
        }else{
            callback();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const dis = this.state.flagKey ? {display : 'bolck'} : {display:'none'}
        return (
            <div style={{width:1200,marginTop:30,marginLeft:80,marginRight:80,backgroundColor:'#fff',minHeight: 480,borderRadius:10
                ,display:'flex'
            }} >
                <Menu
                    style={{ width: 256,minHeight:480}}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode='inline'
                    theme='light'
                    onClick={this.menuHandleClick}
                    >
                    <Menu.Item key="1">
                        个人信息                  
                    </Menu.Item>
                </Menu>
                <div style={{marginLeft:80,marginTop:20,alignItems: 'center'}}> 
                    <Form  {...layout} name="nest-messages" onSubmit={this.handleSubmit} validatemessages={validateMessages}>
                        <Form.Item  label="旧密码">
                            {getFieldDecorator('userOrderPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入旧密码',
                                    },{
                                        validator: this.validateData
                                    }
                                ]
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item  label="用户昵称">
                            {getFieldDecorator('userNickname', {
                                rules: [{
                                    validator: this.validateStringData,
                                }],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="用户新密码" >
                            {getFieldDecorator('userPassword', {
                                 rules: [{
                                    validator: this.validateStringData,
                                }],
                            })(<Input/>)}
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                            提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

export default  Settings