
<template >
  <v-container>
    <v-flex class="elevation-3 white mt-5 xs10 sm6 md4  pa-2" style="margin: auto;" v-on:keypress.enter="update($store.state.UserProfile.id, $store.state.UserProfile)">
      <v-form v-show="$store.state.applicationState.loaded">
        <v-flex class="text-xs-center">
          <v-avatar size="150" class="ma-4" color="blue lighten-4">
            <img v-show="this.$store.state.UserProfile.profileImage != null || file_changed ==true" :size=23 :src="this.$store.state.UserProfile.profileImage" @click="onChange($event)">
            <input @input="onChange($event)" placeholder="tst" type="file" name="file" accept="image/*" style="border-radius: 100%;opacity: 0; z-index: 2; width: 150px; height: 150px; position: absolute; left: 0px; top: 0px; cursor: pointer;">
            <div v-show="this.$store.state.UserProfile.profileImage == null">
              <v-icon>mdi-account</v-icon>
            </div>
          </v-avatar>
        </v-flex>

        <v-divider></v-divider>
        <v-text-field v-model="$store.state.UserProfile.name" :counter="20" label="Name"></v-text-field>
        <v-text-field v-show="$store.state.applicationState.loaded" v-model="formattedPhone" label="Phone Number"></v-text-field>

        <v-flex class="text-xs-center">
          <v-btn round :loading="$store.state.applicationState.loading == true" :disabled="!$store.state.applicationState.online" large @click="update($store.state.UserProfile.id, $store.state.UserProfile)" color="orange" :dark="$store.state.applicationState.online">
            <v-icon>save</v-icon>
          </v-btn>
        </v-flex>

      </v-form>

    </v-flex>
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
          this.$notify({
            group: "main",
            type: "success",
            title: "Profile Updated! 🎉",
            text: ""
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


