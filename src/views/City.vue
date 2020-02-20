<template>
  <div class="city">
    <div class="search_wrap">
      <div class="search">
        <i class="fa fa-search"></i>
        <input v-model="city_val" type="text" placeholder="输入城市名" />
      </div>
      <button @click="$router.push({name:'add',params:{city:city}})">取消</button>
    </div>
    <div style="height:100%" v-if="searchList.length==0">
      <div class="location" >
        <Location @click="selectCity({name:city})" :address="city" />
      </div>
      <Alphabet @selectCity="selectCity" ref="allcity" :cityInfo="cityInfo" :keys="keys" />
    </div>
    <div class="search_list" v-else>
      <ul>
        <li @click="selectCity(item)" v-for="(item,index) in searchList" :key="index">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Location from "../components/location";
import Alphabet from "../components/Alphabet";
export default {
  data() {
    return {
      city_val: "",
      cityInfo: null,
      keys: [],
      allCities: [],
      searchList: []
    };
  },
  components: {
    Location,
    Alphabet
  },
  computed: {
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  created() {
    this.getCityInfo();
  },
  watch:{
    city_val(){
    this.searchCity()
      
    }
  },
  methods: {
    getCityInfo() {
      this.axios("/api/posts/cities")
        .then(res => {
          this.cityInfo = res.data;
          //处理key
          this.keys = Object.keys(res.data);
          this.keys.pop(); //移除最后的热门城市
          this.keys.sort(); //排序
          this.$nextTick(() => {//在修改数据之后使用$nextTick，则可以在回调中获取更新后的DOM
            this.$refs.allcity.initScroll();
          });
          this.keys.forEach(key => {
            this.cityInfo[key].forEach(city => {
              this.allCities.push(city);
            });
          });
        })
        .catch(er => {
          console.log(re);
        });
    },
    selectCity(city) {
      this.$router.push({ name: "add", params: { city: city.name } });
    },
    searchCity(){
      if(!this.city_val){
        this.searchList=[]
      }else{
        this.searchList=this.allCities.filter(item=>{ //过滤
          return item.name.indexOf(this.city_val)!=-1
        })
      
        
      }
    }

  }
};
</script>
<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  border: none;
  color: #009eef;
  background: #fff;
}

.location {
  background: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>