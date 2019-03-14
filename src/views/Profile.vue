
<template >
  <v-container style="z-index: 0;">
    <transition name="slide-x-transition">
      <v-flex
        v-show="$store.state.applicationState.loaded && mounted"
        class="elevation-3 white mt-5 xs10 sm6 md4 pa-2"
        style="margin: auto;"
        v-on:keypress.enter="update($store.state.UserProfile.id, $store.state.UserProfile, $event)"
      >
        <v-form>
          <v-flex class="text-xs-center">
            <v-avatar size="150" class="ma-4" color="blue lighten-4">
              <img
                alt="Profile Image"
                v-show="this.$store.state.UserProfile.profileImage != null || file_changed ==true"
                :size="23"
                :src="this.$store.state.UserProfile.profileImage"
                @click="onChange($event)"
              >
              <input
                @input="onChange($event)"
                placeholder="tst"
                type="file"
                name="file"
                accept="image/*"
                style="border-radius: 100%;opacity: 0; z-index: 2; width: 150px; height: 150px; position: absolute; left: 0px; top: 0px; cursor: pointer;"
              >
              <div v-show="this.$store.state.UserProfile.profileImage == null">
                <v-icon>mdi-account</v-icon>
              </div>
            </v-avatar>
          </v-flex>

          <v-divider></v-divider>
          <v-text-field v-model="$store.state.UserProfile.name" :counter="20" label="Name"></v-text-field>
          <v-text-field
            v-show="$store.state.applicationState.loaded"
            v-model="formattedPhone"
            label="Phone Number"
          ></v-text-field>

          <v-flex class="text-xs-center">
            <v-btn
              round
              :loading="$store.state.applicationState.loading == true"
              :disabled="!$store.state.applicationState.online"
              large
              @click="update($store.state.UserProfile.id, $store.state.UserProfile, $event)"
              color="orange"
              :dark="$store.state.applicationState.online"
            >
              <v-icon>save</v-icon>
            </v-btn>
          </v-flex>
        </v-form>
      </v-flex>
    </transition>
  </v-container>
</template>
  

<script>
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import db from "../helpers/firebaseInit";
const userRef = db.collection("users");

export default {
  name: "profile",
  data: function() {
    return {
      ProfileUpdateResult: "",
      notification: "",
      file_changed: false,
      avatar: "",
      mounted: false
    };
  },
  computed: {
    formattedPhone: function() {
      if (this.$store.state.UserProfile.phoneNumber == undefined) {
        return;
      }
      return this.$store.state.UserProfile.phoneNumber
        .replace(/[^0-9]/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
  },
  methods: {
    update: function(id, data, event) {
      this.$store.state.applicationState.loading = true;
      userRef
        .doc(id)
        .update(data)
        .then(result => {
          this.$store.state.applicationState.loading = false;
          //TO-Do - Confetti needs standard config
          confetti(event.target, {
            angle: 90,
            spread: 50,
            startVelocity: 39,
            elementCount: 25,
            decay: 0.85
          });
        })
        .catch(err => {
          this.$notify({
            group: "main",
            type: "success",
            title: "Profile Update Failed! 😢",
            text: err
          });
          console.log(err);
        });
    },
    //This needs to be abstracted to a helper function to clean up component
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
    // Abstract with Async_Upload function
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
        this.$store.state.UserProfile.profileImage = data;
        this.file_changed = true;
      });
    }
  },
  created() {
    userRef
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          return;
        } else {
          userRef.doc(firebase.auth().currentUser.uid).set({}); // create the document
        }
      });
  },

  mounted() {
    var confetti = require("../helpers/confetti.js");
    this.mounted = true;
    if (this.$store.state.UserProfile.profileImage == null) {
      this.avatar = this.blankAvatar;
    } else {
      this.avatar = this.$store.state.UserProfile.profileImage;
    }
  }
};
</script>
<style scoped>
.v-btn-disabled {
  color: grey !important;
  background-color: red;
}

.center-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>


