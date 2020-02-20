<template>
  <div class="home">
    <div class="header">
      <!-- params:传参 -->
      <div class="address_map" @click="$router.push({name: 'add',params: {city: city}})">
        <i class="fa fa-map-marker"></i>
        <span>{{address}}</span>
        <i class="fa fa-sort-desc"></i>
      </div>
    </div>
    <div class="search_wrap" :class="{'fixedview':showFilter}" @click="$router.push('/search')">
      <div class="shop_search">
        <i class="fa fa-search"></i>
        搜索商家 商家名称
      </div>
    </div>
    <div id="container">
      <!-- 轮播 -->
      <mt-swipe :auto="4000" class="swiper">
        <mt-swipe-item v-for="(img,index) in swipeImgs" :key="index">
          <img :src="img" alt />
        </mt-swipe-item>
      </mt-swipe>
      <!-- 分类 -->
      <mt-swipe :auto="0" class="entries">
        <mt-swipe-item v-for="(entry,i) in entries" :key="i" class="entry_wrap">
          <div class="foodentry" v-for="(item,index) in entry" :key="index">
            <div class="img_wrap">
              <img :src="item.image" alt />
            </div>
            <span>{{item.name}}</span>
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- 推荐商家 -->
    <div class="shoplist-title">推荐商家</div>
    <FilterVue :filterData="filterData" @searchFixed="showFilterView" @update="update" />

    <!-- 商家信息 -->
    <mt-loadmore
      :top-method="loadData"
      :bottom-method="loadMore"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false"
      :bottomPullText="bottomPullText"
      ref="loadmore"
    >
      <div class="shoplist">
        <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant" />
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Loadmore } from "mint-ui";
import FilterVue from "../components/FilterVue";
import IndexShop from "../components/indexShop";

export default {
  data() {
    return {
      swipeImgs: [],
      entries: [],
      filterData: null,
      showFilter: false,
      page: 1,
      size: 5,
      restaurants: [], //存放商家信息的容器
      allLoaded: false,
      bottomPullText: "上拉加载更多",
      data: null
    };
  },
  components: {
    FilterVue,
    IndexShop
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.axios.get("/api/profile/shopping").then(res => {
        this.swipeImgs = res.data.swipeImgs;
        this.entries = res.data.entries;
      });
      this.axios("/api/profile/filter").then(res => {
        this.filterData = res.data;
        // console.log(res);
      });
      //拉取商家信息
      this.loadData();
    },
    loadData() {
      this.page = 1;
      this.allLoaded = false;
      this.bottomPullText = "上拉加载更多";
      this.axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`, this.data)
        .then(res => {
          // console.log(res.data);
          this.$refs.loadmore.onTopLoaded();
          this.restaurants = res.data;
        });
    },
    loadMore() {
      if (!this.allLoaded) {
        this.page++;
        this.axios
          .post(`/api/profile/restaurants/${this.page}/${this.size}`)
          .then(res => {
            this.$refs.loadmore.onBottomLoaded();
            if (res.data.length > 0) {
              res.data.forEach(item => {
                this.restaurants.push(item);
              });
              if (res.data < this.size) {
                this.allLoaded = true;
                this.bottomPullText = "没有更多了哦";
              }
            } else {
              this.allLoaded = true;
              this.bottomPullText = "没有更多了哦";
            }
          });
      }
    },
    showFilterView(isShow) {
      this.showFilter = isShow;
    },

    //排序
    update(condation) {
      // console.log(condation);
      this.data = condation;
      this.loadData();
    }
  }
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;  /*当内容溢出时，出现滚动条 */
  box-sizing: border-box;
}
.header,
.search_wrap {
  background-color: #009eef;
  padding: 10px 16px;
}
.header .address_map {
  color: #fff;
  font-weight: bold; /*粗体 */
}
.address_map i {
  margin: 0 3px;
  font-size: 18px;
}
.address_map span {
  display: inline-block; /* 定义为行内块级元素*/
  width: 80%;
  overflow: hidden; /* 内容溢出不显示*/ 
  white-space: nowrap;/*文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。 */
  text-overflow: ellipsis;/*	溢出时省略号表示。 */
}
.search_wrap .shop_search {
  /* margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}

.search_wrap {
  position: sticky;/*top:0之前是相对定位，top：0之后变为绝对定位 */
  top: 0px;
  z-index: 999;
  box-sizing: border-box;
}
.swiper {
  height: 100px;
}
.swiper img {
  width: 100%;
  height: 100px;
}

.entries {
  background: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}
/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title:after, /*after 在内容前面加内容   before在内容后加内容*/
.shoplist-title:before {
  display: block;
  content: "一";  /*加的内容 */
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}

.fixedview {
  width: 100%;
  position: fixed; /*定在这个位置，滚动时不会改变 */
  top: 0px;
  z-index: 999;
}

.mint-loadmore {
  height: calc(100% - 95px);
  overflow: auto;
}
</style>