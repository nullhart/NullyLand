
<template >
  <v-container>
    <div v-on:keypress.enter="update($store.state.UserProfile.id, $store.state.UserProfile)">
      <v-snackbar color="green" v-model="notification" multi-line :timeout="2000">
        Profile Updated! 🎉
        <v-btn color="black" flat @click="notification = false" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>

      <v-form v-show="$store.state.applicationState.loaded == true">
        <v-avatar color="blue lighten-4">

          <img v-show="this.$store.state.UserProfile.profileImage != null || file_changed ==true" :size=23 :src="this.$store.state.UserProfile.profileImage" @click="onChange($event)">
          <input @input="onChange($event)" placeholder="tst" type="file" name="file" accept="image/*" style="opacity: 0; z-index: 2; width: 60px; height: 60px; position: absolute; left: 0px; top: 0px; cursor: pointer;">
          <div v-show="this.$store.state.UserProfile.profileImage == null">
            <v-icon>mdi-account</v-icon>
            <input @input="onChange($event)" placeholder="tst" type="file" name="file" accept="image/*" style="opacity: 0; z-index: 2; width: 60px; height: 60px; position: absolute; left: 0px; top: 0px; cursor: pointer;">
          </div>
        </v-avatar>
        <br>
        <br>
        <v-divider></v-divider>
        <v-text-field v-model="$store.state.UserProfile.name" :counter="20" label="Name"></v-text-field>
        <v-text-field v-model="$store.state.UserProfile.phoneNumber" :counter="10" label="Phone Number"></v-text-field>
        <v-flex>
          <v-btn round :loading="$store.state.applicationState.loading == true" large @click="update($store.state.UserProfile.id, $store.state.UserProfile)" color="orange" dark>
            <v-icon>save</v-icon>
          </v-btn>
        </v-flex>

      </v-form>

    </div>
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
      avatar: ""
    };
  },

  methods: {
    log: function(e) {
      console.log(e);
    },
    update: function(id, data) {
      this.$store.state.applicationState.loading = true;

      userRef
        .doc(id)
        .update(data)
        .then(result => {
          this.$store.state.applicationState.loading = false;
          this.notification = true;
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
    if (this.$store.state.UserProfile.profileImage == null) {
      this.avatar = this.blankAvatar;
    } else {
      this.avatar = this.$store.state.UserProfile.profileImage;
    }
  }
};
</script>
<style scoped>
.center-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>


