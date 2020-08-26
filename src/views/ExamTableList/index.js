import React, { Component } from 'react'
import { Table, Button, Modal, Typography, message, Carousel} from 'antd';
import {WrappedAdvancedSearchForm} from '../../components'
import {Link} from 'react-router-dom'
import {getExams, deleteExam} from '../../requests'
import {connect } from 'react-redux'

import ExamModal from './examModal.js';
import IssueModal from './Modal.js';

const ButtonGroup = Button.Group;

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const dataSource = [{
  id:1,
  flag:true,
  labelName:"试卷名称",
  fieldName:"examsName",
  desc:"请输入试卷名称"
},{
  id:2,
  flag:true,
  labelName:"试卷创建者",
  fieldName:"examsCreatorNickname",
  desc:"请输入试卷创建者名称"
}];

const mapState = state => ({
  userRoleId : state.user.userRoleId
})

@connect(mapState)
class ExamTableList extends Component {
    constructor(){
      super()
      this.state = {
        total:0,
        pageNum:1,
        pageSize:10,
        data:[],
        columns:[],
        examsName:"",
        examsCreatorNickname:"",
        ExamVisible:false,
        Exam:{},
        ModalVisible:false
      }
    }

    showExam = (value) => {
      const w=window.open('about:blank');
      w.location.href='/#/exam?id='+value.examsId
      // this.props.history.push({
      //   pathname:'/exam',
      //   state:value
      // })
    }

    // render: (text,record) =>  <Link to={{ pathname: "/exam", search: JSON.stringify(record), query:record }} 
    // target="_blank">
    //   {text}
    // </Link>,
    createColumns = () =>{
      const columns = [
        {
          title: '试卷名称',
          dataIndex: 'examsName',
          key: 'examsName'
        },{
          title: '试卷描述',
          dataIndex: 'examsDescription',
          key: 'examsDescription'
        },{
          title: '试卷分数',
          dataIndex: 'examsScore',
          align: 'center',
          key: 'examsScore'
        },{
          title: '试卷创建人',
          dataIndex: 'examsCreatorNickname',
          key: 'examsCreatorNickname'
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          render: (text, record) => {
            var flag = this.handleDisabled(record)
            var flag1 = this.handleDisabled1(record)
            var flag2 = this.handleDisabled2(record)
            return (
              <ButtonGroup>
                {
                  this.props.userRoleId == 1
                  ?
                  <Button size="small" type="primary">
                    <Link to={{ pathname: "/exam", search: JSON.stringify(record), query:record }} 
                          target="_blank"
                    >
                      查看试卷详情
                    </Link>
                  </Button>
                  :
                  <Button size="small" type="primary" disabled = {!flag}>
                    <Link to={{ pathname: "/exam", search: JSON.stringify(record), query:record }} 
                          target="_blank"
                    >
                      {this.props.userRoleId == 2 ? "查看试卷详情" : "点击参与考试"} 
                    </Link>
                  </Button>
                }
                {
                  this.props.userRoleId == 2
                  ?
                  <Button size="small" type="primary" disabled = {flag1} onClick={this.showEditModal.bind(this, record)} style={{marginLeft:4}}>
                      修改试卷信息
                  </Button>
                  :
                  ""
                }
                {
                  this.props.userRoleId == 1
                  ?
                  <Button size="small" type="primary" disabled = {flag2} style={{marginLeft:4}} onClick={this.showModal.bind(this, record)}>发布考试</Button>
                  :
                  <></>
                }
                {
                  this.props.userRoleId == 1
                  ?
                  <Button size="small" type="danger" style={{marginLeft:4}} onClick={this.showDeleteQuestionModal.bind(this, record)}>删除</Button>
                  :
                  <></>
                }
              </ButtonGroup>
            )
          }
        }
      ];
      // if(this.props.userRoleId == 3){
      //   columns.splice(5,0,{
      //     title: '考试开始时间',
      //     dataIndex: 'examsStartDate',
      //     key: 'examsStartDate'
      //   },{
      //     title: '考试截止时间',
      //     dataIndex: 'examsEndDate',
      //     key: 'examsEndDate'
      //   })
      // }else if(this.props.userRoleId == 1){
      //   columns.splice(5,0,{
      //     title: '考试开始时间',
      //     dataIndex: 'examsStartDate',
      //     key: 'examsStartDate'
      //   },{
      //     title: '考试截止时间',
      //     dataIndex: 'examsEndDate',
      //     key: 'examsEndDate'
      //   })
      // }else{
      //   columns.splice(5,0,{
      //     title: '试卷创建时间',
      //     dataIndex: 'createTime',
      //     key: 'createTime'
      //   },{
      //     title: '试卷更新时间',
      //     dataIndex: 'updateTime',
      //     key: 'updateTime'
      //   })
      // }
      columns.splice(3,0,{
        title: '试卷创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },{
        title: '试卷更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
      })
      
          
      this.setState({
        columns
      })
    }

