<template>
  <v-app id="main" light>
    <!-- Drawer -->
    <!-- <div style="position: absolute; top: 70px; right: 10px; width: 300px; z-index: 1;">
      <transition name="fade">
        <v-alert v-show="mounted" :timeout="300" class="elevation-6" key="2" :value="true" type="success">
          This is a success alert.
        </v-alert>
      </transition>

    </div> -->
    <v-navigation-drawer class="hide-overflow" width="200" :permanent="!mobile" v-model="$store.state.applicationState.drawer" light fixed clipped app>
      <div class="triangle-up elevation-10"></div>
      <v-card height="240" flat>
        <v-avatar class="center" size="100" style="z-index: 1;">
          <transition name="fade">
            <img key="profile" class="mt-5 orange" v-show="profileImageLoaded" v-on:load="profileImageUpdate" :src="$store.state.UserProfile.profileImage">
          </transition>

        </v-avatar>
      </v-card>
      <v-divider style="position: relative; top: -400px;"></v-divider>
      <v-list style="position: relative; top: -400px;">
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
    <v-toolbar class="navGradient elevation-0" dark fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="$store.state.applicationState.drawer = !$store.state.applicationState.drawer"></v-toolbar-side-icon>
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

      <vue-particles class="particles" key="part" color="#fe5f55" :particleOpacity="0.7" linesColor="#FFAB91" :particlesNumber="30" shapeType="circle" :particleSize="5" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
      </vue-particles>
      <!-- <transition name="fade" mode="out-in"> -->
      <router-view style="position: relative; top: 0px;" key="router"></router-view>

      <!-- </transition> -->
      <div v-if="this.$route.name == 'posts' " style="display: flex; justify-content: center;">

        <v-btn icon fab class=" white--text more-Button" @click="moreArticles">
          <v-icon>mdi-arrow-down-bold</v-icon>
        </v-btn>
      </div>
    </v-content>
    <!--Footer -->

    <v-footer app class="text-xs-center">
      <p class="ma-2 ">Created with ❤️ by Blake Mastrud</p>
      <a style="text-decoration: none;" href="https://github.com/nullhart" target="_blank">
        <v-icon>mdi-github-box</v-icon>
      </a>

    </v-footer>

  </v-app>
</template>
<style >
.particles {
  position: fixed;
  width: 100%;
  height: 100%;
}

.noClick {
  pointer-events: none;
}
.AllowClick {
  pointer-events: all;
}
.center {
  margin-left: auto;
  margin-right: auto;
  left: 25%;
  top: -380px;
}
.hide-overflow {
  overflow: hidden;
}
.more-Button {
  background: linear-gradient(0.15turn, #f3d250, #fe5f55);
}

.triangle-up {
  position: relative;
  width: 400px;
  background: linear-gradient(0.15turn, #f3d250, #f3d250, #fe5f55, #fe5f55);
  z-index: 1;
  transform: rotate(45deg);
  height: 400px;
  /*Safari Fix */
  pointer-events: none;
  top: -265px;
  left: -50%;
}

.navGradient {
  -webkit-app-region: drag;
  background: linear-gradient(0.1turn, #f3d250 0px, #fe5f55 110px);
}
.navGradient button {
  -webkit-app-region: no-drag;
}
.generalGradient {
  background: radial-gradient(
    farthest-corner at 40px 1px,
    #f3d250 0%,
    #fe5f55 100%
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
</style>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import db from "./helpers/firebaseInit";
import router from "./router.js";



export default {
  name: "app",
  components: { router },
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
      page: 1,
      newData: [],
      profileImageLoaded: false,
      logoLoaded: false,
      mounted: false,
      references: this.$store.state.lastVisibleEnd
    };
  },

  methods: {
    moreArticles: function() {
      if (this.$store.state.lastVisibleEnd == undefined) {
        console.log("no more articles");
        return;
      }
      db.collection("articles")
        .orderBy("dateCreated")
        .startAfter(this.$store.state.lastVisibleEnd)
        .limit(6)
        .get()
        .then(nextPosts => {
          this.$store.state.lastVisibleEnd = nextPosts.docs[5];

          var nextArticles = [];
          nextPosts.forEach(docs => {
            this.$store.state.mainPosts.push(docs.data());
          });
        })
        .catch(err => {
          console.log("err");
        });
    },
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
      return this.$vuetify.breakpoint.width < 1260;
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

  mounted() {
    this.$vuetify.breakpoint.sm = 1215;
    this.mounted = true;
    db.collection("articles")
      .orderBy("dateCreated")
      .limit(6)
      .get()
      .then(documentSnapshots => {
        // Get the last visible document
        this.$store.state.lastVisibleEnd = documentSnapshots.docs[6 - 1];

        var articles = [];
        documentSnapshots.forEach(doc => articles.push(doc.data()));
        console.log(articles);
        this.$store.state.mainPosts = articles;
      });
  }
};
</script>


