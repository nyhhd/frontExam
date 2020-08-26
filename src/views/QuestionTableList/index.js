import React, { Component } from 'react'
import { Table, Button, Modal, Typography, message} from 'antd';
import {WrappedAdvancedSearchForm, EditMod} from '../../components'
import {getQuestions, deleteQuestion} from '../../requests'
import {connect } from 'react-redux'


const ButtonGroup = Button.Group;

const questionLevelIdData = [{
  key:0,
  value:""
},{
  key:"1",
  value:"难"
},{
  key:"2",
  value:"中"
},{
  key:"3",
  value:"易"
}]

const questionTypeIdData = [{
  key:0,
  value:""
},{
  key:"1",
  value:"单选题"
},{
  key:"2",
  value:"多选题"
},{
  key:"3",
  value:"判断题"
}]

const questionCategoryIdData = [{
  key:0,
  value:""
},{
  key:"1",
  value:"java"
},{
  key:"3",
  value:"前端"
},{
  key:"4",
  value:"数据库"
},{
  key:"5",
  value:"c语言"
}]

const dataSource = [{
  id:1,
  flag:true,
  labelName:"题目名称",
  fieldName:"questionName",
  desc:"请输入考试名称"
},{
  id:2,
  flag:false,
  labelName:"题目难易",
  fieldName:"questionLevelId",
  desc:"请输入题目难易",
  data:questionLevelIdData
},{
  id:3,
  flag:false,
  labelName:"题目类型",
  fieldName:"questionTypeId",
  desc:"请输入题目类型",
  data:questionTypeIdData
},{
  id:4,
  flag:false,
  labelName:"题目科目",
  fieldName:"questionCategoryId",
  desc:"请输入题目科目",
  data:questionCategoryIdData
}];

const mapState = state => ({
  userRoleId : state.user.userRoleId,
  userId : state.user.userId
})

@connect(mapState)
class QuestionTableList extends Component {
    constructor(){
      super()
      this.state = {
        dataSource: [],
        columns: [],
        total: 0,
        pageSize: 10,
        pageNum : 1,
        visible: false,
        record:{},
        defVal:"",
        questionName:"",
        questionLevelId:"",
        questionTypeId:"",
        questionCategoryId:"",
        type:""
      }
    }

    showModal = (item,type) => {
      if(item.questionName != null){
        let defVal = item.questionAnswerOptionIds.split('-');
        let arr = [defVal.length];
        if(item.questionTypeId == 2){
          for(var i = 0;i < defVal.length;i++){
            item.questionOptionList.map(ques => {
              if(ques.questionOptionId == defVal[i]){
                arr[i] = ques.questionOptionContent
                return
              }
            })
          }
          this.setState({
            defVal:arr
          })
        }else{
          item.questionOptionList.map(ques => {
            //将默认的答案以及
            if(item.questionAnswerOptionIds == ques.questionOptionId){
              this.setState({
                defVal:ques.questionOptionContent
              })
            }
          })
        }
      }
      if(type != null && type != ""){
        this.setState({
          type
        })
      }
      this.setState({
        visible: true,
        record: item,
      });
    };
  
    hideModal = () => {
      this.setState({
        visible: false,
      });
      this.getData();
    };

    onPageChange = (pageNum, pageSize) => {
      this.setState({
        pageNum,
        pageSize
      }, () => {
        this.getData()
      })
    }

    handleSearch = (values) =>{
      this.setState({
        questionName:values.questionName,
        questionLevelId:values.questionLevelId,
        questionTypeId:values.questionTypeId,
        questionCategoryId:values.questionCategoryId,
        pageNum:1,
        pageSize:10
      },()=>{
        this.getData()
      })
    }

    getData(){
      getQuestions(this.state.pageNum,this.state.pageSize,this.state.questionName,this.state.questionLevelId,this.state.questionTypeId,this.state.questionCategoryId)
      .then(resp => {
         this.setState({
           total : resp.totalCount,
           dataSource : resp.data
         },()=>{
          this.createColumns();
         })
      })
    }

    transformTime = (time) => {
      var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
      return date.toJSON().substr(0, 19).replace('T', ' ');
    }

    createColumns = () =>{
      const columns = [{
          title: '题目',
          dataIndex: 'questionName',
          width:500,
          render: (text,record) => <a onClick={this.showModal.bind(this, record ,"详情")}>{text}</a>,
        },{
          title: '难度',
          align: 'center',
          dataIndex: 'questionLevelDesc',
        },{
          title: '学科',
          align: 'center',
          dataIndex: 'questionCategoryDesc',
        },{
          title: '题型',
          align: 'center',
          dataIndex: 'questionTypeDesc',
        },{
          title: '题目创建人',
          align: 'center',
          dataIndex: 'questionCreatorNickname',
        },{
          title: '题目创建时间',
          align: 'center',
          dataIndex: 'createTime',
          render:(text, record)=>{
            return this.transformTime(text);
          }
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          render: (text, record) => {
            var editFlag = true
            if(record.questionCreatorId   == this.props.userId){
              editFlag = false
            }
            if(this.props.userRoleId == 1){
              editFlag = false
            }

            var deleteFlag = true
            if(this.props.userRoleId == 1){
              deleteFlag = false
            }
            return (
              <ButtonGroup>
                <Button size="small" type="primary" onClick={this.showModal.bind(this, record)} disabled={editFlag}>编辑</Button>
                <Button size="small" type="danger" onClick={this.showDeleteQuestionModal.bind(this, record)} disabled={deleteFlag}>删除</Button>
              </ButtonGroup>
            )
          }
        }];
        this.setState({
          columns
        })
    }

    showDeleteQuestionModal = (record) => {
      // 使用函数的方式调用，定制化没那么强
      Modal.confirm({
        title: '此操作不可逆，请谨慎！！！',
        content: <Typography>确定要删除<span style={{color: '#f00'}}>{record.questionName}</span>吗？</Typography>,
        okText: '别磨叽！赶紧删除！',
        cancelText: '我点错了！',
        onOk:()=> {
          deleteQuestion(record.questionId)
            .then(resp => {
              message.success("删除成功");
              this.getData();
            })
        }
      })
    }

    
    componentDidMount(){
      this.getData();
    }

    render() {
        return (
            <div style={{padding: '24px 32px',backgroundColor:'#fff'}}>
              <WrappedAdvancedSearchForm handleSearch={this.handleSearch} dataSource={dataSource} />
              <EditMod visible= {this.state.visible}  record={this.state.record} defVal={this.state.defVal} hideModal={this.hideModal} type={this.state.type}></EditMod>
              <Table  columns={this.state.columns} dataSource={this.state.dataSource}
                pagination={{
                  total: this.state.total,
                  hideOnSinglePage: true,
                  showQuickJumper: true,
                  onChange: this.onPageChange
                }}
               />
            </div>
        )
    }
}

export default QuestionTableList