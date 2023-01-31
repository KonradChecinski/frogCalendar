<script setup lang="ts">
import { routerKey, RouterLink, RouterView, useRouter } from "vue-router";
import { useLoggedStore } from "./stores/LoggedIn";
import drawerMenu from "@/components/drawerMenu.vue";

import router from "./router";
import Modal from "./components/Modal/modal.vue";

const LoggedStore = useLoggedStore();

if (isLocalStorageAvailable()) {
  if (localStorage.getItem("APIKey") !== null) {
    LoggedStore.APIKey = localStorage.getItem("APIKey");
    LoggedStore.email = localStorage.getItem("email");
    LoggedStore.username = localStorage.getItem("username");
    LoggedStore.isLoggedIn = true;
  }
}

router.beforeEach((to, from, next) => {
  if (
    LoggedStore.isLoggedIn &&
    to.matched.some((record) => record.path == "/login")
  ) {
    next("/");
  } else {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!LoggedStore.isLoggedIn) {
        next({ name: "Login" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

function isLocalStorageAvailable() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
</script>

<template>
  <RouterView />
  <drawerMenu v-if="!LoggedStore.isLoggedIn" />
  <Modal />
</template>

<style scoped></style>
