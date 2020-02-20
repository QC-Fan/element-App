<template>
  <div class="login">
    <div class="logo">
      <img src="@/assets/logo.jpg" alt />
    </div>
    <inputGroup
      type="number"
      v-model="phone"
      placeholder="手机号"
      :btnTitle="btnTitle"
      :disabled="disabled"
      :error="errors.phone"
      @btnClick="getVerifyCode"
    ></inputGroup>
    <inputGroup type="number" v-model="verifyCode" placeholder="验证码" :error="errors.code"></inputGroup>
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户服务协议》</span>
      </p>
    </div>
    <div class="login_btn">
      <button :disabled="isClick" @click="login">登录</button>
    </div>
  </div>
</template>
<script>
import inputGroup from "../components/inputGroup";
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {
      phone: "",
      verifyCode: "",
      errors: {},
      btnTitle: "获取验证码",
      disabled: false
    };
  },
  computed: {
    //判断输入框是否有值，有的话按钮可以用
    isClick() {
      if (!this.phone || !this.verifyCode) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    login() {
      this.errors = {}; //取消错误提醒
      this.axios
        .post("/api/posts/sms_back", {
          phone: this.phone,
          code: this.verifyCode
        })
        .then(res => {
          console.log(res);
          localStorage.setItem("login", res.data.user._id);
          this.$router.push("/");
        })
        .catch(er => {
          this.errors = {
            code: er.response.data.msg
          };
        });
    },
    //短信验证
    getVerifyCode() {
      if (this.validatePhone()) {
        this.axios
          .post("/api/posts/sms_send", {
            sid: "6f2bc8993de80749366039afc2911044",
            token: "9e863468da0d8e352fae3c7b4e915d41",
            appid: "b79f2f61134441a097e0dfd8c0ecc2f6",
            templateid: "528677",
            phone: this.phone
          })
          .then(res => {
            MessageBox('信息', '您的验证码为：862567');
          
          });
        this.validateBtn();
      }
    },
    //验证码倒计时
    validateBtn() {
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.btnTitle = "获取验证码"; //862567
          this.disabled = false;
        } else {
          this.btnTitle = time + "秒后重新获取";
          this.disabled = true;
          time--;
        }
      }, 1000);
    },
    //判断手机号码
    validatePhone() {
      if (!this.phone) {
        this.errors = {
          phone: "手机号码不能为空"
        };
        return false;
      } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
        this.errors = {
          phone: "请输入正确的手机号码"
        };
        return false;
      } else {
        this.errors = {};
        return true;
      }
    }
  },
  components: {
    inputGroup
  }
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>