import axios from 'axios'
import {Message,Loading} from 'element-ui'

let loadingInstance = null

axios.defaults.baseURL = '/api/android/device'
axios.interceptors.request.use(config=>{
    loadingInstance = Loading.service({fullscreen:true})
    return config
},()=>{
    loadingInstance.close()
    Message.error('网络错误')
})

axios.interceptors.response.use(response=>{
    loadingInstance.close()
    if(response.data!=null&&response.data.code===200000)
        return response.data.data
    else
        return Message.warning(response.data.message)
},(err)=>{
    loadingInstance.close()
    Message.error(err)
})

export default {
    devices(){
        return axios.get('/list')
    },
    connect(serial){
        return axios.post('/connect',{
            'serial':serial
        })
    },
    dump(serial){
        return axios.post('/dump',{
            'serial':serial
        })
    },
    call(serial,func,selectors,args,kwargs){
        return axios.post(`/call/${func}`,{
            'serial':serial,
            'selectors':selectors,
            'args':args,
            'kwargs':kwargs
        })
    }
}