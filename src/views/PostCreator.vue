<template>

  <div class="noClick">

    <v-tooltip left class="AllowClick">
      <v-btn slot="activator" @click="dialog = !dialog" class="text-xs-center mb-4" fixed right bottom fab dark large color="orange lighten-1">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
      <span>Add Element</span>
    </v-tooltip>

    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="900px">
        <v-card class="AllowClick">
          <v-card-title>
            <span class="headline black--text">Add/Edit Post Element</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-xs>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select outline v-model="newItemType" :items="postElementTypes" item-text="title" item-value="value" return-object required label="Element Type" required></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field outline v-model="newItemTitle" label="Element Title"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea v-model="newItemDescription" outline label="Element Description"></v-textarea>
                </v-flex>

                <v-flex xs12 v-show="newItemType.value == 'yt'">
                  <v-text-field outline v-model="newItemUrl" label="Element Url"></v-text-field>
                </v-flex>

                <v-flex xs12 v-show="newItemType.value == 'snippit'">
                  <v-text-field outline v-model="newItemLanguage" label="Code Snippit Language"></v-text-field>
                </v-flex>
                <v-flex xs12 v-show="newItemType.value == 'snippit'">
                  <v-textarea :auto-grow="true" outline v-model="newItemCode" label="Element Code Snippet"></v-textarea>
                </v-flex>

                <v-flex xs12>
                  <label for="image">Element Image</label>
                  <v-divider class="mb-1 mt-2"></v-divider>
                  <v-responsive class="elevation-3" v-if="newItemType.value == 'card'">
                    <transition name="fade">
                      <v-img :src="newItemImage" v-model="newItemImage"> <input style="width: 435px; height: 250px; highlight: none; opacity: 0;" @change="onChange($event)" type="file" accept="image/*" id="image"></v-img>
                    </transition>
                  </v-responsive>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addNewItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <div class="AllowClick sideToolbar">
      <v-btn color="green darken-1 white--text font-weight-bold" icon large @click.native="publishArticle">
        <v-icon>mdi-earth</v-icon>
      </v-btn>
      <v-btn color="yellow darken-1 white--text font-weight-bold" icon large @click.native="saveDraft">
        <v-icon>save</v-icon>
      </v-btn>
    </div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list>
        <v-list-tile v-for="(item, index) in items" :key="index" @click="deleteElement">
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-container @contextmenu="show" style="margin: auto;">
      <v-flex xs8 style="margin: auto;">
        <v-card class="elevation-3">
          <div class="text-xs-center">
            <div>
              <input style="width: 100%" class="text-xs-center AllowClick font-weight-bold display-1" v-model="$store.state.newPost.title">
            </div>
            <textarea style="width:100%; height: 100px;" class="text-xs-center AllowClick font-weight-normal " v-model="$store.state.newPost.description"></textarea>
            <v-flex>
              <v-select style="padding: 30px;" class="AllowClick" v-model="newItemTags" :items="tags" chips label="Chips" multiple></v-select>
            </v-flex>
            <v-flex xs6 style="margin: auto; cursor: pointer;">
              <v-img xs2 :src="articleThumbnail" v-model="articleThumbnail"> <input class="AllowClick " style="width: 100%; height: 100%; highlight: none; opacity: 0; " @change="uploadThumbnail($event)" type="file" accept="image/*" id="image"></v-img>
            </v-flex>
          </div>
        </v-card>
      </v-flex>
      <v-divider class="ma-2"></v-divider>
      <div>
        <div @click.right="changeSelectedElement(i)" v-for="(things, i) in $store.state.newPost.content" :key="i" style="perspective: 600px;">
          <dynamic-sub-step slot="activator" style="margin: auto;" :data="things" class="AllowClick" :style="'animation-delay: ' + 300 * i + 'ms !important; will-change: auto; '" v-show="content " />
        </div>
      </div>

    </v-container>

  </div>
</template>

<script>
import DynamicSubStep from "../components/DynamicSubStep";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import db from "../helpers/firebaseInit";

import imageUploader from "../helpers/imageUploader.js";
import { rejects } from "assert";

