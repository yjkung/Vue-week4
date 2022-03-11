import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js";

createApp({
  data(){
    return{
      user:{
        username:'',
        password:''
      }
    }
  },
  methods:{
    login(){
      const url = "https://vue3-course-api.hexschool.io/v2/admin/signin";
      const path = "threecats";
      axios.post(url,this.user).then(res=>{
        const { token,expired } = res.data;
        console.log(token)
        // 寫入cookie:token,expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
        window.location = 'index.html'
      }).catch(err =>{
        alert(err.data.message);
      })
    }
  }
}).mount('#app')

