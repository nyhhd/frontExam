import React, { Component } from 'react'
import { Modal, Input, Select, message} from 'antd';
import { Form, InputNumber, Button, Card } from 'antd'
import {checkData, updateUser} from '../../requests'

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

@Form.create()
class EditMod extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: props.record,
        };
    }

    hideOkModal = ()=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const user = this.props.record
                user.userEmail = values.userEmail
                user.userPhone = values.userPhone
                user.userPassword = values.userPassword
                updateUser(user)
                    .then(resp => {
                        message.success("更新成功");
                        this.props.hideModal();
                    }       
                )}
                
        })
        
    }
      
    hideCancelModal = () => {  
        this.props.hideModal();
    }
    
    validateSqlData = (rule, value, callback) => {
        var type = "";
        var flag = true;   //不和自己的作比较
        
        if(rule.field == "userUsername"){
            type = 1
            if(value == this.props.record.userUsername){
                flag = false;
            }
        }else if(rule.field == "userEmail"){
            type = 3
            if(value == this.props.record.userEmail){
                flag = false;
            }
        }else if(rule.field == "userPhone"){
            type = 2
            if(value == this.props.record.userPhone){
                flag = false;
            }
        }
        
        if(null != value && value != "" && type != "" && flag){
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
            title={"编辑"+this.props.record.userUsername+"的基本信息"}
            visible={this.props.visible}
            onOk={this.hideOkModal}
            onCancel={this.hideCancelModal}
            destroyOnClose={true}
            okText="确认"
            cancelText="取消"
          >
            <Form {...layout} name="nest-messages"  onSubmit={this.handleSubmit} >
                <Form.Item label="用户密码" >
                        {getFieldDecorator('userPassword', {
                        })(<Input/>)}
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
                        initialValue: this.props.record.userEmail
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
                        initialValue: this.props.record.userPhone
                    })(<Input />)}
                </Form.Item>
            </Form>
          </Modal>
        )
    }
}

export default EditMod