import React, { Component } from 'react'
import { Modal, Button, Steps, message, Form, Input, InputNumber, Select, DatePicker, Radio} from 'antd';
import { Row, Col } from 'antd';
import {getExamRecordsByExamId} from '../../requests'

// 引入 ECharts 主模块(这里路径引入错误参考上文文档描述)
import echarts from 'echarts/lib/echarts'; 
// 引入柱状图（这里放你需要使用的echarts类型 很重要）
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'

import ReactEcharts from 'echarts-for-react'

class EchartModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            exam:props.exam,
            examRecord:[],
            source:[]
        }
    }

    componentDidMount(){
        this.getData()
    }

    componentWillReceiveProps(props){
        if(props.exam != undefined && props.exam.examName != undefined){
            this.setState({
                exam : props.exam
            },() => {
                this.getData();
            })
        }
        
    }

    getOption = ()=>{
        let option = {
            title: {
                text: '考试成绩分布',
                x: 'center'
            },
            tooltip : {
                trigger: 'item',
                //提示框浮层内容格式器，支持字符串模板和回调函数形式。
                formatter: "{a} <br/>{b} : {c} ({d}%)" 
            },
            legend: {
                orient: 'vertical',
                top: 20,
                right: 5,
                data: ['优秀人数','及格人数','不及格人数']
            },
            series : [
                {
                    name:'已考试人数:'+this.state.exam.referenceNumber,
                    type:'pie',
                    data:[
                        {value:this.state.exam.goodNumber, name:'优秀人数(占总分的90%以上)'},
                        {value:this.state.exam.passNumber, name:'及格人数(占总分的60%以上)'},
                        {value:this.state.exam.failingNumber, name:'不及格人数(占总分的60%以下)'}
                    ],
                }
            ]
        }
        return option;
    }

    getZhuOption = () => {
        let option = {
            legend: {},
            tooltip: {},
            dataset: {
                source: this.state.source
            },
            xAxis: {type: 'category'},
            yAxis: {},
            series: [
                {type: 'bar'},
                {type: 'bar'}
            ]
        };
        return option        
    }

    getData = () => {
        getExamRecordsByExamId(this.state.exam.examId).then(
            resp => {
                this.setState({
                    examRecord:resp.examRecords
                },()=>{
                    this.initData()
                })
            }
        )
    }

    compare = (property) => {
        return (a,b) => {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    initData = () => {
        const  examRecord = this.state.examRecord
        // examRecord.sort(this.compare('examJoinScore'))
        const source = []
        source.push(['prduct', '考试成绩/分', '考试耗时/分钟'])
        if(examRecord != undefined && examRecord.length > 0){
            let i = 0;
            examRecord.map(
                item => {
                    let data = []
                    data.push(item.examJoinerName)
                    data.push(item.examJoinScore)
                    data.push(item.examTimeCost)
                    source.push(data)
                }
            )
        }
        this.setState({
            source
        })
    }

    handleCancel = e => {
        this.props.hideModal();
    };

    handleOk = e => {
        this.props.hideModal();
    }

    
    render() {
        return (
            <Modal
                    width={800}
                    title="考试信息分析"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >   
                <Row gutter={20}>
                    <Col className="gutter-row" span={14}>
                        <ReactEcharts option={this.getOption()}/>
                    </Col>
                    <Col className="gutter-row" span={10}>
                        <ReactEcharts option={this.getZhuOption()}/>
                    </Col>
                </Row>
           </Modal>
        )
    }
}

export default EchartModal