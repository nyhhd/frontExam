import React, { Component } from 'react'
import { Table, Divider, Tag } from 'antd';
import { Card } from 'antd';
import { Input } from 'antd';

import {connect } from 'react-redux'
import {selectExamRecords} from '../../requests';
import {Link} from 'react-router-dom'

const { Search } = Input;

// render: text => <a>{text}</a>,


const mapState = state => ({
  userId : state.user.userId
})

@connect(mapState)
class ExamRecordList  extends Component {
    constructor(){
      super()
      this.state = {
        data:[],
        examName:"",
        columns:[]
      }
    }

    createColumns = () =>{
      const columns = [
        {
          title: '考试名称',
          dataIndex: 'examsName',
          key: 'examsName',
          render : (text,record) =>  <Link to={{ pathname: "/examRecord", search: JSON.stringify(record.examRecordId), query:record.examRecordId }} 
          target="_blank">
            {text}
          </Link>,
        },{
          title: '考试人员',
          dataIndex: 'examJoinerName',
          key: 'examJoinerName',
        },{
          title: '成绩',
          dataIndex: 'examJoinScore',
          key: 'examJoinScore',
        },{
          title: '总成绩',
          dataIndex: 'examSorce',
          key: 'examSorce',
        },{
          title: '结果等级',
          dataIndex: 'examResultLevelDesc',
          key: 'examResultLevelDesc',
        },{
          title: '耗费时间',
          dataIndex: 'examTimeCost',
          key: 'examTimeCost',
        },{
          title: '参加时间',
          dataIndex: 'examJoinDate',
          key: 'examJoinDate',
        }
      ];
      this.setState({
        columns
      })
    }

    componentDidMount(){
      this.getData();
      this.createColumns();
    }

    getData = () => {
      selectExamRecords(this.props.userId,this.state.examName).then(
        resp =>{
          this.setState({
            data:resp.data
          })
        }
      )
    }

    render() {
        return (
            <div style={{ padding: '30px 40px 10px 40px' }}>
                <Card title="考试记录" 
                  extra={<Search placeholder="输入考试名称" onSearch={value => {
                    this.setState({
                      examName:value
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

export default ExamRecordList