const articlesRef = db.collection("articles");
const articlesCountRef = db.collection("articleCounter").doc("totalArticles");
const shortid = require("shortid");
export default {
  name: "PostCreator",
  components: { DynamicSubStep },
  data() {
    return {
      dialog: false,
      close: false,
      showMenu: false,
      x: 0,
      y: 0,
      items: [{ title: "Delete Element", action: "deleteElement" }],
      tags: [
        "Javascript",
        "Raspberry Pi",
        "Home Automation",
        "hacker",
        "Random"
      ],

      mounted: false,
      imageLoaded: false,
      notificationStatus: false,
      notification: "",
      notificationType: "",
      content: false,
      articleTitle: "test",
      articleDescription: "test",
      newItemType: {},
      newItemTitle: "",
      newItemDescription: "",
      newItemTags: [],
      newItemUrl: "",
      newItemImage: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA4ODg4PDg8REQ8WFxUXFiAdGxsdIDAiJSIlIjBJLjUuLjUuSUFOQDtATkF0W1FRW3SGcWtxhqORkaPNws3///8BDg4ODg8ODxERDxYXFRcWIB0bGx0gMCIlIiUiMEkuNS4uNS5JQU5AO0BOQXRbUVFbdIZxa3GGo5GRo83Czf/////CABEIAYACQAMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAABAMCAQUG/9oACAEBAAAAAP24AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFPoBKAAAAAAAAAAqnqk8CqUAAAAAAAAABV1tHj7TKqlAAAAAAAAAAVS65e39c/PqlAAAAAAAAAAVS0a6emPMoAAAAAAAAACrOwHOMoAAAAAAAAACrPsGesoAAAAAAAAACvUBPOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/EAC0QAAECAwYFAwUBAAAAAAAAAAEAAwIEEhE0UWKCkRAUMVBSEyAiISNBgaAy/9oACAEBAAE/AP5v24IBBXGq5bKq5bKq5bKq5bKq5bKq5bKq5bKq5bKnW4KBHB383fSoIDGbAhKGK2mNEGEkHqPcbvp7+bvpUmYBFHVwmDCXTTgOABJACMt9u0H5cTd9Pfzd9KBIIINhXru+Q24AEkAJtsNjNwfl7RUP9cDd9Pfzd9PBpm35RdPwE/L/AFtg/YTLQbFp6+ycbhgLZHU9Ubvp7+bvpTMAiJJ6D8e+f6tftG76e/m76U096dQsJtXMjwK5keBXMjwK5keBXMjwK5keBTjgcp+JFiN309/ZcaoocQEjiN0BI4jdASOI3QEjiN0BI4jdASOI3QEjiN0BI4jdOuQUUQfzgf/EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQIBAT8AWD//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAEDAQE/AFg//9k=`,
      newItemImageInfo: {},
      newItemCode: ``,
      newItemLanguage: "",
      articleThumbnail:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA4ODg4PDg8REQ8WFxUXFiAdGxsdIDAiJSIlIjBJLjUuLjUuSUFOQDtATkF0W1FRW3SGcWtxhqORkaPNws3///8BDg4ODg8ODxERDxYXFRcWIB0bGx0gMCIlIiUiMEkuNS4uNS5JQU5AO0BOQXRbUVFbdIZxa3GGo5GRo83Czf/////CABEIAYACQAMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAABAMCAQUG/9oACAEBAAAAAP24AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFPoBKAAAAAAAAAAqnqk8CqUAAAAAAAAABV1tHj7TKqlAAAAAAAAAAVS65e39c/PqlAAAAAAAAAAVS0a6emPMoAAAAAAAAACrOwHOMoAAAAAAAAACrPsGesoAAAAAAAAACvUBPOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/EAC0QAAECAwYFAwUBAAAAAAAAAAEAAwIEEhE0UWKCkRAUMVBSEyAiISNBgaAy/9oACAEBAAE/AP5v24IBBXGq5bKq5bKq5bKq5bKq5bKq5bKq5bKq5bKnW4KBHB383fSoIDGbAhKGK2mNEGEkHqPcbvp7+bvpUmYBFHVwmDCXTTgOABJACMt9u0H5cTd9Pfzd9KBIIINhXru+Q24AEkAJtsNjNwfl7RUP9cDd9Pfzd9PBpm35RdPwE/L/AFtg/YTLQbFp6+ycbhgLZHU9Ubvp7+bvpTMAiJJ6D8e+f6tftG76e/m76U096dQsJtXMjwK5keBXMjwK5keBXMjwK5keBTjgcp+JFiN309/ZcaoocQEjiN0BI4jdASOI3QEjiN0BI4jdASOI3QEjiN0BI4jdOuQUUQfzgf/EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQIBAT8AWD//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAEDAQE/AFg//9k=",

      currentSelectedElement: -1,

      postElementTypes: [
        { value: "snippit", title: "Code" },
        { value: "card", title: "Card" },
        { value: "list", title: "List" },
        { value: "yt", title: "YouTube" },
        { value: "textChunk", title: "Text Block" }
      ],
      postDetails: {}
    };
  },
  mounted() {
    this.content = true;
  },
  computed: {
    postInfo: function() {
      return this.newPost;
    }
  },

  methods: {
    show(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },

    changeSelectedElement: function(e) {
      this.currentSelectedElement = e;
    },
    deleteElement: function() {
      console.log(`Deleting Element at Index: ${this.currentSelectedElement}`);
      this.$store.state.newPost.content.splice(this.currentSelectedElement, 1);
    },
    wait: function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    addNewItem: function() {
      if (this.newItemType.value == "card") {
        var newElement = {
          type: this.newItemType.value,
          title: this.newItemTitle,
          text: this.newItemDescription,
          description: this.newItemDescription,
          image: this.newItemImageInfo
        };
      } else if (this.newItemType.value == "snippit") {
        var newElement = {
          type: this.newItemType.value,
          title: this.newItemTitle,
          text: this.newItemDescription,
          description: this.newItemDescription,
          code: this.newItemCode,
          language: this.newItemLanguage
        };
      } else if (this.newItemType.value == "textChunk") {
        var newElement = {
          type: this.newItemType.value,
          title: this.newItemTitle,
          text: this.newItemDescription
        };
      }

      this.$store.state.newPost.content.push(newElement);
      this.newItemType = "";
      this.newItemTitle = "";
      this.newItemDescription = "";
      this.newItemTags = "";
      this.newItemUrl = "";
      this.newItemImage = "";
      this.newItemImageInfo = "";
      this.newItemCode = "";
      this.newItemLanguage = "";
    },

    publishArticle: function() {
      let articleObj = {
        title: this.$store.state.newPost.title,
        description: this.$store.state.newPost.description,
        dateCreated: new Date(),
        dateUpdated: "",
        thumbnail: this.articleThumbnail,
        id: shortid.generate() + Date.now(),
        content: JSON.parse(JSON.stringify(this.$store.state.newPost)).content
      };

      articlesRef
        .add(articleObj)
        .then(async result => {
          this.$notify({
            group: "main",
            type: "success",
            title: "Article Published!"
          });
        })
        .catch(err => {
          console.log(err);
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

      this.Async_Upload(file).then(data => {
        this.newItemImage = data;
        imageUploader(data, "images", "testFileName").then(data => {
          console.log(data);

          this.newItemImageInfo = {
            downloadUrl: data.downloadUrl,
            id: data.id
          };
        });
      });
    },
    uploadThumbnail(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const file = files[0];

      this.Async_Upload(file).then(data => {
        this.newItemImage = data;
        imageUploader(data, "images", "testFileName").then(data => {
          console.log(data);
          this.articleThumbnail = data.downloadUrl;
        });
      });
    }
  }
};
</script>

<style >
.sideToolbar {
  position: fixed;
  width: 50px;
  height: 90%;
}

.grow {
  resize: both;
} /* none|horizontal|vertical|both */
.grow.vert {
  resize: vertical;
}
.grow.noResize {
  resize: none;
}

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
