/* eslint-disable */
import "@mdi/font/css/materialdesignicons.css";
import 'babel-polyfill';
import firebase from "firebase/app";
import "firebase/auth";
import Vue from "vue";
import contenteditableDirective from "vue-contenteditable-directive";
import Notifications from 'vue-notification';
import VueParticles from "vue-particles/src/vue-particles/";
import VueTextareaAutosize from 'vue-textarea-autosize';
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import Vuex from "vuex";
import "../node_modules/material-design-icons-iconfont/dist/material-design-icons.css";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";


Vue.use(Notifications)
Vue.use(VueParticles)
Vue.use(VueTextareaAutosize)
Vue.use(contenteditableDirective);



Vue.use(Vuetify, {
  theme: {
    primary: "#2A1F2D",
    jet: "#3B2C35",
    orange: "#FE5F55",
    lightBlack: "#465362",
    red: '#fe5f55',
    error: "#f78888",
    warning: "#f3d250",
    info: "#2196f3",
    success: "#4caf50",
    background1: "#fff"
  },
  iconfont: "mdi"
});
Vue.use(router);
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(App);
let app;
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      router,
      store,

      render: h => h(App)
    }).$mount("#app");
  }
});