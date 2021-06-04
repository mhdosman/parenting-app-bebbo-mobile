
import {apiUrlDevelop} from "@env"
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    console.log("in finalurl");
    
    return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
}

export const appConfig = {
    articles: 'articles',
    dailyMessages: 'daily-homescreen-messages',
    basicPages: 'basic-pages'
}