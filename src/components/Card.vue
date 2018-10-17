

<template>
  <v-card class="elevation-3 post-image" style="margin-left:auto;margin-right:auto;">
    <v-card-text class="orange  elevation-0 white--text mb-0">
      <p class="title font-weight-bold mb-0 text-xs-center">{{data.title}}</p>
    </v-card-text>

    <v-responsive class="orange">
      <!-- <img @load="log" :src="data.image"> -->
      <v-img transition="imageFade" :aspect-ratio="16/9" :src="data.image.downloadUrl">
        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
          <v-progress-circular :size="49" :width="6" indeterminate color="yellow"></v-progress-circular>
        </v-layout>
      </v-img>

    </v-responsive>

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
  watch: {},

  computed: {
    imageHeight: function() {
      if (this.$vuetify.breakpoint.xs) {
        return "175px";
      } else if (this.$vuetify.breakpoint.sm) {
        return "410px";
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

<style >
.imageFade-enter-active {
  transition: opacity 1s ease-in-out;
}
.imageFade-enter-to {
  opacity: 1;
}
.imageFade-enter {
  opacity: 0;
}
.post-image {
  height: 100%;
  max-height: 600px;
  max-width: 800px;
  align-content: center;
}
</style>