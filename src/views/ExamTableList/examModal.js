import React, { Component } from 'react'
import { Modal, Button, Steps, message, Form, Input, InputNumber, Select, DatePicker, Radio, Row, Col} from 'antd';

import moment from 'moment';

import './index.less'
import {selectQuestionsByTypeId, updateExam, selectUsers} from '../../requests'

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



@Form.create()
class ExamModal extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            current: 0,
            steps:[],
            questionSelect:[],
            RadioQuestions:[],
            CheckQuestions:[],
            JudgeQuestions:[],
            limitSelect:[],
            examineeDatas:[],
            exam:this.props.exam,
            radios:[],
            checks:[],
            judges:[],
            selectExamineeIds:[],
            examsStartDate:"",
            examsEndDate:"",
            isOpen:"",
            AllRadioQuestions:[],
            AllCheckQuestions:[],
            AllJudgeQuestions:[],
            categoryValue:"",
            levelValue:"",
        };
    }

    componentWillReceiveProps(props){
        if(props.exam.examsName != undefined){
            this.setState({
                exam : props.exam
            },() => {
                this.createSteps();
            })
        }
        
    }

    componentDidMount(){
       this.createData()
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
                        // this.createQuestion()  
                    })
                })
            },
            2000
        ) 
    }

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
                label:'时间限制',
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

    //初始化题目选择数据
    createQuestion = ()=>{
        const {
            examQuestionIdsCheck,
            examQuestionIdsJudge,
            examQuestionIdsRadio
        } = this.state.exam

        let radios = []
        let checks = []
        let judges = []
        if(undefined != examQuestionIdsRadio && "" != examQuestionIdsRadio){
            radios = examQuestionIdsRadio.split('-');
        }
        if(undefined != examQuestionIdsCheck && "" != examQuestionIdsCheck){
            checks = examQuestionIdsCheck.split('-');
        }
        if(undefined != examQuestionIdsJudge && "" != examQuestionIdsJudge){
            judges = examQuestionIdsJudge.split('-');
        }

        this.setState({
            radios,
            checks,
            judges
        },()=>{
            this.createSelect()
        })
    }

    createSelect = ()=>{
        const questionSelect = [
            {
                label:'请选择单选题',
                title:'examQuestionIdsRadio',
                data:this.state.RadioQuestions,
                selectValues:this.state.radios
            },{
                label:'请选择多选题',
                title:'examQuestionIdsCheck',
                data:this.state.CheckQuestions,
                selectValues:this.state.checks
            },{
                label:'请选择判断题',
                title:'examQuestionIdsJudge',
                data:this.state.JudgeQuestions,
                selectValues:this.state.judges
            }
        ]

        this.setState({
            questionSelect 
        })
    }
    //初始化每个步骤条的页面内容
    createSteps = ()=>{
        this.createQuestion()  
        this.createLimit()
        const { getFieldDecorator } = this.props.form;
        const steps = [
            {
              title: '试卷描述',
              content: ()=>{
                  return (
                    <>
                        <Form.Item  style={{ textAlign: 'left'}} label="名称">
                            {getFieldDecorator('examsName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入试卷名称',
                                    },
                                ],
                                initialValue: this.state.exam.examsName
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
                                initialValue: this.state.exam.examsDescription
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
                                        initialValue: this.state.exam[item.title]
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
                const v = this.state.exam.isOpen
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
                            const selectValues = item.selectValues
                            return (
                                //optionLabelProp="label"
                                <Form.Item  key={item.title} style={{ textAlign: 'left'}} label={item.label}>
                                    {getFieldDecorator(item.title, {
                                        rules: [
                                            {
                                                required: true,
                                                message: item.label,
                                            },
                                        ],
                                        initialValue:selectValues
                                    })(
                                        <Select
                                            key={item.title}
                                            mode="multiple"
                                            style={{ width: '100%' ,marginLeft : 4}}
                                            placeholder="Please select"
                                            defaultValue={selectValues}
                                        >
                                            {
                                                item.data.map(value =>{
                                                    return(
                                                        <Option key={value.questionId} value={value.questionId+""}>{value.questionName}</Option>
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
                                        initialValue:'0'
                                    })(<Radio.Group name="radiogroup" value="0">
                                    <Radio value="1">完成</Radio>
                                    <Radio value="0">未完成</Radio>
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
            this.createSelect()  
        })
    }

    handleOk = e => {
        this.props.hideModal();
    };

    handleCancel = e => {
        this.props.hideModal();
    };

    prev = () => {
        this.props.form.validateFields((err, values) => {
            const exam = this.state.exam
            if(this.state.current == 0){
                exam.examsName = values.examsName
                exam.examsDescription = values.examsDescription
                exam.examsTimeLimit = values.examsTimeLimit
                this.setState({
                    exam
                })
            }else if(this.state.current == 1){
                exam.examsScoreRadio = values.examsScoreRadio
                exam.examsScoreCheck = values.examsScoreCheck
                exam.examsScoreJudge = values.examsScoreJudge
                this.setState({
                    exam
                })
            }else if(this.state.current == 2){
                exam.examQuestionIdsRadio = values.examQuestionIdsRadio.join('-')
                exam.examQuestionIdsCheck = values.examQuestionIdsCheck.join('-')
                exam.examQuestionIdsJudge = values.examQuestionIdsJudge.join('-')
                this.setState({
                    exam
                },()=>{
                    // this.createSelect()
                })
            }
            const current = this.state.current - 1;
            this.setState({ current });
        });
        
    }

    next = () => {
        // this.setCurrent();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const exam = this.state.exam
                if(this.state.current == 0){
                    exam.examsName = values.examsName
                    exam.examsDescription = values.examsDescription
                    exam.examsTimeLimit = values.examsTimeLimit
                    this.setState({
                        exam
                    },()=>{
                        this.setCurrent();
                    })
                }else if(this.state.current == 1){
                    exam.examsScoreRadio = values.examsScoreRadio
                    exam.examsScoreCheck = values.examsScoreCheck
                    exam.examsScoreJudge = values.examsScoreJudge
                    this.setState({
                        exam,
                        RadioQuestions:this.state.AllRadioQuestions,
                        CheckQuestions:this.state.AllCheckQuestions,
                        JudgeQuestions:this.state.AllJudgeQuestions
                    },()=>{
                        this.setCurrent();
                    })
                }else if(this.state.current == 2){
                    
                    var examQuestionIds = "";
                    for(var i = 0;i < values.examQuestionIdsRadio.length;i++){
                        examQuestionIds += values.examQuestionIdsRadio[i] + "-";
                    }
                    const Radios = examQuestionIds.substring(0,examQuestionIds.length-1);
                    exam.examQuestionIdsRadio = Radios
                    

                    examQuestionIds = "";
                    for(var i = 0;i < values.examQuestionIdsCheck.length;i++){
                        examQuestionIds += values.examQuestionIdsCheck[i] + "-";
                    }
                    const Checks = examQuestionIds.substring(0,examQuestionIds.length-1)
                    exam.examQuestionIdsCheck = Checks


                    examQuestionIds = "";
                    for(var i = 0;i < values.examQuestionIdsJudge.length;i++){
                        examQuestionIds += values.examQuestionIdsJudge[i] + "-";
                    }
                    const Judges = examQuestionIds.substring(0,examQuestionIds.length-1)
                    exam.examQuestionIdsJudge = Judges

                    exam.isOpen = values.isOpen
                    this.setState({
                        exam,
                        radios:values.examQuestionIdsRadio,
                        checks:values.examQuestionIdsCheck,
                        judges:values.examQuestionIdsJudge                   
                    },() => {
                        this.updateExam()
                    })
                }
                
            }
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

    setCurrent = () =>{
        const current = this.state.current + 1;
        this.setState({ current });
    }

    updateExam = ()=>{
        updateExam(this.state.exam).then(resp=>{
                message.success('更新试卷成功')
                this.setState({
                    current: 0
                })
                this.props.hideModal()
                
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
                    title="修改试卷信息"
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