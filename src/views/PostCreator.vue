<template>
  <v-layout>
    <v-flex xs22 style=" overflow-y: scroll;">
      <v-toolbar dense>

        <v-toolbar-title>Editor</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn @click="newCard">new Card</v-btn>

      </v-toolbar>

      <h1 class="text-xs-center" editable>{{$store.state.applicationData.post.title}}</h1>
      <v-container align-content-center>
        <div v-for="(things, i) in $store.state.applicationData.post.content" :key="'base'+i">
          <v-card class="elevation-3">
            <v-card-text class="cyan elevation-0 white--text mb-0">
              <h3 class="headline font-weight-bold mb-0 text-xs-center">{{things.title}}</h3>
            </v-card-text>
            <transition name="fade">
              <v-card-media><img v-on:onload="log" :src="things.image" :height="imageHeight"></v-card-media>
            </transition>
            <div v-for="(step, index) in things" :key="'Step:'+index">
              <dynamic-sub-step :data="step" />
            </div>
          </v-card>
        </div>

      </v-container>
      <div></div>
      <div></div>
    </v-flex>
  </v-layout>
</template>

<script>
import FadeinImage from "../components/FadeInImage";
import DynamicSubStep from "../components/DynamicSubStep";

export default {
  name: "PostCreator",
  components: { FadeinImage, DynamicSubStep },
  data() {
    return {
      mounted: false,
      imageLoaded: false
    };
  },
  computed: {
    imageHeight: function() {
      if (this.$vuetify.breakpoint.sm) {
        return "410px";
      } else if (this.$vuetify.breakpoint.xs) {
        return "175px";
      } else if (this.$vuetify.breakpoint.md) {
        return "500px";
      } else {
        return "500px";
      }
    }
  },

  methods: {
    log: function() {
      console.log("test");
      this.imageLoaded = true;
      return null;
    },
    imageLoadedUpdate() {
      this.imageLoaded = true;
    },

    newCard: function() {
      this.$store.state.applicationData.post.content.push({
        type: "card",
        title: "Example Header",
        text: "Example body text",
        image: "https://picsum.photos/900/500"
      });
    },
    Async_Upload: inputFile => {
      const temporaryFileReader = new FileReader();
      temporaryFileReader.readAsDataURL(inputFile);

      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort();
          reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
          resolve(temporaryFileReader.result);
        };
      });
    },
    onChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const file = files[0];
      const size = file.size && file.size / Math.pow(1000, 2);
      // check file max size
      if (size > this.maxSize) {
        console.log("size-exceeded", size);
        return;
      }

      this.Async_Upload(file).then(data => {
        this.post.content.cards[0].image = data;
        this.file_changed = true;
      });
    }
  }
};
</script>

<style scoped>
</style>
