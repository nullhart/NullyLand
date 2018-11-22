<template>
  <v-container class="noClick">
    <div style="text-align: center; user-select: none; " class="display-2 font-weight-bold ">{{selectedPost.title}}</div>
    <v-divider style="margin: 25px;"></v-divider>
    <div v-for="(things, i) in this.$store.state.applicationData.currentArticle.content" :key="i" style="perspective: 600px;">
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
      selectedPost: this.$store.state.applicationData.currentArticle
    };
  },
  methods: {},
  mounted() {
    window.scrollTo(0, 0);
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
