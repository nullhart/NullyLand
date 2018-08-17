

<template>
    <div>
        {{data.steps}}
        <div v-for="(thing, index) in data" :key="'Dynamic'+index">
            <div class="ma-3" v-show="thing.type == 'card'">
                <card :data="thing" />
            </div>

            <div class="ma-3" v-show="thing.type == 'fiddle'">
                <fiddle :data="thing" />
            </div>

            <list v-show="thing.type == 'list'" />
        </div>
    </div>
</template>

<script>
//smaller components
import card from "./Card";
import list from "./List";
import fiddle from "./Fiddle";

export default {
  name: "DynamicSubStep",
  components: { card, list, fiddle },
  props: ["data"],
  data: function() {
    return {};
  },
  mounted: function() {}
};
</script>

