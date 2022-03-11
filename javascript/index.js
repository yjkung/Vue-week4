import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from "../javascript/pagination.js";

let productModal = '';
let delProductModal = '';

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path ='threecats';

const app = createApp({
  data(){
    return{
      //判斷新產品/既有產品
      isNew:false,
      products:[],
      tempProduct: {
        imagesUrl: [],
      },
      pagination:{}
    }
  },
  components:{
    pagination,delProduct
  },      
  methods:{
    getData(page = 1){
      axios.get(`${url}api/${path}/admin/products?page=${page}`).then(res => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      }).catch(err =>{
        console.dir(err)
      })
    },
    checkLogin(){
      axios.post(`${url}api/user/check`).then(res =>{
        this.getData();
      }).catch(err =>{
        console.log(err);
        alert('請重新登入');
        window.location = 'login.html'
      })
    },
    //以openModal('new'/'edit'/'delete', item)判斷點選哪一個按鈕以及要進行的動作,以及把資料放入 this.tempProduct 
    openModal(isNew,item){
      if(isNew === "new"){
        this.tempProduct = {
          imagesUrl:[]
        };
        console.log(this.tempProduct)
        this.isNew = true;
        productModal.show();
      }else if(isNew === "edit"){
        this.tempProduct = {...item};
        this.isNew = false;
        productModal.show();
      }else if(isNew === "delete"){
        this.tempProduct = {...item};
        delProductModal.show();
      }
      console.log('update:',this.tempProduct);
    },
  },
  mounted(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token

    this.checkLogin();
    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  }
});

// 全域註冊
app.component('productModal',{
  props: ['tempProduct','isNew'],
  template:'#templateForProductModal',
  methods:{
    updateProduct(){
      if (this.isNew){
        axios.post(`${url}api/${path}/admin/product`,{data:this.tempProduct}).then(res =>{
          alert('產品已上傳');
          productModal.hide();
          this.$emit('get-data')  
          }).catch(err=>{
          if(err.status === 400){
            alert('格式不正確');
          }
        })
      }else{
        axios.put(`${url}api/${path}/admin/product/${this.tempProduct.id}`,{data:this.tempProduct}).then(res =>{
          alert('產品已更新');
          productModal.hide();
          // this.getData() 是外層的方法
          // 用emit觸發外層事件
           this.$emit('get-data')  
        }).catch(err =>{
          if(err.status === 400){
            alert('格式不正確');
          }
        })
      }
    },
  }
});

app.component('delProduct',{
  template:'#delProduct',
  props: ['item'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'threecats',
    };
  },
  methods:{
    delProduct(){
      //this.tempProduct 是參考 HTML 中 {{tempProduct.title}} 的位置，應該是在按刪除鍵時 >> 觸發openModal >> 產品資料進入temp
      axios.delete(`${url}api/${path}/admin/product/${this.tempProduct.id}`)
      .then(res => {
        console.log('del:',res);
        delProductModal.hide();
        alert(`已刪除${this.tempProduct.title}`);
        this.$emit('get-data')  
      }).catch(err =>{
        console.log(err);
      })
    }
  },
  mounted(){
    
  }
})

app.mount('#app')