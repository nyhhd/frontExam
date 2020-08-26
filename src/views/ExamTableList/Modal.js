import React, { Component } from 'react'
import { Modal, Button, Steps, message, Form, Input, InputNumber, Select, DatePicker, Radio} from 'antd';
import moment from 'moment';
import {insertExam, updateExam, selectUsers} from '../../requests'
const { RangePicker, MonthPicker } = DatePicker;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

//发布考试页面
@Form.create()
class IssueModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            limitSelect:[],
            examineeDatas:[],
            exam:this.props.exam,
            selectExamineeIds:[],
            examStartDate:"",
            examEndDate:"",
            isOpen:"",
            upgradeTime:""
        };
    }

    componentWillReceiveProps(props){
        if(props.exam.examsName != undefined){
            this.setState({
                exam : props.exam
            },() => {
                // this.createSteps();
            })
        }
        
    }

    componentDidMount(){
        this.createData()
    }
     
    createData = ()=>{
        selectUsers("", 2).then(
            resp => {
                this.setState({
                    examineeDatas : resp.data
                },()=>{
                    this.createLimit()
                })
            }
        )
    }

    insertExam = ()=>{
        insertExam(this.state.exam).then(resp=>{
                message.success('发布考试成功')
                this.props.hideModal()           
            })
       
    }

    formatTen(num) {
        return num > 9 ? (num + "") : ("0" + num);
    }

    handleDate = (value) => {
        var date = new Date(value);  
        var Y = date.getFullYear() + '-';
        var M = this.formatTen(date.getMonth()+1) + '-';
        var D = this.formatTen(date.getDate())+ ' ';
        var h = this.formatTen(date.getHours())+ ':';
        var m = this.formatTen(date.getMinutes())+ ':';
        var  s = this.formatTen(date.getSeconds());
        return Y+M+D+h+m+s    
    }
    
    handleOk = e => {
        this.props.form.validateFields((err, values) => {
            const exam = this.state.exam
            exam.examScore = exam.examsScore
            const times = values.timeLimit;
            let examStartDate = "";
            let examEndDate = "";
            let examineeIds = "";

            if(times instanceof Array){
                examStartDate = this.handleDate(times[0]._d)
                examEndDate = this.handleDate(times[1]._d)
                
            }
            if(values.examineeIds instanceof Array ){
                examineeIds = ""
                values.examineeIds.map(
                    item => {
                        examineeIds += "-" + item
                    }
                )
                examineeIds = examineeIds.substring(1 , examineeIds.length)
            }
            exam.examName = values.examName
            exam.examTimeLimit = values.examTimeLimit
            exam.examStartDate = examStartDate
            exam.examEndDate = examEndDate
            exam.examineeIds = examineeIds

            this.setState({
                exam,
                selectExamineeIds:values.examineeIds,
                examStartDate,
                examEndDate
            },() => {
                this.insertExam()
            })
        })
    };

    handleCancel = e => {
        this.props.hideModal();
    };

    createLimit = () => {
        const {
            examineeIds,
            examsStartDate,
            examsEndDate
        } = this.state.exam

        let selectExamineeIds = []

        if(undefined != examineeIds && "" != examineeIds){
            selectExamineeIds = examineeIds.split('-');
        }

        this.setState({
            selectExamineeIds,
            examsStartDate,
            examsEndDate
        })
        const limitSelect = [
            {
                label:'考试时间段',
                title:'timeLimit',
            },{
                label:'参考考生',
                title:'examineeIds',
                data:this.state.examineeDatas,
                selectValues:this.state.selectExamineeIds
            }
        ]
        this.setState({
            limitSelect
        })
    }

    disabledDateTime = () => {
        let hours = moment().hours();//0~23
        let minutes = moment().minutes();//0~59
        //当日只能选择当前时间之后的时间点
        if (this.state.upgradeTime.date() === moment().date()) {
          return {
            disabledHours: () => this.range(0, hours),
            disabledMinutes: () => this.range(0, minutes),
          };
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const ids = []
        return (
            <>
             <Modal
                    width={640}
                    title="发布考试信息"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    afterClose={()=>{
                        this.setState({
                            current: 0
                        })
                    }}
                >
                {
                    this.state.limitSelect[0] == undefined
                    ?
                    <></>
                    :
                    (
                        <>
                        <Form {...layout} name="nest-messages"   >  
                            <Form.Item  style={{ textAlign: 'left'}} label="考试名称">
                                {getFieldDecorator('examName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入考试名称',
                                        },
                                    ],
                                    initialValue: this.state.examName
                                })(<Input/>)}
                            </Form.Item>
                            <Form.Item  style={{ textAlign: 'left'}} label="考试限时">
                                {getFieldDecorator('examTimeLimit', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入考试限时',
                                        }
                                    ],
                                    initialValue: this.state.examsTimeLimit
                                })(<InputNumber max={120} />)}
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'left'}} key={this.state.limitSelect[0].title} style={{ textAlign: 'left'}} label={this.state.limitSelect[0].label}>
                                {getFieldDecorator(this.state.limitSelect[0].title, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入考试时间段',
                                        }
                                    ],
                                })(<RangePicker format={'YYYY-MM-DD HH:mm:ss'} 
                                renderExtraFooter={() => 'extra footer'} showTime />)}
                            </Form.Item>
                            <Form.Item  style={{ textAlign: 'left'}} key={this.state.limitSelect[1].title} style={{ textAlign: 'left'}} label={this.state.limitSelect[1].label}>
                                    {getFieldDecorator(this.state.limitSelect[1].title, { 
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入参考人员',
                                            }
                                        ],initialValue:ids
                                    })(<Select
                                        key={this.state.limitSelect[1].title}
                                        mode="multiple"
                                        style={{ width: '100%'}}
                                        placeholder=""
                                        defaultValue={ids}
                                    >
                                        {
                                            this.state.limitSelect[1].data != undefined
                                            ?
                                            this.state.limitSelect[1].data.map(value =>{
                                                return(
                                                    <Option key={value.userId} label={value.userId} value={value.userId+""}>{value.userUsername}</Option>
                                                )
                                            })
                                            :
                                            ("")
                                        }
                                    </Select>)}
                            </Form.Item>
                            {/* <Form.Item  style={{ textAlign: 'left'}} label="考试描述">
                                {getFieldDecorator('examsDescription', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入考试描述',
                                        },
                                    ],
                                    initialValue: this.state.examsDescription
                                })(<TextArea rows={4} />)}
                            </Form.Item> */}
                        </Form>
                        </>
                    )
                }
                
            </Modal>   
            
        </>
        )
    }
}

export default IssueModal