<script setup lang="ts">
import Button from "@/components/Button.vue";
import { reactive } from "vue";
// defineProps<{
//   title: { type: string; required: true };
// }>();
const state = reactive({ username: "", password: "" });
</script>

<template>
  <form action="" method="post">
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
      <Button title="Zaloguj się" />
    </div>

    <p class="register-p">
      Nie masz konta? <span class="register-span">Zarejestruj się</span>
    </p>

    <!-- <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div> -->
  </form>
</template>

<style scoped src="@/assets/css/login.css"></style>
