<script setup lang="ts">
import Button from "@/components/Button.vue";
import { reactive } from "vue";
import { useFetchStore } from "@/stores/fetch";
import { useLoggedStore } from "@/stores/LoggedIn";
import router from "@/router";

const state = reactive({ username: "", password: "" });

const LoggedStore = useLoggedStore();
const FetchStore = useFetchStore();

function login(e: any) {
  e.preventDefault();

  FetchStore.fetchDataFromFrogAPI("/auth/login", "POST", {
    email: state.username,
    password: state.password,
  }).then(
    (value: any) => {
      LoggedStore.APIKey = value.token;
      LoggedStore.username = value.user.name;
      LoggedStore.email = value.user.email;
      LoggedStore.isLoggedIn = true;

      FetchStore.getEvents();

      router.replace("/cal30");
    },
    (error) => {
      let result: any = error;
      result.then((res: any) => {
        console.log(res);
      });
    }
  );
}
</script>

<template>
  <form action="" method="">
    <div class="input-container">
      <div class="img-container">
        <img
          src="@/assets/icons/username_icon.png"
          alt="Username icon"
          class=""
        />
      </div>

      <input
        type="text"
        placeholder="Email / Nazwa użytkownika"
        name="uname"
        required
        v-model="state.username"
      />
    </div>

    <div class="input-container">
      <div class="password-icon-container">
        <img
          src="@/assets/icons/password_icon.svg"
          alt="Password icon"
          class=""
        />
      </div>

      <input
        type="password"
        placeholder="Enter Password"
        name="psw"
        required
        v-model="state.password"
      />
    </div>

    <div class="button-container">
      <Button title="Zaloguj się" @click="login" />
    </div>

    <p class="register-p">
      Nie masz konta?
      <span class="register-span"
        ><RouterLink to="/register">Zarejestruj się</RouterLink></span
      >
    </p>

    <!-- <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div> -->
  </form>
</template>

<style scoped src="@/assets/css/login.css"></style>
