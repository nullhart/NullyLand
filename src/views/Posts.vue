<template >
  <transition-group name="fade" tag="v-layout" v-show="mounted" class="manual-v-layout noClick" style="max-width: 1500px;margin: auto; ">

    <v-flex transition="fade" class="pa-4" v-for="(post, index) in this.$store.state.mainPosts" xs12 sm6 md4 xl4 :key="index" v-bind:data-index="index" @click="$router.push('/Post')">
      <v-hover close-delay="0">
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" class="minny AllowClick" style="margin-left:auto;margin-right:auto; ">
          <v-responsive>

            <v-img :aspect-ratio="16/9" class="generalGradient" transition="imageFade" :src="post.thumbnail">
              <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                <v-progress-circular class="" indeterminate color="yellow"></v-progress-circular>
              </v-layout>
            </v-img>

          </v-responsive>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{post.title}}</div>
              <span class="grey--text">{{post.description}}</span>
            </div>
          </v-card-title>

          <v-card-actions>

            <v-btn icon>
              <v-icon>favorite</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>share</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-chip class="secondary white--text">{{formatedDate(post.dateCreated.seconds)}}</v-chip>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>

  </transition-group>

</template>


<script>
import firebase from "firebase/app";
import "firebase/auth";
import db from "../helpers/firebaseInit";

export default {
  name: "Posts",
  components: {},
  data() {
    return {
      posts: [],
      mounted: false
    };
  },

  mounted() {
    this.$nextTick().then(data => {
      this.mounted = true;
    });
  },
  methods: {
    trimed: function(string, max) {
      return string.substring(0, max) + "...";
    },
    formatedDate: function(date) {
      return new Date(new Date(1970, 0, 1).setSeconds(date)).toDateString();
    }
  }
};
</script>

<style  >
.fade-enter-active,
.fade-move,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.imageFade-enter-active {
  transition: opacity 2s ease-in-out;
}
.imageFade-enter-to {
  transition: opacity 2s ease-in-out;
}
.imageFade-enter {
  opacity: 0;
}
.imageFade-move {
  transition: 2s ease-in-out;
}

.manual-v-layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  padding-bottom: 8px !important;
  padding-top: 8px !important;
}

.minny {
  max-width: 400px;
  min-width: 320px;
}

.center-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
