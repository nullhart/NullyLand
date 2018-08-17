/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import {
  firebaseAction,
  firebaseMutations
} from 'vuexfire';

Vue.use(Vuex)

const state = {
  applicationData: {
    posts: [],
    post: {
      id: 1,
      dateCreated: new Date(),
      title: "Raspberry Pi Router!",
      content: [{
          title: "Step 1: Update Raspian",
          text: "Some text before steps",
          image: "https://picsum.photos/900/500",
          steps: [{
              type: "fiddle",
              title: "Step 3: Delete Raspian",
              url: "//jsfiddle.net/nullhart/u9dbtk67/3/embedded/"
            },
            {
              type: "card",
              image: "https://picsum.photos/900/500/",
              title: "Step 3: Delete Raspian",
              url: "https://jsfiddle.net/nullhart/db6n4v8x/3/embedded/js/dark/"
            },
          ]

        },
        {
          title: "Step 2: Upgrade Raspian",
          text: "type `sudo apt update && sudo apt upgrade`",
          image: "https://picsum.photos/900/500",
          steps: [{
            type: "fiddle",
            title: "Step 3: Delete Raspian",
            url: "https://jsfiddle.net/nullhart/db6n4v8x/3/embedded/js/dark/"
          }]


        }
      ],
      links: [{
        title: "A named Link",
        url: "https://google.com"
      }],


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
    },

  }
}

const getters = {

}

const mutations = {
  ChangeAuthState(context, authState) {
    state.applicationState.authenticated = authState
  },
  setLoaded(context, loadedState) {
    state.applicationState.loaded = loadedState
  },
  ...firebaseMutations

}

const actions = {

  authUpdate: function ({
    commit
  }, state) {
    commit('ChangeAuthState', state)
  },

  createNewPost: function ({
    commit,
    payload
  }, args) {

    args.db.doc().set(args.info)
    console.log(args.db)
    console.log(args)
  },

  setPostRef: firebaseAction(({
      bindFirebaseRef,
      unbindFirebaseRef,
      commit
    },
    ref
  ) => {

    bindFirebaseRef('applicationData.Posts', ref).then(() => {
      // commit('setLoaded', true)
      console.log('Posts Loaded: 🎉 ')
    }).catch((err) => {
      console.log(err)
    })
  }),
  setProfileRef: firebaseAction(({
      bindFirebaseRef,
      unbindFirebaseRef,
      commit
    },
    ref
  ) => {
    bindFirebaseRef('UserProfile', ref).then(() => {
      console.log('User Loaded: 🎉 ')
      commit('setLoaded', true)
    }).catch((err) => {
      console.log(err)
    })
  }),



}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})