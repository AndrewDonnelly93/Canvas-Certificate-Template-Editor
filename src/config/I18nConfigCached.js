/* eslint-disable */
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import HttpApi from "i18next-http-backend";
import rootStore from "@src/store/Store.js";

const api_address = import.meta.env.VITE_API_URL;
const api_version = import.meta.env.VITE_API_VERSION;

export default class I18nConfigCached {

  constructor () {
    const token = rootStore.user.getToken()
    const savedLang = JSON.parse(window.localStorage.getItem('userOptionsStorage'))
    const lang = savedLang?.lang|| rootStore.portal.getDefaultLang();

    i18n
      .use(initReactI18next)
      .use(ChainedBackend)
      .init({
        fallbackLng: lang,
        lng: lang,
        ns:'L2Default',
        defaultNS: "L2Default",
        fallbackNS: "L2Default",
        saveMissing: false,
        missingKeyHandler: (a,b,c,d,e,f)=>{console.log('missingKey',a,b,c,d,e,f)},

        backend:{
          backends: [
            LocalStorageBackend,  // primary backend
            HttpApi               // fallback backend
          ],
          backendOptions: [{
            /* options for primary backend */
            // prefix for stored languages
            prefix: 'mui_cashe_',
            // language versions
            versions: {en: 'v1.1',ar: 'v1.1', es:'v1.1'},
            // expiration in milliseconds
            expirationTime: 30*60*1000,
          }, {
            /* options for secondary backend */
            loadPath:api_address + "/" + api_version + "/mui?lang={{lng}}&code=all&groups%5B%5D={{ns}}&token=" + token,
            // addPath: (a)=>{console.log([...arguments])},
            allowMultiLoading: true,
            parse: function (data){
              data = JSON.parse(data)
              let translateObj ={};
              data.response.forEach((el)=>{
                if(!translateObj.hasOwnProperty(el.key)){
                  translateObj[el.key] = el.value
                }
              })
              return data = translateObj
            }
          }]

        },
        interpolation: {
          escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
        react: {
          useSuspense: true
        }
      });
  }
}
