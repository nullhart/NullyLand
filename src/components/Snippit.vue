<template>
  <div style="margin-left:auto;margin-right:auto; max-width: 800px;">

    <v-card class="elevation-3 ma-0">
      <v-card-text style="background-color: #272822" class=" elevation-4 white--text mb-0">
        <h1 class=" mb-0 text-xs-center title font-weight-bold">
          {{data.title}}
        </h1>
        <v-btn @click="copyToClipboard(code)" icon color="white" class="clipboardGradient" style="position: absolute; right: 5px; top: 1px; border-radius: 100px;">
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </v-card-text>
      <textarea-autosize v-model="code" style="width: 100%; height: 100%; background-color: #272822; color: white; outline: none; width: 100%; height: 100%;" v-show="false"></textarea-autosize>
      <prism class="ma-0" style="width: 100%; height: 100%; border-radius: 0px; " :language="data.language">{{code}}</prism>

    </v-card>
  </div>
</template>
<style scoped>
code {
  box-shadow: none;
}

.clipboardGradient {
  color: white;
  background: linear-gradient(0.48turn, #f3d250, #fe5f55);
}
</style>

<script>
import "./snippit/prism";
import "./snippit/prism.css";
import Prism from "vue-prism-component";
export default {
  name: "Snippit",
  components: { Prism },
  props: ["data"],
  data: function() {
    return {
      edit: true,
      code: this.data.code
    };
  },
  methods: {
    copyToClipboard: function(text) {
      navigator.clipboard.writeText(text).then(result => {
        console.log("coppied");
        this.$notify({
          group: "main",
          type: "success",
          title: "Code Copied to Clipboard! "
        });
      });
    }
  }
};
</script>


