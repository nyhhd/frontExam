import axios from 'axios'
import { message } from 'antd'
import $ from 'jquery';
const userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
const isDev = process.env.NODE_ENV === 'development'
const authToken = window.localStorage.getItem('authToken') || window.sessionStorage.getItem('authToken')

window.onbeforeunload = (e) =>{
    $.ajax({
        url:'http://127.0.0.1:8080/summitexam-manager-web/User/logout',//url路径
        type:'POST', //GET
        async:false
   })
}
//118.31.77.238
const service = axios.create({
    baseURL:'http://118.31.77.238:8080/summitexam-manager-web'
})

const service1 = axios.create({
    baseURL:'http://118.31.77.238:8080/summitexam-manager-web'
})

//拦截器配置
service.interceptors.request.use((config) => {
    let authToken = window.localStorage.getItem('authToken') || window.sessionStorage.getItem('authToken')
    if(config.url.search("selectQuestionsByTypeId") != -1 || config.url.search("getStaticDatas") != -1){
        
    }
    //可以在请求体中加入保存在浏览器中用户的token数据
    config.data = Object.assign({}, config.data, {
        authToken
    })
    return config
})


//拦截器配置
service.interceptors.response.use((resp) => {
    if(resp.status === 200){   
        if(resp.data.code == 201){
            message.error(resp.data.msg)
            window.localStorage.removeItem('authToken')
            window.sessionStorage.removeItem('authToken')
            window.localStorage.removeItem('userInfo')
            window.sessionStorage.removeItem('userInfo')
            window.location.reload()
        }else if(resp.data.code != undefined && resp.data.code != 200){
            message.error(resp.data.msg)
        }
        return resp.data.data ? resp.data.data : resp.data;
    }else{
        message.error(resp.data.msg)
    }
   
})

service1.interceptors.response.use((resp) => {
    if(resp.status === 200){   
        if(resp.data.code == 200 && resp.data.msg=="登录成功"){
            window.sessionStorage.setItem('authToken', resp.data.token)
            return resp.data
        }else if(resp.data.code != undefined && resp.data.code != 200){
            message.error(resp.data.msg)
        }
        return resp.data.data ? resp.data.data : resp.data;
    }else{
        message.error(resp.data.msg)
    }
})


export const logouting = () => {
    return service.post('/User/logout')
}

export const checkData = (type,param) => {
    return service1.get(`/User/check/${param}/${type}`)
}

export const selectExamRecordById = (id) => {
    return service.post(`/ExamRecord/selectExamRecordById/${id}`)
}

export const getQuestions = (pageNum = 1,pageSize = 10,questionName,questionLevelId,questionTypeId,questionCategoryId) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    return service.post('/Question/selectQuestionsByLike',{
        pageNum,
        pageSize,
        userId:userInfo.userId,
        userRoleId:userInfo.userRoleId,
        questionName,
        questionLevelId,
        questionTypeId,
        questionCategoryId
    })
}

export const getExams = (pageNum = 1,pageSize = 10,examsName,examsCreatorNickname) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    return service.post('/Exams/getExamsByLike',{
        pageNum,
        pageSize,
        userId:userInfo.userId,
        userRoleId:userInfo.userRoleId,
        examsName,
        examsCreatorNickname
    })
}

export const getExamsById = (examsId) => {
    return service.post(`/Exams/${examsId}`)
}

export const getExam = (examId) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    const userId = userInfo.userId
    return service.post(`/Exam/getExam/${examId}`)
}

export const insertExam = (exam) =>{
    return service.post('/Exam/insertExam',{
        ...exam
    })
}

export const getExamByLike = (pageNum = 1,pageSize = 10,examName) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    return service.post('/Exam/getExamByLike',{
        pageNum,
        pageSize,
        examName,
        userId:userInfo.userId,
        userRoleId:userInfo.userRoleId
    })
}

