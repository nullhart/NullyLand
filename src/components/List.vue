<template>

    <v-card class="elevation-3 post-image" style="margin-left:auto;margin-right:auto;">
        <v-card-text class="cyan elevation-0 white--text mb-0">
            <p class="font-weight-bold title mb-0 text-xs-center">{{data.title}}</p>
        </v-card-text>
        <div>
            <v-list v-for="(item, i) in data.content" :key="i" subheader dense one-line>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <a :href="item.url" target="_blank">{{item.title}}</a>
                        </v-list-tile-title>

                    </v-list-tile-content>
                </v-list-tile>

                <v-divider v-if="i + 1 < data.content.length"></v-divider>
            </v-list>

        </div>
    </v-card>

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
