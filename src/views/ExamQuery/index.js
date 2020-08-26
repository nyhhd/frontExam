import React, { Component } from 'react'
import { Table, Button, Modal, Typography, message} from 'antd';
import {WrappedAdvancedSearchForm, EditMod} from '../../components'
import {getExamByLike, deleteQuestion} from '../../requests'

import EditModal from './Modal'
import EchartModal from './EchartModal'
const ButtonGroup = Button.Group;

const dataSource = [{
  id:1,
  flag:true,
  labelName:"考试名称",
  fieldName:"ExamName",
  desc:"请输入考试名称"
}];

//管理员查看考试结果页面
export default class ExamQuery extends Component {
    constructor(){
      super()
      this.state = {
        dataSource: [],
        columns: [],
        total: 0,
        pageSize: 10,
        pageNum : 1,
        visible: false,
        echartVisible: false,
        record:{},
        defVal:"",
        questionName:"",
        questionLevelId:"",
        questionTypeId:"",
        questionCategoryId:"",
        type:"",
        exam:{}
      }
    }

    showModal = (record) => {
      this.setState({
        visible: true,
        exam: record,
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
          title: '考试分数',
          align: 'center',
          dataIndex: 'examScore',
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
            return text == undefined ? 0 : text
          }
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          render: (text, record) => {
                var status = this.compare(record.examStartDate,record.examEndDate)
            return (
              <ButtonGroup>
                <Button size="small" type="primary" onClick={this.showModal.bind(this, record)} disabled={status}>修改考试信息</Button>
                <Button size="small" type="primary" onClick={this.showEchartModal.bind(this, record)}>查看统计分析图</Button>
              </ButtonGroup>
            )
          }
        }];
        this.setState({
          columns
        })
    }
    
    //与当前时间作比较，如果参数时间大于当前时间返回true
    compare = (examsStartDate, examsEndDate) => {
      var date = new Date();
      var date1 = new Date(examsStartDate);
      var date2 = new Date(examsEndDate);
      return (date > date1 && date < date2) ||  (date2 < date)
    }

    showEchartModal = (record)=>{
      this.setState({
        echartVisible: true,
        exam:record
      });
    }
  
    hideEchartModal = () => {
      this.setState({
        echartVisible: false,
      });
    };
    
    componentDidMount(){
      this.getData();
    }

    render() {
        return (
            <div style={{padding: '24px 32px',backgroundColor:'#fff'}}>
              <WrappedAdvancedSearchForm handleSearch={this.handleSearch} dataSource={dataSource} />
              <EditModal visible= {this.state.visible}   hideModal={this.hideModal} exam={this.state.exam}></EditModal>
              <EchartModal visible= {this.state.echartVisible}   hideModal={this.hideEchartModal} exam={this.state.exam}/>
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
