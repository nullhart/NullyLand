/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import { firebaseAction, firebaseMutations } from "vuexfire";

Vue.use(Vuex);

const state = {
  applicationData: {
    posts: [],
    newPost: {
      id: "",
      dateCreated: new Date(),
      title: "",
      categories: [],
      content: []
    },

    post: {
      id: 1,
      dateCreated: new Date(),
      title: "How to Setup MagicMirror²",
      categories: [],
      content: [
        {
          type: "snippit",
          title: "Snippit Example",
          language: "bash",
          code: `sudo apt-get update && sudo apt-get upgrade`
        },
        {
          type: "snippit",
          title: "Snippit Example",
          language: "bash",
          code: `bash -c "$(curl - sL https: //raw.githubusercontent.com/MichMich/MagicMirror/master/installers/raspberry.sh)"`
        },
        {
          type: "yt",
          title: "YouTube Embedded",
          text: "random text",
          url: "https://www.youtube.com/embed/K3z8bJBup_Y"
        },
        {
          type: "list",
          title: "List Example",
          content: [
            {
              title: "test",
              description: "helo how are you",
              url: "https://google.com"
            },
            {
              title: "test",
              description: "helo how are you",
              url: "https://google.com"
            },
            {
              title: "test",
              description: "helo how are you",
              url: "https://google.com"
            }
          ]
        },

        {
          title: "Card Example",
          type: "card",
          text: "Some text before steps",
          image:
            "https://res.cloudinary.com/nullyland/image/upload/v1535551411/Screen_Shot_2018-08-29_at_8.01.50_AM_vblntt.png"
        },

        {
          title: "Card Example",
          type: "card",
          text: "type `sudo apt update && sudo apt upgrade`",
          image: "https://picsum.photos/900/500"
        }
      ]
    }
  },
  UserProfile: {},
  applicationState: {
    loaded: false,
    drawer: false,
    authenticated: false,
    loading: false,
    login: {
      modal: ""
    }
  }
};

const getters = {};

const mutations = {
  ChangeAuthState(context, authState) {
    state.applicationState.authenticated = authState;
  },
  setLoaded(context, loadedState) {
    state.applicationState.loaded = loadedState;
  },
  ...firebaseMutations
};

const actions = {
  //
  authUpdate: function({ commit }, state) {
    commit("ChangeAuthState", state);
  },

  createNewPost: function({ commit, payload }, args) {
    args.db.doc().set(args.info);
    console.log(args.db);
    console.log(args);
  },

  setPostRef: firebaseAction(
    ({ bindFirebaseRef, unbindFirebaseRef, commit }, ref) => {
      bindFirebaseRef("applicationData.Posts", ref)
        .then(() => {
          // commit('setLoaded', true)
          console.log("Posts Loaded: 🎉 ");
        })
        .catch(err => {
          console.log(err);
        });
    }
  ),
  setProfileRef: firebaseAction(
    ({ bindFirebaseRef, unbindFirebaseRef, commit }, ref) => {
      bindFirebaseRef("UserProfile", ref)
        .then(() => {
          console.log("User Loaded: 🎉 ");
          commit("setLoaded", true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  )
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
