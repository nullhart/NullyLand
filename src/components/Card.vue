

<template>

  <v-card class="elevation-3">
    <v-card-text class="cyan elevation-0 white--text mb-0">
      <h3 class="headline font-weight-bold mb-0 text-xs-center">{{data.title}}</h3>
    </v-card-text>
    <transition name="fade">
      <v-card-media><img v-on:onload="log" :src="data.image" :height="imageHeight"></v-card-media>
    </transition>

  </v-card>
</template>


<script>
import list from "./List";

export default {
  name: "Card",
  components: { list },
  props: ["data"],
  data: function() {
    return {
      hello: "test",
      loaded: false,
      imageLoaded: false
    };
  },
  computed: {
    imageHeight: function() {
      if (this.$vuetify.breakpoint.sm) {
        return "410px";
      } else if (this.$vuetify.breakpoint.xs) {
        return "175px";
      } else if (this.$vuetify.breakpoint.md) {
        return "500px";
      } else {
        return "500px";
      }
    }
  },
  methods: {
    log: function() {
      console.log("test");
      this.imageLoaded = true;
      return null;
    },
    imageLoadedUpdate() {
      this.imageLoaded = true;
    }
  },
  created() {}
};
</script>

<style scoped>
</style>