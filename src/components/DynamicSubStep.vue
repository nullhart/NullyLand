

<template>
  <div style="max-width: 800px;">
    <component v-bind:is="data.type" :data="data" class="mb-3"></component>
  </div>
</template>

<script>
//smaller components
import card from "./Card";
import list from "./List";
import snippit from "./Snippit";
import yt from "./YT";
import textChunk from "./textChunk";

export default {
  name: "DynamicSubStep",
  components: { card, list, snippit, yt, textChunk },
  props: ["data"],
  data: function() {
    return {};
  },

  mounted: function() {}
};
</script>

