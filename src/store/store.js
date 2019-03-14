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
    }
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
    articlesLoaded: false,
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
  ChangeToLoaded(context, loadedState) {
    state.applicationState.articlesLoaded = loadedState;
  },
  setLoaded(context, loadedState) {
    state.applicationState.loaded = loadedState;
  },
  ...firebaseMutations
};

const actions = {
  authUpdate: function ({
    commit
  }, state) {
    commit("ChangeAuthState", state);
  },
  loadedChange: function ({
    commit
  }, state) {
    commit("ChangeToLoaded", state);
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