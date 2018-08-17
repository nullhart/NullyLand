<template>
    <v-card class="elevation-3">
        <v-card-text style="background-color: #1A1E24" class=" elevation-4 white--text mb-0">
            <p class=" mb-0 text-xs-center title">
                {{data.title}}
            </p>
        </v-card-text>
        <iframe width="100%" height="300" :src="data.url" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
    </v-card>
</template>

<script>
export default {
  name: "fiddle",
  components: {},
  props: ["data"],
  data: function() {
    return {};
  },
  methods: {},
  created() {}
};
</script>
s

