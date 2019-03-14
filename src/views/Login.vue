
<template >
  <div>
    <transition
      name="fade"
      mode="out-in"
    >
      <v-form
        key="0"
        class='login elevation-24 white'
        v-if="$store.state.applicationState.login.modal == 'Login'"
      >
        <v-flex
          class="error"
          style="width: 5px;"
        >
          <h2
            class="error--text"
            style="position: relative; left: 20px;"
          >Login</h2>
        </v-flex>
        <v-container style="height: 100%;">
          <v-flex xs12>
            <v-text-field
              validate-on-blur
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-mail"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              @keyup.enter="login"
              validate-on-blur
              v-model="password"
              :append-icon="showPass ? 'visibility_off' : 'visibility'"
              :rules="[rules.required, rules.min]"
              :type="showPass ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="showPass = !showPass"
            ></v-text-field>
          </v-flex>
          <v-flex class="loginButton">
            <v-btn
              round
              class="elevation-6 white--text font-weight-bold"
              large
              :loading="LoginProgress"
              @click="login"
            >Login</v-btn>
            <v-btn
              round
              class=" red elevation-6 white--text font-weight-bold"
              large
              :loading="RegisterProgress"
              @click="register"
            >Register</v-btn>
          </v-flex>
        </v-container>
      </v-form>

    </transition>

  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import db from "../helpers/firebaseInit";
export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: "",
      registerEmail: "",
      registerPassword: "",
      LoginProgress: false,
      RegisterProgress: false,
      loginErr: "",
      showErr: false,
      showPass: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  methods: {
    register: function(e) {
      this.RegisterProgress = !this.RegisterProgress;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            db.collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                name: "",
                phoneNumber: "",
                saved: []
              })
              .then(result => {
                this.$store.state.applicationState.loading = false;
                this.$notify({
                  group: "main",
                  type: "success",
                  title: "Profile Created! 🎉",
                  text: ""
                });
                setTimeout(() => {
                  this.$router.push("/profile");
                  setTimeout(() => {
                    this.$router.go("/profile");
                  }, 500);
                }, 2000);
              });
          },
          err => {
            this.RegisterProgress = !this.RegisterProgress;
            console.log(err);
            this.$notify({
              group: "main",
              type: "error",
              title: "Registration Failed",
              text: err.message
            });
          }
        );
      e.preventDefault();
    },
    login: function(e) {
      this.LoginProgress = !this.LoginProgress;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$router.go("/");
          },
          err => {
            e.preventDefault();
            this.LoginProgress = !this.LoginProgress;
            this.$notify({
              group: "main",
              type: "error",
              title: "Login Failed",
              text: err.message
            });
          }
        );
      e.preventDefault();
    }
  },

  mounted: function() {
    this.$nextTick(function() {
      setTimeout(() => {
        this.$store.state.applicationState.login.modal = "Login";
      }, 500);
    });
  }
};
</script>
<style scoped>
.login {
  margin: 0 auto;
  width: 100px;
  transform: translateY(50%);
  border-radius: 20px;
  padding-top: 15px;
  min-width: 290px;
  max-width: 390px;
  min-height: 300px;
}

.loginButton {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(60%);
}

.loginButton button {
  background: linear-gradient(#f3d250, #fe5f55);
}

@keyframes grow {
  0% {
    transform: scale(0) rotate(90deg);

    border-radius: 75%;
  }
  25% {
  }
  50% {
  }
  75% {
  }
  100% {
    border-radius: 0%;
  }
}

@keyframes grow_left {
  0% {
    transform: scale(0) rotate(-90deg);

    border-radius: 75%;
  }
  25% {
  }
  50% {
  }
  75% {
  }
  100% {
    border-radius: 0%;
  }
}

@keyframes wiggle {
  0% {
    background-color: #e1645f;
    transform: translate(0px);
  }
  25% {
    background-color: #e1645f;
    transform: translate(10px);
  }
  75% {
    background-color: #e1645f;
    transform: translate(-10px);
  }
  100% {
    background-color: #e1645f;
    transform: translate(0px);
  }
}
</style>
