

<template>
  <div style="max-width: 800px;">

    <card class="mb-3" v-show="data.type == 'card'" :data="data" />
    <snippit class="mb-3" v-show="data.type == 'snippit'" :data="data" />
    <list class="mb-3" v-show="data.type == 'list'" :data="data" />
    <yt class="mb-3" v-show="data.type == 'yt'" :data="data" />

  </div>
</template>

<script>
//smaller components
import card from "./Card";
import list from "./List";
import snippit from "./Snippit";
import yt from "./YT";

export default {
  name: "DynamicSubStep",
  components: { card, list, snippit, yt },
  props: ["data"],
  data: function() {
    return {};
  },

  mounted: function() {}
};
</script>

