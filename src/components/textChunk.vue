

<template>
    <v-card v-show="loaded" dark class=" subheading font-weight-bold  elevation-3" style="margin-left:auto;margin-right:auto; background-color: rgb(39, 40, 34);">
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
