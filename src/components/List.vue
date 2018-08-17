<template>
    <v-expansion-panel>
        <v-expansion-panel-content v-for="(item,i) in data" :key="i">
            <div slot="header">{{item.title}}</div>
            <v-card>
                <v-card-text>
                    <code>{{item.text}}</code>
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
export default {
  name: "List",
  components: {},
  props: ["data"],
  data: function() {
    return {};
  },
  mounted: () => {}
};
</script>

<style scoped >
</style>
