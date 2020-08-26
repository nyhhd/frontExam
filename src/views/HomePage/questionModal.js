import React, { Component } from 'react'
import { Modal, Button, Steps, message, Form, Input, InputNumber, Select, Radio} from 'antd';
import { Upload, Icon ,Spin} from 'antd';
import axios from 'axios';
import {getStaticDatas, insertQuestion} from '../../requests'
import {Register} from '../../components';

const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
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


const judgeOptionData = [{
    key : 9001,
    value : '正确'
},{
    key : 9002,
    value : '错误'
}]

@Form.create()
class QuestionModal extends React.Component {
    constructor(){
        super()
        this.state = {
            current: 0,
            steps:[],
            typeSteps:[],
            typeIds:[],
            categoryIds:[],
            levelIds:[],
            optionData:[],
            questionName:'',
            questionDescription:'',
            questionCategoryId:'1',
            questionTypeId:'1',
            questionLevelId:'1',
            questionAnswerOptionIds:'',
            isOpen:"",
            questionPicture:"",
            isLoading:false
        }
    }

    createQuestionTypes = ()=>{    
        let promise1 = getStaticDatas('QUESTION_TYPE');
        let promise3
        let promise2
        setTimeout(
            () => {
                 promise2 = getStaticDatas('QUESTION_CATEGORY');
            },
            2000
        ) 
        setTimeout(
            () => {
                promise3 = getStaticDatas('QUESTION_LEVEL');
            },
            3000
        ) 
        setTimeout(
            () => {
                Promise.all([promise1,promise2,promise3]).then(value => {
                    this.setState({
                        typeIds:value[0].data,
                        categoryIds:value[1].data,
                        levelIds:value[2].data
                    },() => {
                        this.setTypeSteps()  
                    })
                })
            },
            4000
        ) 
       
    }

    setTypeSteps = () => {
        const typeSteps = [{
            label:'题型',
            title:'questionTypeId',
            data:this.state.typeIds
        },{
            label:'科目',
            title:'questionCategoryId',
            data:this.state.categoryIds
        },{
            label:'难度',
            title:'questionLevelId',
            data:this.state.levelIds
        }]
        this.setState({
            typeSteps
        })
    }

    handleUploadAvatar = ({file}) => {
        this.setState({
            isLoading: true
        });
        const data = new FormData()
        data.append('editormd-image-file', file)

        // axios.post('http://106.12.93.151:8080/qiantai/uploadController/upload', data)
        axios.post('http://127.0.0.1:8080/summitexam-manager-web/uploadController/upload', data)
            .then(result => {
                if(result.status == 200){
                    message.success("上传成功")
                }else{
                    message.error("上传失败")
                }
                this.setState({
                    isLoading: false,
                    questionPicture: result.data
                });
            }).catch(
                error => {
                    message.error("上传失败")
                }
            )
    };

