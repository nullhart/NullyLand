<template>
  <div class="wrapper orange">

    <transition name="fade">
      <img class="fade-in-image" :src="imageSrc" v-on:load="onLoaded" v-show="loaded">
    </transition>
  </div>
</template>

<script>
export default {
  name: "fadeInImage",
  components: {},
  props: ["imageSrc"],
  data: function() {
    return {
      src: "http://via.placeholder.com/350x150",
      loaded: false
    };
  },
  methods: {
    onLoaded() {
      this.loaded = true;
    }
  },
  created() {}
};
</script>

<style scoped>
.wrapper {
  width: 300px;
  height: 200px;
}
.fade-in-image {
  width: 100%;
  min-height: 200px;
  max-height: 300px;
}
.fade-enter-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter {
  opacity: 0;
}
</style>