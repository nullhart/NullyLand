<template>
  <v-app id="main" light>
    <notifications style="margin-top: 70px;" group="main" classes="notification" />
    <v-navigation-drawer
      class="hide-overflow"
      width="200"
      :permanent="!mobile"
      v-model="$store.state.applicationState.drawer"
      light
      fixed
      clipped
      app
    >
      <div class="triangle-up elevation-10"></div>
      <v-card height="240" flat>
        <v-avatar class="center" size="100" style="z-index: 1;">
          <transition name="fade1">
            <img
              alt="Profile Image"
              class="mt-5"
              v-show="profileImageLoaded"
              v-on:load="profileImageUpdate"
              :src="$store.state.UserProfile.profileImage"
            />
          </transition>
        </v-avatar>
      </v-card>
      <v-divider style="position: relative; top: -400px;"></v-divider>
      <v-list style="position: relative; top: -400px;">
        <v-list-tile :ripple="{class: 'orange--text'}" @click="mainArticles">
          <v-list-tile-action>
            <v-icon>mdi-book-open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Articles</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-show="this.$store.state.UserProfile.admin"
          :ripple="{class: 'orange--text'}"
          @click="$router.push('/postcreator')"
        >
          <v-list-tile-action>
            <v-icon>create</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Create Post</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-show=" Object.keys(this.$store.state.UserProfile).length !== 0"
          :ripple="{class: 'orange--text'}"
          @click="favedArticles"
        >
          <v-list-tile-action>
            <v-icon>mdi-heart</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Saved</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :ripple="{class: 'orange--text'}" @click="$router.push('profile')">
          <v-list-tile-action>
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>My Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!--ToolBar -->
    <v-toolbar class="navGradient elevation-0" dark fixed clipped-left app>
      <v-toolbar-side-icon
        @click.stop="$store.state.applicationState.drawer = !$store.state.applicationState.drawer"
      ></v-toolbar-side-icon>
      <transition name="fade">
        <img
          alt="logo"
          @click="mainArticles"
          v-on:load="logoLoadedUpdate"
          v-show="logoLoaded"
          style="cursor: pointer;"
          width="200"
          src="./assets/ss.png"
        />
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
      <vue-particles
        v-if="$store.state.applicationState.articlesLoaded && mounted"
        class="particles"
        key="part"
        color="#fe5f55"
        :particleOpacity="0.7"
        linesColor="#FFAB91"
        :particlesNumber="30"
        shapeType="circle"
        :particleSize="5"
        :linesWidth="2"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      ></vue-particles>
      <transition name="slide-x-transition" mode="out-in">
        <router-view style="position: relative; top: 0px;" key="router"></router-view>
      </transition>
      <div v-if="this.$route.name == 'posts' " style="display: flex; justify-content: center;">
        <v-btn
          v-show="this.$store.state.lastVisibleEnd"
          icon
          fab
          class="white--text more-Button"
          @click="moreArticles"
        >
          <v-icon>mdi-arrow-down-bold</v-icon>
        </v-btn>
      </div>
    </v-content>
    <!--Footer -->
    <transition name="rollUp">
      <v-footer
        key="footer"
        v-show="!$store.state.applicationState.online"
        :app="!$store.state.applicationState.online"
        :class="{red: !$store.state.applicationState.online, white: $store.state.applicationState.online}"
      >
        <v-container fluid class="ma-2 pa-0 text-xs-center">
          <span v-show="$store.state.applicationState.online">
            <v-icon>mdi-network</v-icon>
          </span>
          <div class="white--text" v-show="!$store.state.applicationState.online">
            <v-icon white class="ma-0 pa-0 white--text">mdi-close-network</v-icon>
          </div>
        </v-container>
      </v-footer>
    </transition>
  </v-app>
</template>
<style lang="scss">
.rollUp-enter-active,
.rollUp-leave-active {
  transform: translateY(40px);
  transition: 0.5s;
}
.rollUp-enter, .rollUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transition: 0.5s;
}

.fade1-enter-active,
.fade1-leave-active {
  transition: opacity 0.5s;
}
.fade1-move {
  transition: 1.5s;
}
.fade1-enter, .fade1-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.notification {
  padding: 10px;
  margin: 0 5px 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  font-size: 12px bold;

  color: #ffffff;
  background: #44a4fc;
  border-left: 5px solid #187fe7;

  &.warn {
    background: #f3d250;
    border-left-color: #f3d250;
  }

  &.error {
    background: #fe5f55;
    border-left-color: #fe5f55;
  }

  &.success {
    background: #68cd86;
    border-left-color: #42a85f;
  }
}

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
      fab: false,
      currentUser: {},
      page: 1,
      newData: [],
      profileImageLoaded: false,
      loaded: false,
      logoLoaded: false,
      mounted: false,
      references: this.$store.state.lastVisibleEnd
    };
  },

  methods: {
    mainArticles: function() {
      this.$router.push("/");
      db.collection("articles")
        .orderBy("dateCreated")
        .limit(6)
        .get()
        .then(documentSnapshots => {
          // Get the last visible document
          this.$store.state.lastVisibleEnd = documentSnapshots.docs[6 - 1];

          var articles = [];
          documentSnapshots.forEach(doc => articles.push(doc.data()));

          this.$store.state.mainPosts = articles;
        });
    },
    favedArticles: function() {
      this.$router.push("/");
      this.$store.state.mainPosts = [];
      this.$store.state.UserProfile.saved.forEach(element => {
        db.collection("articles")
          .where("id", "==", element.id)
          .get()
          .then(data => {
            data.forEach(things => {
              this.$store.state.mainPosts.push(things.data());
            });
          });
      });
    },
    notifyTest: function() {
      this.$notify({
        group: "main",
        type: "warn",
        title: "Test",
        text: ""
      });
    },
    moreArticles: function() {
      if (this.$store.state.lastVisibleEnd == undefined) {
        console.log("no more articles");
        this.$notify({
          group: "main",
          type: "warn",
          title: "No More Articles",
          text: ""
        });
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
          this.$router.go({ location: "/" });
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
    this.mounted = true;
    db.collection("articles")
      .orderBy("dateCreated", "desc")
      .limit(6)
      .get()
      .then(documentSnapshots => {
        // Get the last visible document
        this.$store.state.lastVisibleEnd = documentSnapshots.docs[6 - 1];

        var articles = [];
        documentSnapshots.forEach(doc => {
          console.log(doc.data());
          articles.push(doc.data());
        });

        console.log(articles);
        this.$store.state.mainPosts = articles;
        this.$store.dispatch("loadedChange", true);
      });
    this.$vuetify.breakpoint.sm = 1215;
    this.mounted = true;

    window.addEventListener("online", () => {
      console.log("Now Online");
      this.$store.state.applicationState.online = true;
    });
    window.addEventListener("offline", () => {
      console.log("Now Offline");
      this.$store.state.applicationState.online = false;
    });
  }
};
</script>


