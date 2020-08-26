import React, { Component } from 'react'
import { Table, Button, Modal, Typography, message} from 'antd';
import {Link} from 'react-router-dom'

import {WrappedAdvancedSearchForm, EditMod} from '../../components'
import {getExamByLike, deleteQuestion} from '../../requests'

const ButtonGroup = Button.Group;

const dataSource = [{
  id:1,
  flag:true,
  labelName:"考试名称",
  fieldName:"ExamName",
  desc:"请输入考试名称"
}];

//学生考试查看页面
export default class Exams extends Component {
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
        type:"",
        status:""
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
        ExamName:values.ExamName
      },()=>{
        this.getData()
      })
    }

    getData(){
     getExamByLike(this.state.pageNum,this.state.pageSize,this.state.ExamName)
      .then(resp => {
         this.createColumns();
         this.setState({
           total : resp.totalCount,
           dataSource : resp.data
         })
      })
    }

    transformTime = (time) => {
      var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
      return date.toJSON().substr(0, 19).replace('T', ' ');
    }

    createColumns = () =>{
      const columns = [{
          title: '考试名称',
          dataIndex: 'examName',
          width:200,
        },{
          title: '考试限时',
          align: 'center',
          dataIndex: 'examTimeLimit',
        },{
          title: '考试开始时间',
          align: 'center',
          dataIndex: 'examStartDate',
        },{
          title: '考试截至时间',
          align: 'center',
          dataIndex: 'examEndDate',
        },{
            title: '应参考人数',
            align: 'center',
            dataIndex: 'number',
            render : (text, record) => {
                return record.examineeIds.split("-").length
            }
        },{
          title: '实际参考人数',
          align: 'center',
          dataIndex: 'referenceNumber',
          render : (text, record) => {
            if(text == undefined || text == null){
                return 0
            }else {
                return text
            }
        }
        },{
            title: '考试状态',
            align: 'center',
            dataIndex: 'status',
            render : (text, record) => {
                //与当前时间作比较，如果参数时间大于当前时间返回true
                if(text != undefined && text != ""){
                    return text
                }else{
                    var status = this.compare(record.examStartDate,record.examEndDate)
                    if(status == 1){ //代表未开始
                        return "未开始"
                    }else if(status == 2){
                        return "考试进行中"
                    }else if(status == 3){
                        return "已结束"
                    } 
                }
            }
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          render: (text, record) => {
            var status = this.compare(record.examStartDate,record.examEndDate)
            return (
              <ButtonGroup>
                <Button size="small" type="primary" disabled={status == 2 ? false : true}>
                    <Link to={{ pathname: "/exam", search: JSON.stringify(record), query:record }} 
                          target="_blank"
                    >
                      点击参与考试
                    </Link>
                </Button>
              </ButtonGroup>
            )
          }
        }];
        this.setState({
          columns
        })
    }
    
    compare = (examsStartDate, examsEndDate) => {
        var date = new Date();
        var date1 = new Date(examsStartDate);
        var date2 = new Date(examsEndDate);
        if(date > date1 && date < date2){
            return 2
        }else if(date < date1){
            return 1
        }else{
            return 3
        }
    }

    showExamModal = ()=>{

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