    handleDisabled = (record) => {
      //默认满足能参与考试的时间,当前时间应大于开始时间小于结束时间
      return this.props.userRoleId == 2 ? true : this.compare(record.examsStartDate, record.examsEndDate)
    }

    handleDisabled1 = (record) => {
      if(this.props.userRoleId == 1){
        return false
      }
      return record.isOpen == 0 ? false : true
    }

    handleDisabled2 = (record) => {
      return record.isOpen == 1 ? false : true
    }

    //与当前时间作比较，如果参数时间大于当前时间返回true
    compare = (examsStartDate, examsEndDate) => {
      var date = new Date();
      var date1 = new Date(examsStartDate);
      var date2 = new Date(examsEndDate);
      return date > date1 && date < date2
    }

    showDeleteQuestionModal = (record) => {
      // 使用函数的方式调用，定制化没那么强
      Modal.confirm({
        title: '此操作不可逆，请谨慎！！！',
        content: <Typography>确定要删除<span style={{color: '#f00'}}>{record.examsName}</span>吗？</Typography>,
        okText: '别磨叽！赶紧删除！',
        cancelText: '我点错了！',
        onOk:()=> {
          deleteExam(record.examsId)
            .then(resp => {
              message.success("删除成功");
              this.getData();
            })
        }
      })
    }

    componentDidMount(){
      this.getData()
    }

    onPageChange = (pageNum, pageSize) => {
      this.setState({
        pageNum,
        pageSize
      }, () => {
        this.getData()
      })
    }

    handleSearch = (values)=>{
      this.setState({
        examsName:values.examsName,
        examsCreatorNickname:values.examsCreatorNickname
      },()=>{
        this.getData()
      }) 
    }

    getData = ()=>{
      getExams(this.state.pageNum,this.state.pageSize,this.state.examsName,this.state.examsCreatorNickname).then(
        resp =>{
          this.createColumns()
          this.setState({
            total : resp.totalCount,
            data : resp.data
          })
        }
      )
    }

    showEditModal = (record) => {
      this.setState({
        ExamVisible: true,
        Exam : record
      });
    };

    hideExamModal = () => {
      this.setState({
        ExamVisible: false,
      },()=>{
        this.getData()
      });
    }

    hideModal = () => {
      this.setState({
        ModalVisible: false,
      });
    }

    
    showModal = (record) => {
      this.setState({
        ModalVisible: true,
        Exam : record
      });
    };

    render() {
        return (
            <div style={{padding: '24px 32px',backgroundColor:'#fff'}}>
              <WrappedAdvancedSearchForm handleSearch={this.handleSearch} dataSource={dataSource}/>
              <ExamModal visible={this.state.ExamVisible} hideModal={this.hideExamModal} exam={this.state.Exam}/>
              <IssueModal visible={this.state.ModalVisible} hideModal={this.hideModal} exam={this.state.Exam}/>
              <Table  columns={this.state.columns} dataSource={this.state.data} pagination={{
                  total: this.state.total,
                  hideOnSinglePage: true,
                  showQuickJumper: true,
                  onChange: this.onPageChange
                }}/>
            </div>
        )
    }
}

export default ExamTableList;