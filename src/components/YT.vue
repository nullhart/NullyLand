<template>
    <div style="margin-left:auto;margin-right:auto;">
        <v-card-text class="red elevation-3 white--text ma-0">
            <p class=" mb-0 text-xs-center title font-weight-bold">
                {{data.title}}
            </p>
        </v-card-text>
        <iframe class="elevation-3" width="100%" height="360" :src="data.url" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
</template>
<style scoped>
code {
  box-shadow: none;
}
</style>


<script>
export default {
  name: "yt",
  components: {},
  props: ["data"]
};
</script>


