<template>
  <v-app light>
    <!-- Drawer -->

    <v-navigation-drawer width="200" :permanent="!mobile" v-model="$store.state.applicationState.drawer" class=" elevation-0" light fixed clipped app>

      <div class="triangle-up elevation-10"></div>
      <v-card height="240" flat>
        <v-avatar class="center" size="100" style="z-index: 1;">
          <transition name="fade">
            <img key="profile" class="mt-5 orange" v-show="profileImageLoaded" v-on:load="profileImageUpdate" :src="$store.state.UserProfile.profileImage">
          </transition>

        </v-avatar>
      </v-card>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile :ripple="{class: 'orange--text'}" v-for="item in things" :key="item.title" @click="$router.push(item.action)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!--ToolBar -->
    <v-toolbar class="navGradient  " dark fixed flat clipped-left app>
      <v-toolbar-side-icon @click="$store.state.applicationState.drawer = !$store.state.applicationState.drawer"></v-toolbar-side-icon>
      <transition name="fade">
        <img @click="$router.push('/')" v-on:load="logoLoadedUpdate" v-show="logoLoaded" style="cursor: pointer;" width="200" src="./assets/ss.png">
      </transition>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-btn slot="activator" dark icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-if="!authenticated" @click="goToLogin">
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="!authenticated" @click="goToSignUp">
            <v-list-tile-title>Sign Up</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="authenticated" @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

    </v-toolbar>
    <!--Router-View -->
    <v-content>

      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>

    </v-content>
    <!--Footer -->
    <v-footer app></v-footer>

  </v-app>
</template>
<style >
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.triangle-up {
  position: fixed;
  width: 400px;
  background: linear-gradient(0.15turn, #f3d250, #f3d250, #fe5f55, #fe5f55);
  z-index: 1;
  transform: rotate(45deg);
  height: 400px;
  top: -265px;
  left: -50%;
}

.navGradient {
  background: linear-gradient(
    0.1turn,
    #f3d250,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55
  );
}

.drawerGradient {
  background: linear-gradient(
    0.48turn,
    #f3d250,
    #f3d250,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55,
    #fe5f55
  );
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-move {
  transition: opacity 2s;
}
</style>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import db from "./helpers/firebaseInit";
import router from "./router.js";
import FadeInImage from "./components/FadeInImage";

export default {
  name: "app",
  components: { router, FadeInImage },
  data() {
    return {
      things: [
        {
          title: "Posts",
          icon: "mdi-book-open",
          action: "/posts",
          admin: false
        },
        {
          title: "Feed",
          icon: "mdi-newspaper",
          action: "/feed",
          admin: false
        },
        {
          title: "Create Post",
          icon: "create",
          action: "/postcreator",
          admin: true
        },

        {
          title: "Saved",
          icon: "mdi-heart",
          action: "/saved",
          admin: false
        },
        {
          title: "My Profile",
          icon: "account_box",
          action: "/profile",
          admin: false
        }
      ],

      currentUser: {},
      newData: [],
      profileImageLoaded: false,
      logoLoaded: false
    };
  },

  methods: {
    logoLoadedUpdate: function() {
      this.logoLoaded = true;
    },
    profileImageUpdate: function() {
      this.profileImageLoaded = true;
    },
    goToSignUp: function() {
      this.$store.state.applicationState.login.modal = "Sign Up";
      this.$router.push("login");
    },
    goToLogin: function() {
      this.$store.state.applicationState.login.modal = "Login";
      this.$router.push("login");
    },
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ location: "/" });
        });
    }
  },
  computed: {
    mobile: function() {
      return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs
        ? true
        : false;
    },
    authenticated: function() {
      return this.$store.state.applicationState.authenticated;
    }
  },
  created() {
    if (firebase.auth().currentUser == null) {
      this.$store.dispatch("authUpdate", false);
    } else {
      this.$store.dispatch(
        "setProfileRef",
        db.collection("users").doc(firebase.auth().currentUser.uid)
      );
      this.$store.dispatch("authUpdate", true);
    }
  },

  mounted() {}
};
</script>


