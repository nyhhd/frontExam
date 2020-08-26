import React, { Component } from 'react'
import { Modal, Button, Steps, message, Form, Input, InputNumber, Select, DatePicker, Radio,  Row, Col} from 'antd';

import './index.less'
import {selectQuestionsByTypeId, insertExams, selectUsers} from '../../requests'

const { RangePicker, MonthPicker } = DatePicker;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
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

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const sorceInput = [
    {
        label:'单选题',
        title:'examsScoreRadio'
    },{
        label:'多选题',
        title:'examsScoreCheck'
    },{
        label:'判断题',
        title:'examsScoreJudge'
    }
]

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

//   ,{
//     key:"4",
//     value:"后台"
//   },{
//     key:"5",
//     value:"笔试题"
//   }
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

@Form.create()
class ExamModal extends React.Component {
    constructor(){
        super()
        this.state = {
            current: 0,
            steps:[],
            questionSelect:[],
            RadioQuestions:[],
            CheckQuestions:[],
            JudgeQuestions:[],
            examsName:'',
            examsTimeLimit:90,
            examsDescription:'',
            examsScoreRadio:5,
            examsScoreCheck:5,
            examsScoreJudge:5,
            examQuestionIdsRadio:'',
            examQuestionIdsCheck:'',
            examQuestionIdsJudge:'',
            limitSelect:[],
            examineeDatas:[],
            examsStartDate:"",
            examsEndDate:"",
            examineeIds:"",
            isOpen:"",
            AllRadioQuestions:[],
            AllCheckQuestions:[],
            AllJudgeQuestions:[],
            categoryValue:"",
            levelValue:"",
            radioIds:[],
            checkIds:[],
            judgeIds:[]
        };
    }

    //获取题目data后,在最后一次进行回调函数,因为state是异步的
    createData = ()=>{
        let promise1 = selectQuestionsByTypeId(1);
        let promise2
        let promise3
        setTimeout(
            () => {
                 promise2 = selectQuestionsByTypeId(2);
            },
            1000
        ) 
        setTimeout(
            () => {
                promise3 = selectQuestionsByTypeId(3);
            },
            2000
        ) 
        setTimeout(
            () => {
                Promise.all([promise1,promise2,promise3]).then(value => {
                    this.setState({
                        RadioQuestions:value[0].data,
                        CheckQuestions:value[1].data,
                        JudgeQuestions:value[2].data,
                        AllRadioQuestions:value[0].data,
                        AllCheckQuestions:value[1].data,
                        AllJudgeQuestions:value[2].data
                    },() => {
                        this.createQuestion()  
                    })
                })
            },
            2000
        ) 
        // selectUsers("", 2).then(
        //     resp => {
        //         this.setState({
        //             examineeDatas : resp.data
        //         },()=>{
        //             this.createLimit()
        //         })
        //     }
        // )
    }

    //初始化题目选择数据
    createQuestion = ()=>{
        const questionSelect = [
            {
                label:'请选择单选题',
                title:'examQuestionIdsRadio',
                data:this.state.RadioQuestions,
                ininData:this.state.radioIds
            },{
                label:'请选择多选题',
                title:'examQuestionIdsCheck',
                data:this.state.CheckQuestions,
                ininData:this.state.checkIds
            },{
                label:'请选择判断题',
                title:'examQuestionIdsJudge',
                data:this.state.JudgeQuestions,
                ininData:this.state.judgeIds
            }
        ]

        this.setState({
            questionSelect 
        })
    }

