/* eslint-disable */
import "@mdi/font/css/materialdesignicons.css";
import firebase from "firebase/app";
import "firebase/auth";
import Vue from "vue";
import Notifications from "vue-notification";
import VueParticles from "vue-particles/src/vue-particles/";
import "vuetify/dist/vuetify.min.css";
import Vuex from "vuex";
import "../node_modules/material-design-icons-iconfont/dist/material-design-icons.css";
import App from "./App.vue";
import './plugins/vuetify';
import router from "./router";
import store from "./store/store";

Vue.use(Notifications);
Vue.use(VueParticles);
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