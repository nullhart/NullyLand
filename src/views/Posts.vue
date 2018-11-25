<template >
  <transition-group name="slide-x-transition" tag="v-layout" v-show="mounted" class="manual-v-layout noClick" style="max-width: 1500px;margin: auto; ">
    <v-flex transition="fade" class="pa-4" v-for="(post, index) in this.$store.state.mainPosts" xs12 sm6 md4 xl4 :key="post.id" v-bind:data-index="index">
      <v-hover close-delay="0">
        <v-card slot-scope=" { hover }" :class="`elevation-${hover ? 12 : 2}`" class="minny mb-0 AllowClick" style="margin-left:auto;margin-right:auto; padding-bottom: 58px; ">
          <v-responsive>
            <v-img @click="goToArticle(post)" style="cursor: pointer;" :aspect-ratio="16/9" class="generalGradient" transition="imageFade" :src="post.thumbnail">
              <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                <v-progress-circular class="" indeterminate color="yellow"></v-progress-circular>
              </v-layout>
            </v-img>
          </v-responsive>
          <v-card-title class="pa-2 " style="font-size: 100%; " @click="goToArticle(post)" primary-title>
            <v-flex>
              <div class="headline text-xs-center">{{post.title}}</div>
              <div class="grey--text">{{trimed(post.description,175)}}</div>
            </v-flex>
          </v-card-title>
          <v-card-actions style="position: absolute; bottom: 0; width: 100%;">
            <v-btn icon @click="addToFavs(post.id)">
              <v-icon class="black--text" :class="{'red--text': isHearted(post.id)}">favorite</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon class="black--text">share</v-icon>
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
    window.scrollTo(0, 0);
    this.$nextTick().then(data => {
      this.mounted = true;
    });
  },
  methods: {
    isHearted: function(id) {
      try {
        let hearted = this.$store.state.UserProfile.saved.find(element => {
          if (element.id == id) {
            return true;
          }
          if (element == undefined) {
            return false;
          } else {
            return false;
          }
        });
        return hearted;
      } catch (error) {
        // console.log("Heart Information not Available While Logged Off");
        return false;
      }
    },
    addToFavs: function(post_id) {
      try {
        if (
          this.$store.state.UserProfile.saved.find(
            element => element.id == post_id
          )
        ) {
          //  this.$store.state.UserProfile.saved.splice(post_id);
          let index = this.$store.state.UserProfile.saved.findIndex(element => {
            return element.id == post_id;
          });
          if (index == 0) {
            this.$store.state.UserProfile.saved.shift();
          } else {
            this.$store.state.UserProfile.saved.splice(index);
          }
        } else {
          this.$store.state.UserProfile.saved.push({
            id: post_id,
            dateAdded: new Date()
          });
        }
        //Write Change to DB
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update(this.$store.state.UserProfile)
          .then(result => {})
          .catch(err => {
            console.log(err);
          });
      } catch (error) {
        this.$notify({
          group: "main",
          type: "error",
          title: "Please Login to Heart Articles 🤪"
        });
      }
    },
    trimed: function(string, max) {
      if (string.length < max) {
        return string;
      }
      return string.substring(0, max) + "...";
    },
    formatedDate: function(date) {
      return new Date(new Date(1970, 0, 1).setSeconds(date)).toDateString();
    },
    goToArticle: function(articleInfo) {
      this.$store.state.applicationData.currentArticle = articleInfo;
      this.$router.push("/Post");
    }
  }
};
</script>

<style  >
.warm-gradient {
  background: linear-gradient(0.45turn, #ffc3a0, #ffafbd);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
/* .fade-move {
  transition: 1.5s;
} */
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* Fade in Image Transition  */
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
/* Limit Card Sizes  */
.minny {
  max-width: 400px;
  min-width: 320px;
  max-height: 380px;
  min-height: 380px;
}
/* Center The Image Loading Spinner */
.center-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
