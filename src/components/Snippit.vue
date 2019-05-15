<template>
  <div style="margin-left:auto;margin-right:auto; max-width: 800px; position: relative;">
    <v-card class="elevation-3 ma-0">
      <v-card-text style="background-color: #272822" class="elevation-4 white--text mb-0">
        <h1 class="mb-0 pr-4 pl-4 text-xs-center title font-weight-bold">{{data.title}}</h1>

        <v-btn
          @click="copyToClipboard(code,$event)"
          icon
          color="white"
          class="clipboardGradient"
          style="position: absolute; right: -3px; top: -3px; border-radius: 100px; "
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </v-card-text>
      <prism
        class="ma-0"
        style="width: 100%; height: 100%; border-radius: 0px; "
        :language="data.language"
      >{{code}}</prism>
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
  computed: {
    isMobile: function() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    var confetti = require("../helpers/confetti.js");
  },
  methods: {
    copyToClipboard: (text, event) => {
      try {
        navigator.clipboard.writeText(text).then(result => {
          confetti(event.target, {
            angle: 90,
            spread: 50,
            startVelocity: 19,
            elementCount: 25,
            decay: 0.85
          });
        });
      } catch (err) {
        // Clipboard.copy(text);
        confetti(event.target, {
          angle: 90,
          spread: 50,
          startVelocity: 19,
          elementCount: 25,
          decay: 0.85
        });
      }
    }
  }
};
</script>


