import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export const usefetch = defineStore('counter', () => {
  let headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  function fetchData(path: string) {
    const mainPath = 'http://dom.webitup.pl/api';
    axios
    // (
    //   mainPath + path, 
    //   {
    //     method: 'GET',
    //     mode: 'no-cors',
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json',
    //     },
    //     withCredentials: true,
    //     credentials: 'same-origin',
    //   })
    // .then((response: { data: any }) => {
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     if (error.response) {
    //       console.log(error.response.data);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     }
    //   });
    
      .get(mainPath + path, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials':true,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      }})
      .then((response: { data: any }) => {
        console.log(response);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  return { fetchData }
})