    createSteps = ()=>{
        const { getFieldDecorator } = this.props.form;
        this.createQuestionTypes();
        const steps = [
            {
              title: '问题内容',
              content: ()=>{
                  return (
                    <>
                        <Form.Item  style={{ textAlign: 'left'}} label="题干">
                            {getFieldDecorator('questionName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入题干',
                                    },
                                ],
                                initialValue: this.state.questionName
                            })(<Input/>)}
                        </Form.Item>
                        <div style={{marginLeft:"110px"}}> 
                            <Upload
                                listType="picture-card"
                                customRequest={this.handleUploadAvatar}
                                showUploadList={false}
                                
                            >
                                <Button>
                                    <Icon type="upload" /> 插入题干图片
                                </Button>
                                <Spin spinning={this.state.isLoading}/>
                            </Upload>
                        </div>
                        <Form.Item  style={{ textAlign: 'left'}} label="权限设置">
                            {getFieldDecorator('isOpen', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择权限设置',
                                    },
                                ],
                                initialValue: this.state.isOpen
                            })(<Radio.Group name="radiogroup">
                                <Radio value={1}>公开</Radio>
                                <Radio value={0}>不公开</Radio>
                          </Radio.Group>)}
                        </Form.Item>
                        <Form.Item  style={{ textAlign: 'left'}} label="解析">
                            {getFieldDecorator('questionDescription', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入解析',
                                    },
                                ],
                                initialValue: this.state.questionDescription
                            })(<TextArea rows={4} />)}
                        </Form.Item>
                    </>
                  )
              }
            },
            {
                title: '问题分类',
                content: ()=>{
                  return (
                    <>
                      {
                          this.state.typeSteps.map(item => {
                              return (
                                  <Form.Item  key={item.title} style={{ textAlign: 'left'}} label={item.label}>
                                      {getFieldDecorator(item.title, {
                                          rules: [
                                              {
                                                  required: true
                                              }
                                          ],
                                          initialValue: this.state[item.title]
                                      })(<Select>
                                          {
                                                item.data.map(value =>{
                                                    return(
                                                        <Option key={value.codeValue} value={value.codeValue}>{value.codeName}</Option>
                                                    )
                                                })
                                          }
                                      </Select>)}
                                  </Form.Item>
                              )
                          })
                      }
                    </>
                  )
                }
            },
            {
                title: '问题选项',
                content: ()=>{
                  const style = this.state.questionTypeId == 3 ? { display: 'none'} : {}
                  const mode = this.state.questionTypeId == 2 ? "multiple" : "default"
                  return (  
                    <>
                        <Form.Item  style={style} label="创建选项">
                            {getFieldDecorator('option', {
                            })(<Input onPressEnter={this.handlePressEnter} placeholder="输入选项后按回车即可添加进下方选项列表中"/>)}
                        </Form.Item>
                        <Form.Item  style={{ textAlign: 'left'}} label="设置答案">
                            {getFieldDecorator("questionData", {
                                rules: [
                                    {
                                        required: true,
                                    },
                                ]
                            })(<Select mode={mode}>
                                {
                                    this.state.optionData.map(item => {
                                        return(
                                            <Option key={item.key} value={item.key}>{item.value}</Option>
                                        )
                                    })
                                }
                            </Select>)}
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

    //处理选项enter事件
    handlePressEnter = e =>{
        const { getFieldValue, resetFields } = this.props.form;
        if(this.judgeValue(getFieldValue('option'))){
            const option = {
                key : getFieldValue('option'),
                value : getFieldValue('option')
            }
            const optionData = this.state.optionData;
            optionData.push(option);
            this.setState({
                optionData
            })
        }else{
            message.error("选项内容重复")
        }
        
        resetFields('option')
    }

    //判断选项内容是否重复
    judgeValue = (value) =>{
        const optionData = this.state.optionData;
        var bool = true;
        optionData.map(item => {
            if(item.value == value){
                bool = false;
            }
        })
        return bool
    }

    componentDidMount(){
        this.createSteps();
    }

    next() {
        this.props.form.validateFields((err, values) => {
            // console.log(values);
            if (!err) {
                if(this.state.current == 0){
                    this.setState({
                        questionName:values.questionName,
                        questionDescription:values.questionDescription,
                        isOpen:values.isOpen
                    },()=>{
                        this.setCurrent()
                    })
                }else if(this.state.current == 1){
                    if(values.questionTypeId == 3){
                        this.setState({
                            optionData:judgeOptionData
                        })
                    }
                    this.setState({
                        questionLevelId:values.questionLevelId,
                        questionTypeId:values.questionTypeId,
                        questionCategoryId:values.questionCategoryId
                    },()=>{
                        this.setCurrent()
                    })
                }else if(this.state.current == 2){
                    const answerIds = values.questionData
                    if(!(answerIds instanceof Array)){
                        this.setState({
                            questionAnswerOptionIds:answerIds
                        },()=>{
                            this.insertQuestion()
                        })
                    }else{
                        var questionAnswerOptionIds = ""
                        answerIds.map(item => {
                            questionAnswerOptionIds += item + "-";
                        })
                        questionAnswerOptionIds = questionAnswerOptionIds.substring(0,questionAnswerOptionIds.length-1)
                        this.setState({
                            questionAnswerOptionIds
                        },()=>{
                            this.insertQuestion()
                        })
                    }
                }
            }
        })    
        
    }
    
    setCurrent = () =>{
        const current = this.state.current + 1;
        this.setState({ current });
    }

    initState = ()=>{
        this.setState({
            current: 0,
            optionData:[],
            questionPicture:""
        },()=>{
            this.props.hideModal()
        });
    }

    //插入问题进表
    insertQuestion = ()=>{
        console.log(this.state);
        const {
            questionName,
            questionDescription,
            questionLevelId,
            questionTypeId,
            questionCategoryId,
            optionData,
            questionAnswerOptionIds,
            isOpen,
            questionPicture
        } = this.state
        var questionOptionIds = "";
        optionData.map(item => {
            questionOptionIds += item.key + "-";
        })
        questionOptionIds = questionOptionIds.substring(0,questionOptionIds.length-1)
        insertQuestion(questionName,
            questionDescription,
            questionLevelId,
            questionTypeId,
            questionCategoryId,
            questionOptionIds,
            questionAnswerOptionIds,
            isOpen,
            questionPicture).then(resp => {
                message.success("创建题目成功")
                this.initState()
            })
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
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

    handleOk = e => {
        this.initState()
        // this.props.hideModal();
    };

    handleCancel = e => {
        this.props.hideModal();
    };

    render() {
        const { current } = this.state;
        return (
            <div>
               <Modal
                    width={640}
                    footer={this.createButton()}
                    title="新建题目"
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

export default QuestionModal