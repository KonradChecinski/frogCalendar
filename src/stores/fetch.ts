import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { useLoggedStore } from "./LoggedIn";
import { useOptionsStore } from "./Options";

export const useFetchStore = defineStore("fetch", () => {
  const LoggedStore = useLoggedStore();
  const OptionStore = useOptionsStore();

  const Weather = ref([]);
  const Events = ref([]);
  const SpecialEvents = ref([{ id: "0", name: "a" }]);
  SpecialEvents.value.length = 0;

  onMounted(getForecast());
  onMounted(getSwietaNietypowe());
  onMounted(getEvents());

  function getEvents(): any {
    setTimeout(() => {
      fetchDataFromFrogAPI("/event/user/all", "GET").then((res: any) => {
        Events.value = res.result;
        OptionStore.EventsUpdate.count++;
      });
    }, 1000);
  }
  function getEventsWithoutHesitate(): any {
    return new Promise((resolve) => {
      fetchDataFromFrogAPI("/event/user/all", "GET").then((res: any) => {
        Events.value = res.result;
        OptionStore.EventsUpdate.count++;
        resolve(true);
      });
    });
  }
  function getForecast(): any {
    fetchDataFromForecastAPI().then((res: any) => {
      Weather.value = res.forecast.forecastday;
    });
  }
  function getSwietaNietypowe(): any {
    fetchDataFromSwietaNietypoweAPI().then((res: any) => {
      res.forEach((element: any) => {
        if (element != null) {
          let name: string = element.name;
          let index =
            "" +
            ("0" + element.day).slice(-2) +
            ("0" + element.month).slice(-2);
          let object = { id: index, name: name };
          SpecialEvents.value.push(object);
        }
      });
      // SpecialEvents.value = res;
      // console.log(res);
    });
  }

  async function fetchDataFromForecastAPI() {
    return new Promise((resolve, reject) => {
      const mainPath = "http://api.weatherapi.com/v1/forecast.json";

      let option: Record<string, any> = {
        key: "808049fb20754a5cade114641230506",
        q: "Gliwice",
        days: 14,
      };
      fetch(mainPath + "?" + new URLSearchParams(option)).then((res) => {
        if (!res.ok) {
          console.log(`Error: ${res.status}`);
          reject(res.json());
        } else {
          resolve(res.json());
        }
      });
    });
  }
  async function fetchDataFromSwietaNietypoweAPI() {
    return new Promise((resolve, reject) => {
      const mainPath =
        "https://pniedzwiedzinski.github.io/kalendarz-swiat-nietypowych/all.json";
      fetch(mainPath).then((res) => {
        if (!res.ok) {
          console.log(`Error: ${res.status}`);
          reject(res.json());
        } else {
          resolve(res.json());
        }
      });
    });
  }

  async function fetchDataFromFrogAPI(
    path: string,
    method: string,
    body: {} = {}
  ) {
    return new Promise((resolve, reject) => {
      const mainPath = "http://back.webitup.pl/api";

      let option: Record<string, any> = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + LoggedStore.APIKey,
        },
      };
      if (method != "GET") option["body"] = JSON.stringify(body);

      fetch(mainPath + path, option).then((res) => {
        if (!res.ok) {
          console.log(`Error: ${res.status}`);
          reject(res.json());
        } else {
          resolve(res.json());
        }
      });
    });
  }

  async function fetchDataImportFile(path: string, body: {} = {}) {
    return new Promise((resolve, reject) => {
      const mainPath = "http://back.webitup.pl/api";

      let option: Record<string, any> = {
        method: "POST",
        // mode: "no-cors",
        headers: {
          // "Content-Type": undefined,
          Accept: "application/json",
          Authorization: "Bearer " + LoggedStore.APIKey,
        },
        body: body,
      };

      fetch(mainPath + path, option).then((res) => {
        if (!res.ok) {
          console.log(`Error: ${res.status}`);
          reject(res.json());
        } else {
          resolve(res.json());
        }
      });
    });
  }

  return {
    fetchDataImportFile,
    fetchDataFromFrogAPI,
    getEvents,
    getEventsWithoutHesitate,
    Weather,
    Events,
    SpecialEvents,
  };
});
