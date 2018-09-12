<template>
    <div style="margin-left:auto;margin-right:auto; max-width: 800px;">
        <v-card class="elevation-3 ma-0">
            <v-card-text style="background-color: #272822" class=" elevation-4 white--text mb-0">
                <p class=" mb-0 text-xs-center title font-weight-bold">
                    {{data.title}}
                </p>
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
  methods: {},
  created() {}
};
</script>


