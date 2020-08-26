import React, { Component } from 'react'

let interval
export default class Counter extends React.Component{

    constructor(props,context){
        super(props,context)
        this.state={
            flag:this.props.flagTimer,
            hou:0,
            second:0,
            minutes:0,
            strikes:0
        }
        this.timer=this.timer.bind(this)//否则this不对
    }

    timer(){
        const {
            hou,
            minutes
        } = this.state
        if(this.state.flagTimer){
            this.record()
        }
        if(hou == this.props.hou && minutes == this.props.minutes){
            this.props.handleClick()                                    //当时间到了时自动提交
        }
        const nextstrikes =this.state.strikes+50;
        this.setState({
            hou:parseInt(nextstrikes/3600000)%24,
            minutes:parseInt(nextstrikes/60000)%60,
            second: parseInt(nextstrikes/1000)%60,
            strikes:this.state.strikes+50
        })
    }

    record = ()=>{
        clearInterval(interval)
        const {
            hou,
            minutes
        } = this.state
        this.props.handleTimer(hou*60 + minutes)                       //当父组件点击提交时,触发父组件的函数进行回调
    }

    componentWillReceiveProps(nextProps){
       this.setState({
            flagTimer:nextProps.flagTimer
       })  
    }

    componentDidMount() {
        interval = setInterval(this.timer,50);
    }//render结束后
         
    render(){
        return(
            <span>{this.state.hou}:{this.state.minutes}:{this.state.second}</span>
        );
    }
}
    