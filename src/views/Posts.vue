<template>

  <v-container v-show="mounted" fluid grid-list-md>
    <v-layout wrap>
      <v-flex v-for="(post, index) in posts" xs12 sm6 md4 xl4 :key="index" v-bind:data-index="index" @click="$router.push('/Post')">
        <v-card class="minny">
          <v-card-media height="200px" width="300px">
            <fade-in-image class="fade-in-image " :imageSrc="'https://picsum.photos/200/300?random' + Math.random()" />
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{post.title}}</div>
              <span class="grey--text">{{trimed(post.description, 120)}}</span>
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
            <v-chip class="secondary white--text">{{formatedDate(post.postedDate)}}</v-chip>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>
<script>
import FadeInImage from "@/components/FadeInImage.vue";
export default {
  name: "Posts",
  components: {
    FadeInImage
  },
  data() {
    return {
      posts: [
        {
          title: "Raspberry Pi Spy Cam",
          description: "this is a test description that is way to long",
          postedDate: new Date()
        },
        {
          title: "Raspberry Pi Spy Cam",
          description: "this is a test description that is way to long",
          postedDate: new Date()
        },
        {
          title: "Raspberry Pi Spy Cam",
          description: "this is a test description that is way to long",
          postedDate: new Date()
        },
        {
          title: "Raspberry Pi Spy Cam",
          description: "this is a test description that is way to long",
          postedDate: new Date()
        },
        {
          title: "Raspberry Pi Spy Cam",
          description: "this is a test description that is way to long",
          postedDate: new Date()
        },
        {
          title: "Raspberry Pi Spy Cam",
          description: "this is a test description that is way to long",
          postedDate: new Date()
        }
      ],
      mounted: false
    };
  },
  mounted() {
    this.$nextTick().then(data => {
      this.mounted = true;
    });
  },
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter: function(el, done) {
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 1, height: "1.6em" }, { complete: done });
      }, delay);
    },
    leave: function(el, done) {
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    },
    trimed: function(string, max) {
      return string.substring(0, max) + "...";
    },
    formatedDate: function(date) {
      return new Date(date).toDateString();
    }
  }
};
</script>

<style scoped>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: opacity 2s;
}
</style>
