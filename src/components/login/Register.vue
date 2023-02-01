<script setup lang="ts">
import Button from "@/components/Button.vue";
import { reactive, ref } from "vue";
import { useFetchStore } from "@/stores/fetch";
import { useLoggedStore } from "@/stores/LoggedIn";
import router from "@/router";


const state = reactive({
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
});
const formRegister = ref();
const rpsw = ref();

const LoggedStore = useLoggedStore();
const FetchStore = useFetchStore();

function validatePassword(){
  if(state.password !== state.repeatPassword) {
    rpsw.value.setCustomValidity("Hasło nie pasuje");
    return false;
  } else {
    rpsw.value.setCustomValidity("");
    return true;
  }
}


function register(event: any) {
  if(validatePassword()){
    if (formRegister.value.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
        FetchStore.fetchDataFromFrogAPI("/auth/register", "POST", {
        name: state.username,
        email: state.email,
        password: state.password,
      }).then(
        (value: any) => {
          console.log(value);
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
  }
 

}

</script>


<template>
  <form ref="formRegister">
    <div class="input-container">
      <p>Nazwa użytkownika</p>
      <input type="text" name="uname" required v-model="state.username" />
    </div>

    <div class="input-container">
      <p>Email</p>
      <input type="email" name="email" required v-model="state.email" />
    </div>

    <div class="input-container">
      <p>Hasło</p>
      <input type="password" name="psw" minlength="8" required v-model="state.password" />
    </div>

    <div class="input-container">
      <p>Powtórz hasło</p>
      <input
      ref="rpsw"
        type="password"
        minlength="8"
        name="rpsw"
        required
        v-model="state.repeatPassword"
      />
    </div>

    <div class="button-container">
      <Button title="Zarejestruj się"  @click="register" />
    </div>

    <p class="login-p">
      Masz już konto? <span class="login-span"><RouterLink to="/login">Zaloguj się</RouterLink></span>
    </p>

    <!-- <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div> -->
  </form>
</template>

<style scoped src="@/assets/css/register.css"></style>
