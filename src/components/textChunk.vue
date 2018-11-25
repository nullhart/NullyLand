

<template>
  <v-card v-show="loaded" class=" subheading font-weight-bold  elevation-3 white--text" style="margin-left:auto;margin-right:auto; background-color: #272822">
    <v-card-text style="text-indent: 2em">{{data.text}}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "textChunk",
  props: ["data"],
  data: function() {
    return {
      loaded: false
    };
  },
  mounted() {
    this.loaded = true;
  }
};
</script>
