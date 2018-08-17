
<template >
  <div class="containerr">
    <transition name="grow" mode="out-in">
      <v-form key="0" class='login elevation-24' v-if="$store.state.applicationState.login.modal == 'Login'">
        <v-flex class="error" style="width: 5px;">
          <h2 class="error--text" style="position: relative; left: 20px;">Login</h2>
        </v-flex>
        <v-container style="height: 100%;">
          <v-flex xs12>
            <v-text-field validate-on-blur v-model="email" :rules="[rules.required, rules.email]" label="E-mail"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field @keyup.enter="login" validate-on-blur v-model="password" :append-icon="showPass ? 'visibility_off' : 'visibility'" :rules="[rules.required, rules.min]" :type="showPass ? 'text' : 'password'" label="Password" hint="At least 8 characters" counter @click:append="showPass = !showPass"></v-text-field>
          </v-flex>
          <v-flex class="loginButton">
            <v-btn round class="error elevation-6" large :loading="LoginProgress" @click="login">Login</v-btn>
          </v-flex>
        </v-container>

      </v-form>
      <v-form key="1" class='login elevation-24' v-if="$store.state.applicationState.login.modal == 'Sign Up'">
        <v-flex class="error" style="width: 5px;">
          <h2 class="error--text" style="position: relative; left: 20px; width: 300px;">Sign Up</h2>
        </v-flex>

        <v-container style="height: 100%;">
          <v-flex xs12>
            <v-text-field validate-on-blur v-model="registerEmail" :rules="[rules.required, rules.email]" label="E-mail"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field @keyup.enter="register" validate-on-blur v-model="registerPassword" :append-icon="showPass ? 'visibility_off' : 'visibility'" :rules="[rules.required, rules.min]" :type="showPass ? 'text' : 'password'" label="Password" hint="At least 8 characters" counter @click:append="showPass = !showPass"></v-text-field>
          </v-flex>
          <v-flex class="loginButton">
            <v-btn round class="error elevation-6" large :loading="RegisterProgress" @click="register">Sign Up</v-btn>
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
        .createUserWithEmailAndPassword(
          this.registerEmail,
          this.registerPassword
        )
        .then(
          user => {
            this.$router.go("/");
          },
          err => {
            this.RegisterProgress = !this.RegisterProgress;
            console.log(err);
            this.registerEmail = "";
            this.registerPassword = "";
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
            this.loginErr = err.message;
            this.showErr = true;
            setTimeout(() => {
              this.showErr = false;
            }, 300);
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

.slideRight-leave-active,
.slideRight-enter-active {
  transition: 1s;
}
.slideRight-enter {
  -webkit-transform: translateX(300%);
  transform: translateX(300%);
  transition: transform 300ms linear;
  will-change: transform;
}
.slideRight-leave-to {
  transform: translate(300%, 0);
}

.slideLeft-leave-active,
.slideLeft-enter-active {
  transition: 1s;
}
.slideLeft-enter {
  transform: translate(-300%, 0);
}
.slideLeft-leave-to {
  transform: translate(-300%, 0);
}

.err {
  background-color: #e1645f;
  animation: wiggle 0.3s;
}

.grow-enter-active {
  animation: grow 0.8s;
}
.grow-leave-active {
  animation: grow_left 0.8s reverse;
}

.containerr {
  padding: 0px;
  overflow: hidden;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.8fr 2fr 0.8fr;
  grid-template-areas:
    "head head head head"
    "main main main main"
    "footer footer footer footer";
}

.login {
  margin: auto;
  grid-area: main;
  padding-top: 15px;
  min-width: 290px;
  max-width: 390px;
  min-height: 300px;
  overflow: hidden;
}

.loginButton {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(60%);
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
