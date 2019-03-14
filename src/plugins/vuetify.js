import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  theme: {
    primary: "#2A1F2D",
    jet: "#3B2C35",
    orange: "#FE5F55",
    lightBlack: "#465362",
    red: "#fe5f55",
    error: "#f78888",
    warning: "#f3d250",
    info: "#2196f3",
    success: "#4caf50",
    background1: "#fff"
  },
  customProperties: true,
  iconfont: 'mdi',
})