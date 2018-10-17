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
            <v-container grid-list-sm>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select solo v-model="newItemType" :items="postElementTypes" item-text="title" item-value="value" return-object label="Element Type" required></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field solo v-model="newItemTitle" label="Element Title"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea v-model="newItemDescription" solo label="Element Description"></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-text-field solo v-model="newItemUrl" label="Element Url"></v-text-field>
                </v-flex>

                <div v-show="newItemType.value == 'snippit'">
                  <v-flex xs12>
                    <v-text-field :auto-grow="true" style="width: 200%;" solo background-color="white" v-model="newItemLanguage" label="Code Snippit Language"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea :auto-grow="true" style="width: 200%;" solo background-color="white" v-model="newItemCode" label="Element Code Snippet"></v-textarea>
                  </v-flex>

                </div>

                <v-flex xs12>
                  <label for="image">Element Image</label>
                  <v-divider class="mb-1 mt-2"></v-divider>
                  <v-responsive class="elevation-3" v-if="newItemType.value == 'card'">
                    <transition name="fade">
                      <v-img :src="newItemImage" v-model="newItemImage"> <input style="width: 435px; height: 250px; highlight: none; opacity: 0;" @change="onChange($event)" type="file" accept="image/*" id="image"></v-img>
                    </transition>
                  </v-responsive>
                  {{this.$store.state.newPost}}

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
    <v-container @contextmenu="show" style="margin-left: 40px;">
      <v-card class="elevation-3">
        <div class="text-xs-center">
          <h1>Post Info</h1>

          <div class="text-xs-center AllowClick font-weight-bold display-2" contenteditable="true" @input="$store.state.newPost.title = $event.target.childNodes[0].data">{{$store.state.newPost.title}}</div>
          <div class="text-xs-center AllowClick font-weight-normal display-1" contenteditable="true" @input="$store.state.newPost.description = $event.target.childNodes[0].data">{{$store.state.newPost.description}}</div>
          <v-flex>
            <v-select style="padding: 30px;" class="AllowClick" v-model="newItemTags" :items="tags" chips label="Chips" multiple></v-select>
          </v-flex>
          <v-flex xs6 style="margin: auto;">
            <v-img xs2 :src="articleThumbnail" v-model="articleThumbnail"> <input class="AllowClick" style="width: 100%; height: 100%; highlight: none; opacity: 0;" @change="onChange($event)" type="file" accept="image/*" id="image"></v-img>
          </v-flex>
        </div>
      </v-card>
      <v-divider class="ma-2"></v-divider>
      <div>

        <div @click.right="changeSelectedElement(i)" v-for="(things, i) in $store.state.newPost.content" :key="i" style="perspective: 600px;">
          <dynamic-sub-step slot="activator" style="margin: auto;" :data="things" class="AllowClick" :style="'animation-delay: ' + 300 * i + 'ms !important; will-change: auto; '" v-show="test " />

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

const articlesRef = db.collection("articles");
const articlesCountRef = db.collection("articleCounter").doc("totalArticles");

export default {
  name: "PostCreator",
  components: { DynamicSubStep },
  data() {
    return {
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
      test: false,
      articleTitle: "test",
      articleDescription: "test",
      newItemType: {},
      newItemTitle: "",
      newItemDescription: "",
      newItemTags: [],
      newItemUrl: "",
      newItemImage: `https://via.placeholder.com/350x200`,
      newItemImageInfo: {},
      newItemCode: ``,
      newItemLanguage: "",
      articleThumbnail: "https://via.placeholder.com/350x200",

      currentSelectedElement: -1,
      dialog: false,
      postElementTypes: [
        { value: "snippit", title: "Code Snippit" },
        { value: "card", title: "Card" },
        { value: "list", title: "List" },
        { value: "yt", title: "YouTube" }
      ],
      postDetails: {}
    };
  },
  mounted() {
    this.test = true;
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
      }

      this.$store.state.newPost.content.push(newElement);
    },

    publishArticle: function() {
      let articleObj = {
        title: this.$store.state.newPost.title,
        description: this.$store.state.newPost.description,
        dateCreated: new Date(),
        dateUpdated: "",
        thumbnail: this.articleThumbnail,

        content: JSON.parse(JSON.stringify(this.$store.state.newPost)).content
      };
      console.log(articleObj);
      articlesRef
        .add(articleObj)
        .then(async result => {
          console.log("Post Published");
          var currentCount = await db
            .collection("articleCounter")
            .doc("totalArticles")
            .get()
            .then(data => {
              return data.data().count;
            });
          console.log(`Current count is at: ${currentCount}`);

          db.collection("articleCounter")
            .doc("totalArticles")
            .set({ count: currentCount + 1 });
          this.notificationController("Article Published!", "success");
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
