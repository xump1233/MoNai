import { defineComponent,ref,watch } from "vue";
import "./index.less"

export default defineComponent({
  props:{
    initValue:{
      type:Number,
    },
    onAdd:{
      type:Function
    },
    onSub:{
      type:Function
    }
  },
  setup(props) {
    const reta = ref(1);
    watch(()=>props.initValue,(value)=>{
      if(value){
        reta.value = value;
      }
    })
    function add(){
      props.onAdd && props.onAdd(reta.value+0.1);
      reta.value += 0.1;
    }
    function sub(){
      props.onSub && props.onSub(reta.value-0.1);
      reta.value -= 0.1;
    }
    
    return ()=>(
      <div class="reta-bar-container">
        <div style={{fontSize:"14px"}}>缩放比例：</div>
        <div class="reta-bar-change" onClick={sub}>-</div>
        <div class="reta-bar-content">
          <div class="reta-bar-base">
            <div class="reta-bar-process" style={{width:`${reta.value*100 / 2}%`}}></div>
          </div>
        </div>
        <div class="reta-bar-change" onClick={add}>+</div>
        <div class="reta-bar-info">{`${Math.floor(reta.value*100)}%`}</div>
      </div>
    )
  },
})