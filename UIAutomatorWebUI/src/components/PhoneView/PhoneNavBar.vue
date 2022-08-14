<template>
  <div class="phone-nav-bar" :style="navBarStyle">
    <phone-key class="el-icon-arrow-left" title="返回上级" style="border-radius:0;font-size:24px;margin:0;" keycode="back"  @pressed="pressed"></phone-key>
    <phone-key class="el-icon-house" title="显示桌面" style="border-radius:0;font-size:24px;margin:0;" keycode="home" @pressed="pressed"></phone-key>
    <phone-key class="el-icon-full-screen" title="近期任务" style="border-radius:0;font-size:24px;margin:0;" keycode="menu"  @pressed="pressed"></phone-key>
  </div>
</template>

<script>
import PhoneKey from './PhoneKey.vue'
export default {
    components:{PhoneKey},
    props:{
        navBarStyle:{type:Object,default(){
            return {
                width:'100%',
                height:'50px'
            }
        }}
    },
    methods:{
        pressed(key){
            this.$emit('pressed',key)
        }
    }
};
</script>

<style>
.phone-nav-bar {
  display: flex;
  flex-direction: row;
}
.phone-nav-item{
    border-radius: 0;
}
</style>