export const insertExams = (examsName,
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
        isOpen) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    return service.post('/Exams/insertExam',{
        examsCreatorId:userInfo.userId,
        examsCreatorNickname:userInfo.userNickname,
        examsName,
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
    })
}

export const insertQuestion = (questionName,
    questionDescription,
    questionLevelId,
    questionTypeId,
    questionCategoryId,
    questionOptionIds,
    questionAnswerOptionIds,
    isOpen,
    questionPicture) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
return service.post('/Question/insertQuestion',{
    questionCreatorId:userInfo.userId,
    questionName,
    questionDescription,
    questionLevelId,
    questionTypeId,
    questionCategoryId,
    questionOptionIds,
    questionAnswerOptionIds,
    isOpen,
    questionPicture
})
}

export const insertExamRecord = (
    examId,
    examsName,
    examJoinScore,
    examJoinDate,
    examResultLevel,
    examTimeCost,
    answerOptionIds
) =>{
let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
return service.post('/ExamRecord/insertExamRecord',{
    examJoinerId:userInfo.userId,
    examId,
    examsName,
    examJoinDate,
    examJoinScore,
    examResultLevel,
    examTimeCost,
    answerOptionIds
})
}

export const getonlineNumber = () => {
    return service.post('/User/getonlineNumber')
}
export const selectQuestionById = (id) =>{
    return service.post(`/Question/selectQuestionById/${id}`)
}

export const deleteQuestion = (id) =>{
    return service.post(`/Question/deleteQuestionById/${id}`)
}

export const deleteExam = (id) =>{
    return service.post(`/Exams/deleteExamById/${id}`)
}

export const getExamRecordsByExamId = (examId) => {
    return service.post(`/Exam/getExamRecordsByExamId/${examId}`)
}

export const updateQuestion = (questionId, questionAnswerOptionIds, questionName, questionOptionList, questionCategoryId, questionLevelId, questionDescription) => {
    return service.post('/Question/updateQuestion',{
        questionId,
        questionAnswerOptionIds,
        questionName,
        questionOptionList,
        questionCategoryId, 
        questionLevelId, 
        questionDescription
    })
}

export const updateExams = (exam) => {
    return service.post('/Exam/updateExam',{
        ...exam
     })
}

export const updateExam = (exam) => {
    const Name = exam.examsName;
    // exam.examsName = "哈哈哈哈哈哈哈哈"
    const {
        examsId,
        examsName,
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
        createTime,
        updateTime} = exam
    // console.log(JSON.stringify(exam))
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    return service.post('/Exams/updateExam',{
       ...exam
    })
}

export const selectQuestionsByTypeId = (TypeId) =>{
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    return service.post('/Question/selectQuestionsByTypeId',{
        userId:userInfo.userId,
        userRoleId:userInfo.userRoleId,
        typeId:TypeId
    })
}

export const selectUsers = (userUsername,type) =>{
    return service.post('/User/selectUsers',{
        userUsername,
        type
    })
}

export const deleteUserById = (userId) =>{
    return service.post(`/User/deleteUserById/${userId}`)
}

export const selectExamRecords = (examJoinerId, examsName) => {
    return service.post('/ExamRecord/selectExamRecordsByLike',{
        examJoinerId,
        examsName
    })
}

export const loginRequest = (username,password) => {
    return service1.post('/User/login',{
        userUsername:username,
        userPassword:password
    })
}

export const loginCheck = (token) => {
    return service.post(`/User/token/${token}`)
}

export const register = (userinfo) =>{
    return service1.post('/User/register',{
        ...userinfo
    })
}

export const updateUser = (userinfo) =>{
    let userInfo1 = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))
    userinfo.userPassword = userInfo1.userPassword
    return service.post('/User/updateUser',{
        ...userinfo
    })
}

export const getStaticDatas = (codeType) =>{
    return service.post(`/getStaticDatas/${codeType}`)
}