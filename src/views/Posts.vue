<template>

  <v-container class="noClick" v-show="mounted" fluid grid-list-md>
    <v-layout wrap>
      <v-flex v-for="(post, index) in posts" xs12 sm6 md4 xl4 :key="index" v-bind:data-index="index" @click="$router.push('/Post')">
        <v-card class="minny AllowClick" style="margin-left:auto;margin-right:auto;">
          <v-responsive>

            <v-img :aspect-ratio="16/9" class="orange" transition="imageFade" :src="'https://picsum.photos/600/400?random' + Math.random()">
              <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                <v-progress-circular class="" indeterminate color="yellow"></v-progress-circular>
              </v-layout>
            </v-img>

          </v-responsive>
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
export default {
  name: "Posts",
  components: {},
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
    trimed: function(string, max) {
      return string.substring(0, max) + "...";
    },
    formatedDate: function(date) {
      return new Date(date).toDateString();
    }
  }
};
</script>

<style >
.imageFade-enter-active {
  transition: opacity 1s ease-in-out;
}
.imageFade-enter-to {
  opacity: 1;
}
.imageFade-enter {
  opacity: 0;
}
.imageFade-move {
  transition: 1s ease-in-out;
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
