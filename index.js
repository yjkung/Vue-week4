import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// 用 const 會跳錯(...show is not a function)
var productModal = '';
var delProductModal = '';

createApp({
  data(){
    return{
      url:'https://vue3-course-api.hexschool.io/v2/',
      path:'threecats',
      //判斷新產品/既有產品
      isNew:false,
      products:[],
      // 不確定是否以圖片網址作為 id/key
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  methods:{
    checkLogin(){
      axios.post(`${this.url}api/user/check`).then(res =>{
        this.getData();
      }).catch(err =>{
        alert('請重新登入');
        window.location = 'login.html'
      })
    },
    getData(){
      axios.get(`${this.url}api/${this.path}/admin/products/all`).then(res => {
        this.products = res.data.products;
      }).catch(err =>{
        console.dir(err)
      })
    },
    //以openModal('new'/'edit'/'delete', item)判斷點選哪一個按鈕以及要進行的動作
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
    },
    updateProduct(){
      if (this.isNew){
        axios.post(`${this.url}api/${this.path}/admin/product`,{data:this.tempProduct}).then(res =>{
          alert('產品已上傳');
          productModal.hide();
          this.getData(); 
        }).catch(err=>{
          if(err.status === 400){
            alert('格式不正確');
          }
        })
      }else{
        axios.put(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`,{data:this.tempProduct}).then(res =>{
          alert('產品已更新');
          productModal.hide();
          this.getData()
        }).catch(err =>{
          if(err.status === 400){
            alert('格式不正確');
          }
        })
      }
    },
    delProduct(){
      //this.tempProduct 是參考 HTML 中 {{tempProduct.title}} 的位置，應該是在按刪除鍵時 >> 觸發openModal >> 產品資料進入temp
      axios.delete(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`)
      .then(res => {
        console.log(res);
        delProductModal.hide();
        alert(`已刪除${this.tempProduct.title}`);
        this.getData()
      }).catch(err =>{
        console.log(err);
      })
    }
  },
  mounted(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token

    this.checkLogin();
    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  }
}).mount('#app')