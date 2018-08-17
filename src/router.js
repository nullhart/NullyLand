import firebase from 'firebase/app';
import 'firebase/auth';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

let router = new Router({
  mode: "history",
  routes: [{
      path: "/posts",
      name: "posts",
      alias: '/',
      component: () =>
        import ( /* webpackChunkName: "home" */ './views/Posts.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import ( /* webpackChunkName: "Login" */ './views/Login.vue'),
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/post',
      name: 'post',
      component: () =>
        import ( /* webpackChunkName: "Post" */ './views/Post.vue'),

    },
    {
      path: '/profile',
      name: 'profile',
      component: () =>
        import ( /* webpackChunkName: "Profile" */ './views/Profile.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/postcreator',
      name: 'postcreator',
      component: () =>
        import ( /* webpackChunkName: "PostCreator" */ './views/PostCreator.vue'),
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;