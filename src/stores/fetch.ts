import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export const usefetch = defineStore('fetch', () => {
  async function fetchData(path: string, method: string, body: {} = {}) {
    return new Promise( (resolve, reject) =>{
      const mainPath = 'http://dom.webitup.pl/api';

      let option: Record<string, any> =
      {
        method: method,
        // mode: 'no-cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
      }
      if(method != 'GET') option['body'] = JSON.stringify(body);

      // console.log(mainPath + path);
      // console.log(method);
      console.log(option);
  
      fetch(mainPath + path, option)
      .then(res => {
        console.log(res.ok);
        if(!res.ok) {
          console.log('reject');
          reject(res.json());
         }
        else {
          console.log('resolve');
          resolve(res.json());
       }    
      })
    });
  }











  

  return { fetchData }
})
