/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import {
  firebaseAction,
  firebaseMutations
} from "vuexfire";

Vue.use(Vuex);

const state = {
  applicationData: {
    posts: [],
    newPost: {
      id: "",
      dateCreated: new Date(),
      title: "Title",
      description: "Description",
      categories: [],
      content: []
    },
  },
  mainPosts: [],
  currentArticle: [],
  lastVisibleEnd: "",
  lastVisibleStart: "",
  newPost: {
    id: "",
    title: "Post Title",
    categories: [],
    description: "Post Description",
    content: []
  },
  UserProfile: {},
  applicationState: {
    online: true,
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
  pushNotification: function ({
    commit
  }, state) {
    console.log(state);
    this.state.applicationState.notificationQueue.push(state);
  },
  //
  authUpdate: function ({
    commit
  }, state) {
    commit("ChangeAuthState", state);
  },

  createNewPost: function ({
    commit,
    payload
  }, args) {
    args.db.doc().set(args.info);
    console.log(args.db);
    console.log(args);
  },

  setPostRef: firebaseAction(
    ({
      bindFirebaseRef,
      unbindFirebaseRef,
      commit
    }, ref) => {
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
    ({
      bindFirebaseRef,
      unbindFirebaseRef,
      commit
    }, ref) => {
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