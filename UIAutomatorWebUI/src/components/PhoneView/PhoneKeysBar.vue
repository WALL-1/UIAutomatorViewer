<template>
  <div class="phone-keys-bar" :style="keysBarStyle">
    <phone-key class="el-icon-plus" keycode="volume_up" title="音量+"  @pressed="pressed"></phone-key>
    <phone-key class="el-icon-minus" keycode="volume_down" title="音量-"  @pressed="pressed"></phone-key>
    <phone-key class="el-icon-switch-button" keycode="power" title="电源键" style="margin-top:30px;" @pressed="pressed"></phone-key>
  </div>
</template>

<script>
import PhoneKey from './PhoneKey.vue'
export default {
    components:{PhoneKey},
    props:{
        keysBarStyle:{type:Object,default(){
            return {
                width:'20px',
                height:'200px'
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
.phone-keys-bar {
  display: flex;
  flex-direction: column;
}



</style>