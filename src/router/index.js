import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component:()=>import('../views/index.vue'),
    children:[
      {
        path:'',
        redirect:'/home'
      },
      {
        path:'/home',
        component:()=>import('../views/home.vue')
      },
      {
        path:'/me',
        component:()=>import('../views/me.vue')
      },
      {
        path:'/order',
        component:()=>import('../views/order.vue')
      },
      {
        path:'/add',
        name:'add',
        component:()=>import('../views/Add.vue')
      },
      {
        path:'/city',
        name:'city',
        component:()=>import('../views/City.vue')
      },
     
    ]
  },
  {
    path:'/login',
    name:'Login',
    component:()=>import('../views/login.vue')
  },
  {
    path:'/search',
    name:'search',
    component:()=>import('../views/Search.vue')
  },
  {
    path:'/shop',
    name:'shop',
    redirect:'/goods',
    component:()=>import('../views/shops/shop.vue'),
    children:[
      {
        path:'/goods',
        name:'goods',
        component:()=>import('../views/shops/goods.vue')
      },
      {
        path:'/comments',
        name:'comments',
        component:()=>import('../views/shops/comments.vue')
      },
      {
        path:'/seller',
        name:'seller',
        component:()=>import('../views/shops/seller.vue')
      },
    ]
  },
  {
    path:'/AddAddress',
    name:'AddAddress',
    component:()=>import('../views/Orders/AddAddress')
  },
  {
    path:'/MyAddress',
    name:'MyAddress',
    component:()=>import('../views/Orders/MyAddress')
  },
  {
    path:'/Settlement',
    name:'Settlement',
    component:()=>import('../views/Orders/Settlement')
  },
  {
    path:'/Remark',
    name:'Remark',
    component:()=>import('../views/Orders/Remark')
  },
  {
    path:'/pay',
    name:'pay',
    component:()=>import('../views/Orders/Pay')
  },
  {
    path:'/orderinfo',
    name:'OrderInfo',
    component:()=>import('../views/Orders/OrderInfo')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass:'active'
})

// 路由守卫
router.beforeEach((to,from,next)=>{
  const isLogin=localStorage.login ? true : false ;
  if(to.path=='/login'){
    next()
  }else{
     isLogin ? next() : next('/login')
  }
})
export default router
