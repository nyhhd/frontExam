import React, { Component } from 'react'

import { Table, Card, Input,Button, Modal,Typography, message, Select} from 'antd';
import {selectUsers, deleteUserById, updateUser} from '../../requests'
import EditMod from './EditMod.js'

const { Search } = Input;
const ButtonGroup = Button.Group;
const { Option } = Select;

export default class UserManage extends Component {
    constructor(props){
        super(props)
        this.state = {
            data:[],
            columns:[],
            userUsername:"",
            roleId:"",
            visible: false,
            record:""
        }
    }
    
    componentDidMount(){
        this.getData()
    }
  
    getData = () => {
        selectUsers(this.state.userUsername, 1).then(
          resp =>{
            this.createColumns();
            this.setState({
              data:resp.data
            })
          }
        )
    }

    showDeleteModal = (record) => {
        // 使用函数的方式调用，定制化没那么强
        Modal.confirm({
          title: '此操作不可逆，请谨慎！！！',
          content: <Typography>确定要删除<span style={{color: '#f00'}}>{record.userNickname}</span>吗？</Typography>,
          okText: '别磨叽！赶紧删除！',
          cancelText: '我点错了！',
          onOk:()=> {
            deleteUserById(record.userId)
              .then(resp => {
                message.success("删除成功");
                this.getData();
              })
          }
        })
    }

    showModal =  (record) => {
        // 使用函数的方式调用，定制化没那么强
        if(this.state.roleId != "" && record.userRoleId != this.state.roleId){
            record.userRoleId = this.state.roleId
        }
        Modal.confirm({
          title: '更新用户权限',
          content: <Typography>确定要更新<span style={{color: '#f00'}}>{record.userNickname}</span>的权限吗？</Typography>,
          okText: '别磨叽！赶紧更新！',
          cancelText: '我点错了！',
          onOk:()=> {
            updateUser(record)
              .then(resp => {
                message.success("更新成功");
                this.getData();
              })
          }
        })
    }

    showEditModal = (item) => {
      this.setState({
        visible: true,
        record: item,
      });
    }

    hideModal = () => {
      this.setState({
        visible: false,
      });
      this.getData();
    };

    handleChange = (record, value) => {
        this.setState({
            roleId:value
        },()=>{
          this.showModal(record)
        })
    }

    createColumns = () =>{
        const columns = [{
            title: '用户登录名',
            dataIndex: 'userUsername',
          },{
            title: '用户展示名',
            dataIndex: 'userNickname',
          },{
            title: '用户角色',
            align: 'center',
            dataIndex: 'userRoleId',
            render:(text, record)=>{
                return (
                    <Select defaultValue={text} onChange={this.handleChange.bind(this,record)}>
                        <Option value="2">出题者</Option>
                        <Option value="3">考生</Option>
                    </Select>
                );
            }
          },{
            title: '用户手机号',
            align: 'center',
            dataIndex: 'userPhone',
          },{
            title: '用户邮箱',
            align: 'center',
            dataIndex: 'userEmail',
          },{
            title: '用户备注',
            align: 'center',
            dataIndex: 'userDescription',
          },{
            title: '用户更新时间',
            align: 'center',
            dataIndex: 'updateTime',
            render:(text, record)=>{
              return this.transformTime(text);
            }
          },{
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text, record) => {
              return (
                <ButtonGroup>
                  <Button size="small" type="primary" onClick={this.showEditModal.bind(this, record)}>更新</Button>
                  <Button size="small" type="danger" onClick={this.showDeleteModal.bind(this, record)}>删除</Button>
                </ButtonGroup>
              )
            }
          }];
          this.setState({
            columns
          })
    }

    transformTime = (time) => {
        var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date.toJSON().substr(0, 19).replace('T', ' ');
    }

    render() {
        return (
            <div style={{padding: '24px 32px',backgroundColor:'#fff'}}>
                <EditMod visible= {this.state.visible}  record={this.state.record}  hideModal={this.hideModal} ></EditMod>
                <Card title="用户管理页面" 
                    extra={<Search placeholder="输入用户登录名" onSearch={value => {
                    this.setState({
                       userUsername:value
                    },()=>{
                        this.getData()
                    })
                    }}
                    style={{ width: 200 }}/>} 
                    style={{ minHeight: 480}}>
                    <Table columns={this.state.columns} dataSource={this.state.data} style={{padding: '24px 32px'}}/>
                </Card>
            </div>
        )
    }
}
