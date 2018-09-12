<template>

  <div class="noClick">
    <v-snackbar v-model="notificationStatus" :close="false" :color="notificationType == 'success' ? 'green' : 'red' " :right="true" :timeout="0" :top="true">
      {{ notification }}
      <v-btn color="pink" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-tooltip left class="AllowClick">
      <v-btn slot="activator" @click="dialog = !dialog" class="text-xs-center mb-4" fixed right bottom fab dark large color="orange lighten-1">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
      <span>Add Element</span>
    </v-tooltip>

    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card class="AllowClick">
          <v-card-title>
            <span class="headline black--text">Add/Edit Post Element</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
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
                <v-flex xs12>
                  <v-text-field solo v-model="newItemCode" label="Element Code"></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <label for="image">Element Image</label>
                  <v-divider class="mb-1 mt-2"></v-divider>

                  <v-responsive class="elevation-3">
                    <transition name="fade">
                      <v-img :src="newItemImage" v-model="newItemImage"> <input style="width: 435px; height: 250px; highlight: none; opacity: 0;" @change="onChange($event)" type="file" accept="image/*" id="image"></v-img>
                    </transition>
                  </v-responsive>
                  {{postInfo}}

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
    <v-toolbar class="AllowClick">
      <v-btn color="green darken-1 white--text" @click.native="publishArticle">Publish Article</v-btn>
    </v-toolbar>
    <v-container>
      <v-btn class="red AllowClick" @click="notificationController('Success', 'success')"></v-btn>
      <v-btn class="red AllowClick" @click="notificationController('test error','error')"></v-btn>

      <div class="text-xs-center  font-weight-bold display-2">{{$store.state.applicationData.post.title}}</div>
      <v-divider class="ma-2"></v-divider>
      <div v-for="(things, i) in $store.state.applicationData.post.content" :key="i" style="perspective: 600px;">
        <transition name="stagger">
          <dynamic-sub-step style="margin: auto;" :data="things" class="AllowClick" :style="'animation-delay: ' + 300 * i + 'ms !important; will-change: auto; '" v-show="test " />
        </transition>
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

const articlesRef = db.collection("articles");

export default {
  name: "PostCreator",
  components: { DynamicSubStep },
  data() {
    return {
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
      newItemUrl: "",
      newItemImage: `https://via.placeholder.com/350x200`,
      newItemCode: ``,

      newPost: [],
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
    console.log(this.$store.creator);
  },
  computed: {
    postInfo: function() {
      return this.newPost;
    }
  },
  methods: {
    wait: function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    addNewItem: function() {
      let newElement = {
        type: this.newItemType.value,
        title: this.newItemTitle,
        text: this.newItemDescription,
        image: this.newItemImage
      };
      this.newPost.push(newElement);
      console.log();
    },
    notificationController: async function(notificationMessage, type) {
      console.log(notificationMessage);
      if (this.notification != "") {
        await this.wait(2000);
        this.notificationController(notificationMessage);
      } else {
        this.notificationType = type;
        this.notification = notificationMessage;
        this.notificationStatus = true;
        await this.wait(3000);
        this.notificationStatus = false;
        this.notification = "";
      }
    },

    publishArticle: function() {
      let articleObj = {
        title: this.articleTitle,
        description: this.articleDescription,
        dateCreated: new Date(),
        content: JSON.parse(JSON.stringify(this.newPost))
      };
      console.log(articleObj);
      articlesRef
        .add(articleObj)
        .then(result => {
          console.log("Post Published");
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
      const size = file.size && file.size / Math.pow(1000, 2);
      // check file max size
      if (size > this.maxSize) {
        console.log("size-exceeded", size);
        return;
      }
      this.Async_Upload(file).then(data => {
        console.log(typeof data);
        this.newItemImage = data;
      });
    }
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
