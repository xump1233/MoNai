import { defineComponent, ref } from "vue";
import "./index.less";
import * as Api from "@/api"

import { NCard,NButton,NLoadingBarProvider,useLoadingBar,useMessage,NInput  } from "naive-ui";
import MaterialInput from "@/components/MaterialInput/index.vue";
import { useRouter } from "vue-router";
import { setToken } from "@/request";

const LoginWindow = defineComponent({
  setup(){
    const message = useMessage();
    const router = useRouter();
    const title = ref("登录");
    const username = ref('');
    const password = ref('');
    const newUserInfo = ref({
      username:'',
      password:'',
      rpassword:''
    })
    const loadingBar = useLoadingBar();
    const boxTranform = ref({
      resigter:"-100%",
      username:"0%",
      password:"100%"
    })

    function registerVerify():{pass:boolean,reason:string}{
      // TODO
      return {
        pass:true,
        reason:''
      };
    }
    function toResigter(){
      boxTranform.value.resigter = "0%";
      boxTranform.value.username = "100%";
      boxTranform.value.password = "200%";
    }
    function toUsername(){
      boxTranform.value.resigter = "-100%";
      boxTranform.value.username = "0%";
      boxTranform.value.password = "100%";
    }
    function toPassword(){
      boxTranform.value.resigter = "-200%";
      boxTranform.value.username = "-100%";
      boxTranform.value.password = "0%";
    }
    return ()=>(
      <NCard
        style={{
          width:"400px",
          height:"330px",
        }}
        contentStyle={{
          overflow:"hidden",
        }}
        title={title.value}
      >
        
        <div class="box resigter-content" style={{transform:`translate(${boxTranform.value.resigter},0)`}}>
          <div class="resigter-form">
            <div class="resigter-form-item">
              <div class={"resigter-form-item-label"}>新用户名：</div>
              <NInput value={newUserInfo.value.username} onUpdate:value={(value)=>{
                newUserInfo.value.username = value
              }} placeholder={"请输入新用户名"}></NInput>
            </div>
            <div class="resigter-form-item">
              <div class={"resigter-form-item-label"}>新密码：</div>
              <NInput value={newUserInfo.value.password} onUpdate:value={(value)=>{
                newUserInfo.value.password = value
              }} placeholder={"请输入新密码"} show-password-on="click" type="password"></NInput>
            </div>
            <div class="resigter-form-item">
              <div class={"resigter-form-item-label"}>确认新密码：</div>
              <NInput value={newUserInfo.value.rpassword} onUpdate:value={(value)=>{
                newUserInfo.value.rpassword = value
              }}  placeholder={"新重新确认密码"} show-password-on="click" type="password"></NInput>
            </div>
            
          </div>
          <div class="signin-buttons" style={{justifyContent:"space-between"}}>
            <NButton onClick={()=>{
              const verify = registerVerify()
              if(!verify.pass) {
                message.warning(verify.reason)
                return
              }
              Api.USER.postUserRegister({
                username:newUserInfo.value.username,
                password:newUserInfo.value.password
              }).then(res=>{
                if(!res.success){
                  message.error(res.error)
                  return;
                }
                message.success("注册成功！")
              })
            }}>注册</NButton>
            <NButton onClick={()=>{
              title.value = "登录";
              toUsername();
            }}>返回</NButton>
          </div>
        </div>
        <div class="box username-content" style={{transform:`translate(${boxTranform.value.username},-100%)`}}>
          <MaterialInput label={"用户名"} inputValue={username.value} onUpdate={(value:string)=>{
            username.value = value
          }}></MaterialInput>
          <div class="signin-buttons" style={{justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center"}}>
              <span>没有账户？<span style={{color:"#18a058",cursor:"pointer"}} onClick={()=>{
                toResigter();
                title.value = "注册"
              }}>立即注册</span></span>
            </div>
            <NButton onClick={()=>{
              loadingBar.start(); 
              Api.USER.postVerifyName({
                username:username.value
              }).then((res)=>{
                if(!res.success){
                  message.error(res.error);
                  loadingBar.error();
                  return
                }
                toPassword();
              }).catch(()=>{
                loadingBar.error();
              }).finally(()=>{
                loadingBar.finish();
              })
            }}>下一步</NButton>
          </div>
        </div>
        <div class="box password-content" style={{transform:`translate(${boxTranform.value.password},-200%)`}}>
          <MaterialInput label={"请输入您的密码"} type="password" inputValue={password.value} onUpdate={(value:string)=>{
            password.value = value;
          }}></MaterialInput>
          <div class="signin-buttons" style={{
              justifyContent:"space-between"
            }}>
            <NButton onClick={toUsername}>上一步</NButton>
            <NButton onClick={()=>{
              Api.USER.postVerifyPwd({
                username:username.value,
                password:password.value,
              }).then(res=>{
                if(!res.success){
                  message.error(res.error);
                  return
                }
                setToken("Bearer " + res.token);
                message.success(res.message);
                router.push("/index");
                localStorage.setItem("userInfo",JSON.stringify({
                  username:username.value
                }));
              })
            }}>登录</NButton>
          </div>
        </div>
      </NCard>
    )
  }
})

export default defineComponent({
  setup() {
    const loginWindowRef = ref();
    

    return ()=>(
      <div class={"login-container"}>
        <NLoadingBarProvider
          to={loginWindowRef.value?.$el || null}
          container-style="position: absolute;"
        >
          <LoginWindow ref={loginWindowRef}></LoginWindow>
        </NLoadingBarProvider>
        
      </div>
    )
  },
})