    //初始化每个步骤条的页面内容
    createSteps = ()=>{
        const { getFieldDecorator } = this.props.form;
        this.createData();
        const steps = [
            {
              title: '试卷描述',
              content: ()=>{
                  return (
                    <>
                        <Form.Item  style={{ textAlign: 'left'}} label="试卷名称">
                            {getFieldDecorator('examsName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入试卷名称',
                                    },
                                ],
                                initialValue: this.state.examsName
                            })(<Input/>)}
                        </Form.Item>
                       <Form.Item  style={{ textAlign: 'left'}} label="试卷描述">
                            {getFieldDecorator('examsDescription', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入试卷描述',
                                    },
                                ],
                                initialValue: this.state.examsDescription
                            })(<TextArea rows={4} />)}
                        </Form.Item>
                    </>
                  )
              }
            },
            {
              title: '每题分数',
              content: ()=>{
                return (
                  <>
                    {
                        sorceInput.map(item => {
                            return (
                                <Form.Item  key={item.title} style={{ textAlign: 'left'}} label={item.label}>
                                    {getFieldDecorator(item.title, {
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                        initialValue: this.state[item.title]
                                    })(<InputNumber min={1} max={20}/>)}
                                </Form.Item>
                            )
                        })
                    }
                  </>
                )
              }
            },
            {
              title: '选择题目',
              content: ()=>{
                return (
                  <>
                    <Row style={{marginLeft:'20px',marginBottom:'20px'}}>
                        <Col span={4}>
                          <span>筛选题目：</span>
                        </Col>
                        <Col span={8}>
                            <Select initialValue="" placeholder="选择科目" onChange={this.handleCategoryChange}>
                            {
                                questionCategoryIdData.map(res =>{
                                return ( <Option key={res.key} value={res.key}>{res.value}</Option>)
                                })
                            }
                            </Select>
                        </Col>
                        <Col style={{marginLeft:'20px'}}span={8}>
                            <Select initialValue="" placeholder="选择难度" onChange={this.handleLevelChange}>
                            {
                                questionLevelIdData.map(res =>{
                                return ( <Option key={res.key} value={res.key}>{res.value}</Option>)
                                })
                            }
                            </Select>
                        </Col>
                    </Row>
                    {
                        this.state.questionSelect.map(item => {
                            return (
                                <Form.Item  key={item.title} style={{ textAlign: 'left'}} label={item.label}>
                                    {getFieldDecorator(item.title, {
                                        rules: [
                                            {
                                                required: true,
                                                message: item.label,
                                            },
                                        ],
                                        initialValue:item.ininData
                                    })(
                                        <Select
                                            key={item.title}
                                            mode="multiple"
                                            style={{ width: '100%' ,marginLeft : 4}}
                                            placeholder="Please select"
                                        >
                                            {
                                                item.data.map(value =>{
                                                    return(
                                                        <Option key={value.questionId} value={value.questionId}>{value.questionName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            )
                        })
                    }
                     <Form.Item  key="isOpen" style={{ textAlign: 'left'}} label="是否完成">
                                    {getFieldDecorator('isOpen', {
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                        initialValue:0
                                    })(<Radio.Group name="radiogroup">
                                    <Radio value={1}>完成</Radio>
                                    <Radio value={0}>未完成</Radio>
                              </Radio.Group>)}
                                </Form.Item>
                  </>
                )
              }
            }
        ];
        this.setState({
            steps  
        })
    }

    //科目
    handleCategoryChange = (value) => {
        this.handleArray(value,this.state.levelValue) 
        this.setState({
            categoryValue:value
        })
    }

    
    //难度
    handleLevelChange = (value) => {
        this.handleArray(this.state.categoryValue,value) 
        this.setState({
            levelValue:value
        })
    }

    //动态筛选数组
    handleArray = (categoryId,levelId) => {
        let {
            AllRadioQuestions,
            AllCheckQuestions,
            AllJudgeQuestions
        } = this.state
        
        if(categoryId != ""){
            AllRadioQuestions = AllRadioQuestions.filter(item =>{
                if(item.questionCategoryId == categoryId){
                    return item
                }
            })
            AllCheckQuestions = AllCheckQuestions.filter(item =>{
                if(item.questionCategoryId == categoryId){
                    return item
                }
            })
            AllJudgeQuestions = AllJudgeQuestions.filter(item =>{
                if(item.questionCategoryId == categoryId){
                    return item
                }
            })
        }
        if(levelId != ""){
            AllRadioQuestions = AllRadioQuestions.filter(item =>{
                if(item.questionLevelId == levelId){
                    return item
                }
            })
            AllCheckQuestions = AllCheckQuestions.filter(item =>{
                if(item.questionLevelId == levelId){
                    return item
                }
            })
            AllJudgeQuestions = AllJudgeQuestions.filter(item =>{
                if(item.questionLevelId == levelId){
                    return item
                }
            })
        }
        this.setState({
            RadioQuestions:AllRadioQuestions,
            CheckQuestions:AllCheckQuestions,
            JudgeQuestions:AllJudgeQuestions
        },() => {
            this.createQuestion()  
        })
    }

    componentDidMount(){
        setTimeout(
            () => {
                this.createSteps();
            },
            2000
        ) 
    }

    handleOk = e => {
        this.props.hideModal();
    };

    handleCancel = e => {
        this.props.hideModal();
    };

    prev = () => {
        this.props.form.validateFields((err, values) => {
            if(this.state.current == 1){
                this.setState({
                    examsScoreRadio:values.examsScoreRadio,
                    examsScoreCheck:values.examsScoreCheck,
                    examsScoreJudge:values.examsScoreJudge
                })
            }else if(this.state.current == 2){
                this.setState({
                    radioIds:values.examQuestionIdsRadio,
                    checkIds:values.examQuestionIdsCheck,
                    judgeIds:values.examQuestionIdsJudge
                },()=>{
                    this.createQuestion()
                })
            }
        })

        const current = this.state.current - 1;
        this.setState({ current });
    }

    next = () => {
        // this.setCurrent();
        this.props.form.validateFields((err, values) => {
            // if (!err) {
                if(this.state.current == 0){
                    this.setState({
                        examsName:values.examsName,
                        examsDescription:values.examsDescription,
                        examsTimeLimit:values.examsTimeLimit
                    },()=>{
                        this.setCurrent();
                    })
                }else if(this.state.current == 1){
                    this.setState({
                        examsScoreRadio:values.examsScoreRadio,
                        examsScoreCheck:values.examsScoreCheck,
                        examsScoreJudge:values.examsScoreJudge
                    },()=>{
                        this.setCurrent();
                    })
                }else if(this.state.current == 2){
                    var examQuestionIds = "";
                    for(var i = 0;i < values.examQuestionIdsRadio.length;i++){
                        examQuestionIds += values.examQuestionIdsRadio[i] + "-";
                    }
                    const Radios = examQuestionIds.substring(0,examQuestionIds.length-1);
                    this.setState({
                        examQuestionIdsRadio:Radios
                    })

                    examQuestionIds = "";
                    for(var i = 0;i < values.examQuestionIdsCheck.length;i++){
                        examQuestionIds += values.examQuestionIdsCheck[i] + "-";
                    }
                    const Checks = examQuestionIds.substring(0,examQuestionIds.length-1)
                    this.setState({
                        examQuestionIdsCheck:Checks
                    })

                    examQuestionIds = "";
                    for(var i = 0;i < values.examQuestionIdsJudge.length;i++){
                        examQuestionIds += values.examQuestionIdsJudge[i] + "-";
                    }
                    const Judges = examQuestionIds.substring(0,examQuestionIds.length-1)
                    this.setState({
                        examQuestionIdsJudge:Judges,
                        isOpen:values.isOpen
                    },()=>{
                        this.insertExam()
                    })
                    // this.setCurrent()
                }else if(this.state.current == 3){
                    const times = values.timeLimit;
                    let examsStartDate = "";
                    let examsEndDate = "";
                    let examineeIds = "";

                    if(times instanceof Array){
                        examsStartDate = this.handleDate(times[0]._d)
                        examsEndDate = this.handleDate(times[1]._d)
                        
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
                    this.setState({
                        examsStartDate,
                        examsEndDate,
                        examineeIds
                    },() => {
                        this.insertExam()
                    })
                }    
            // }
        });
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

    initState = () => {
        this.setState({
            current: 0,
            examsName:'',
            examsTimeLimit:90,
            examsDescription:'',
            examsScoreRadio:5,
            examsScoreCheck:5,
            examsScoreJudge:5,
            examQuestionIdsRadio:'',
            examQuestionIdsCheck:'',
            examQuestionIdsJudge:'', 
            radioIds:[],
            checkIds:[],
            judgeIds:[]
        });
    }

    setCurrent = () =>{
        const current = this.state.current + 1;
        this.setState({ current });
    }

    insertExam = ()=>{
        const {examsName,
            examsTimeLimit,
            examsDescription,
            examsScoreRadio,
            examsScoreCheck,
            examsScoreJudge,
            examQuestionIdsRadio,
            examQuestionIdsCheck,
            examQuestionIdsJudge,
            examineeIds,
            examsStartDate,
            examsEndDate,
            isOpen
        } =  this.state
        insertExams(examsName,
            examsTimeLimit,
            examsDescription,
            examsScoreRadio,
            examsScoreCheck,
            examsScoreJudge,
            examQuestionIdsRadio,
            examQuestionIdsCheck,
            examQuestionIdsJudge,
            examineeIds,
            examsStartDate,
            examsEndDate,
            isOpen).then(resp=>{
                message.success('创建试卷成功')
                this.props.hideModal()
                 //设置state到初始化
                this.initState();
            })
       
    }

   

    createButton = () => {
        const current = this.state.current;
        return (
            <>
                {current > 0 && (
                    <Button  onClick={() => this.prev()}>
                    上一步
                    </Button>
                )}
                {current < this.state.steps.length - 1 && (
                    <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.next()}>
                        下一步
                    </Button>
                )}
                {current === this.state.steps.length - 1 && (
                    <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.next()}>
                    完成
                    </Button>
                )}   
            </>
        )
    }

    render() {
        const { current } = this.state;
        return (
            <div>
                <Modal
                    width={640}
                    footer={this.createButton()}
                    title="新建试卷"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >   
                     <Steps size="small" current={current}>
                        {this.state.steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content">
                        <Form {...layout} name="nest-messages"   validatemessages={validateMessages}>   
                            {this.state.steps[current] ? this.state.steps[current].content():""}
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ExamModal