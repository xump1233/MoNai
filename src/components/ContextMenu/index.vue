<script setup>
import { ref,watchEffect,defineProps} from 'vue';
import { useContextMenu } from './hooks/useContextMenu';


const box = ref(null);
const menu = ref(null);
const info = useContextMenu(box);
const porps = defineProps(['list']);
let list = porps.list;
if(!list){
    list = [{
        label:'你还没指定菜单内容哦'
    }]
}


watchEffect(()=>{
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const isShow = info.isVisible.value?'block':'none';
    let x,y;
    if(menu.value){
        menu.value.style.display = isShow;
        let h = menu.value.clientHeight;
        let w = menu.value.clientWidth;
        if(info.x.value+w>=viewportWidth){
            x = info.x.value-w;
        }
        else{
            x = info.x.value
        }
        if(info.y.value+h>=viewportHeight){
            y = info.y.value-h;
        }
        else{
            y = info.y.value
        }
        menu.value.style.left = x + 'px';
        menu.value.style.top = y + 'px';
    }
    

})

</script>

<template>
    <div class="context-container" ref="box">
        <slot></slot>
        <Teleport to="body">
            <div class="context-menu" ref="menu" v-if="info.isVisible">
                <div class="context-menu-item" v-for="item of list" @click="$attrs.onSelect($event.target.textContent)">
                    <div>
                        {{ item.label }}
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.context-container{
    width: auto;
    height: auto;
}
.context-menu{
    position: fixed;
    background-color: rgb(234, 253, 253);
    min-width: 150px;
    width: auto;
    border-radius: 3px;
    z-index: 2005;
    box-shadow: 1px 2px 3px 3px #00000012;
    padding:5px
}
.context-menu .context-menu-item{
    padding:5px;
    padding-right: 20px;
    cursor: pointer;
    width: auto;
    font-size: 16px;
    white-space: nowrap;
    border-radius:5px;
    display: flex;
}
.context-menu .context-menu-item:hover{
    background-color: rgba(210, 210, 210, 0.232);
}
</style>