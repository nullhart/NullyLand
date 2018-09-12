<template>
  <v-container>

    <h1>{{selectedPost.title}}</h1>
    <v-divider></v-divider>

    <div v-for="(things, i) in selectedPost.content" :key="i" style="perspective: 600px;">
      <transition name="stagger">
        <dynamic-sub-step style="margin: auto;" :data="things" class="AllowClick" :style="'animation-delay: ' + 300 * i + 'ms !important; will-change: auto; '" v-show="mounted" />
      </transition>
    </div>

  </v-container>
</template>

<script>
import DynamicSubStep from "../components/DynamicSubStep";

export default {
  name: "Post",
  components: { DynamicSubStep },
  data() {
    return {
      mounted: false,
      selectedPost: this.$store.state.applicationData.post
    };
  },

  methods: {
    compiledMarkdown: function(index) {
      console.log(index);
      return marked(this.post.content[index].text, { sanitize: false });
    }
  },
  computed: {},
  mounted() {
    this.mounted = true;
  }
};
</script>

<style >
@keyframes rotateWobble {
  0% {
    transform: rotateX(120deg);
    opacity: 0;
  }

  50% {
    transform: rotateX(-20deg);
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

.stagger-leave {
  animation-name: rotateWobble reverse;
  animation-duration: 1s;
}

.stagger-enter-to {
  transform: rotateX(90deg);
  animation-name: rotateWobble;
  animation-duration: 1s;
}
</style>
