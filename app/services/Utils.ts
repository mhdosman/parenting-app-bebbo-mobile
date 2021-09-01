import { DateTime, Settings } from "luxon";
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema, } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../database/schema/ChildDevelopmentSchema";
import { ChildGrowthEntity, ChildGrowthSchema } from "../database/schema/ChildGrowthSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from "../database/schema/HealthCheckUpsSchema";
import { MilestonesEntity, MilestonesSchema } from "../database/schema/MilestonesSchema";
import { SurveysEntity, SurveysSchema } from "../database/schema/SurveysSchema";
import { TaxonomyEntity, TaxonomySchema } from "../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../database/schema/VideoArticleSchema";
import { appConfig, isArticlePinned } from "../assets/translations/appOfflineData/apiConstants";
import { receiveAPIFailure } from "../redux/sagaMiddleware/sagaSlice";
import { StandardDevWeightForHeightSchema } from "../database/schema/StandardDevWeightForHeightSchema";
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from "../database/schema/PinnedChildDevelopmentSchema";
import { ChildEntity } from "../database/schema/ChildDataSchema";
import { CHILDREN_PATH } from "@types/types";
import RNFS from 'react-native-fs';
import { measure } from "react-native-reanimated";
const IntlPolyfill = require('intl');
export const addApiDataInRealm = async (response: any) => {
    return new Promise(async (resolve, reject) => {
        // console.log(new Date()," response in utils-",response);
            let EntitySchema=<ObjectSchema>{};
        let Entity:any;
        let insertData = [];
        let pinnedArticle = "";
            if(response.payload.apiEndpoint == appConfig.articles)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ArticleEntity;
                EntitySchema = ArticleEntitySchema;
                pinnedArticle = "";
            }
            else if(response.payload.apiEndpoint == appConfig.vaccinePinnedContent || 
                response.payload.apiEndpoint == appConfig.childGrowthPinnedContent || 
                response.payload.apiEndpoint == appConfig.healthcheckupPinnedContent ||
                response.payload.apiEndpoint == appConfig.milestoneRelatedArticle)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ArticleEntity;
                EntitySchema = ArticleEntitySchema;
                pinnedArticle = isArticlePinned;
            }
            else if(response.payload.apiEndpoint == appConfig.childdevGirlPinnedContent || 
                response.payload.apiEndpoint == appConfig.childdevBoyPinnedContent)
            {
                insertData = response.payload.data.data;
                Entity= Entity as PinnedChildDevelopmentEntity;
                EntitySchema = PinnedChildDevelopmentSchema;
                pinnedArticle = isArticlePinned;
            }
            else if(response.payload.apiEndpoint == appConfig.videoArticles)
            {
                insertData = response.payload.data.data;
                Entity= Entity as VideoArticleEntity;
                EntitySchema = VideoArticleEntitySchema;
            }
            else if(response.payload.apiEndpoint == appConfig.dailyMessages)
            {
            // console.log('dailyMeassages',response.payload.data.data)
                insertData = response.payload.data.data;
                Entity= Entity as DailyHomeMessagesEntity;
                EntitySchema = DailyHomeMessagesSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.basicPages)
            {
                insertData = response.payload.data.data;
                Entity= Entity as BasicPagesEntity;
                EntitySchema = BasicPagesSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.taxonomies)
            {
                const {standard_deviation, ...allData} = response.payload.data.data;
                insertData.push({langCode:response.payload.data.langcode,allData:JSON.stringify(allData),standardDevData:JSON.stringify(response.payload.data.data.standard_deviation)});
                Entity= Entity as TaxonomyEntity;
                EntitySchema = TaxonomySchema;
            }
            else if(response.payload.apiEndpoint == appConfig.activities)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ActivitiesEntity;
                EntitySchema = ActivitiesEntitySchema;
            }
            else if(response.payload.apiEndpoint == appConfig.surveys)
            {
                insertData = response.payload.data.data;
                Entity= Entity as SurveysEntity;
                EntitySchema = SurveysSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.milestones)
            {
                insertData = response.payload.data.data;
                Entity= Entity as MilestonesEntity;
                EntitySchema = MilestonesSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.childDevelopmentData)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ChildDevelopmentEntity;
                EntitySchema = ChildDevelopmentSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.childGrowthData)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ChildGrowthEntity;
                EntitySchema = ChildGrowthSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.vaccinations)
            {
                insertData = response.payload.data.data;
                Entity= Entity as VaccinationEntity;
                EntitySchema = VaccinationSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.healthCheckupData)
            {
                insertData = response.payload.data.data;
                Entity= Entity as HealthCheckUpsEntity;
                EntitySchema = HealthCheckUpsSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.standardDeviation)
            {
                insertData = response.payload.data.data;
                // Entity= Entity as ArticleEntity;
                EntitySchema = StandardDevWeightForHeightSchema;
            }
                // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
                if(EntitySchema == ArticleEntitySchema || EntitySchema == PinnedChildDevelopmentSchema)
                {
                    // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
                    try{
                        let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
                        // console.log(new Date(),"in insert success---",response);
                        resolve("successinsert");
                    }catch(e) {
                        let errorArr = [];
                        console.log("in insert catch---",response.payload);
                        errorArr.push(response.payload);
                        let payload = {errorArr:errorArr,fromPage:'OnLoad'}
                        response.dispatch(receiveAPIFailure(payload));
                        reject();
                    }
                }else if(EntitySchema == StandardDevWeightForHeightSchema) {
                    try{
                        let createresult = await dataRealmCommon.createStandardDev<typeof Entity>(insertData);
                        // console.log(new Date(),"in insert success---",response);
                        resolve("successinsert");
                    }catch(e) {
                        let errorArr = [];
                        console.log("in insert catch---",response.payload);
                        errorArr.push(response.payload);
                        let payload = {errorArr:errorArr,fromPage:'OnLoad'}
                        response.dispatch(receiveAPIFailure(payload));
                        reject();
                    }
                }else {
                    try{
                        let createresult = await dataRealmCommon.create<typeof Entity>(EntitySchema, insertData);
                        // console.log(new Date(),"in insert success---",response);
                        resolve("successinsert");
                    }catch(e) {
                        let errorArr = [];
                        console.log("in insert catch---",response.payload);
                        errorArr.push(response.payload);
                        let payload = {errorArr:errorArr,fromPage:'OnLoad'}
                        response.dispatch(receiveAPIFailure(payload));
                        reject();
                    }
                }
            // console.log(new Date()," result is ",createresult);
    });
}
// export const formatDate=(dateData:any,luxonLocale:string)=>{
//   return DateTime.fromISO(dateData).setLocale(luxonLocale).toFormat('dd LLL yyyy');
// }
// export const formatStringDate=(dateData:any,luxonLocale:string)=>{
//     //new Intl.DateTimeFormat('de-DE', options).format(date)
//     return DateTime.fromJSDate(new Date(dateData)).setLocale(luxonLocale).toFormat('dd LLL yyyy');
//   }
export const formatDate=(dateData:any,luxonLocale:string)=>{
    // return new IntlPolyfill.DateTimeFormat(luxonLocale, {day:'2-digit', month: 'short',year:'numeric' }).format(new Date(dateData))
 let day=new IntlPolyfill.DateTimeFormat(luxonLocale, {day:'2-digit'}).format(new Date(dateData));
 let month=new IntlPolyfill.DateTimeFormat(luxonLocale, {month:'short'}).format(new Date(dateData));
 let year=new IntlPolyfill.DateTimeFormat(luxonLocale, {year:'numeric'}).format(new Date(dateData));
 let dateView=day+" "+month+" "+year;
 return dateView;
}
export const formatStringDate=(dateData:any,luxonLocale:string)=>{
 let day=new IntlPolyfill.DateTimeFormat(luxonLocale, {day:'2-digit'}).format(new Date(dateData));
 let month=new IntlPolyfill.DateTimeFormat(luxonLocale, {month:'short'}).format(new Date(dateData));
 let year=new IntlPolyfill.DateTimeFormat(luxonLocale, {year:'numeric'}).format(new Date(dateData));
 let dateView=day+" "+month+" "+year;
 return dateView;
 }

  export const formatStringTime=(dateData:any,luxonLocale:string)=>{
    // let hour=new IntlPolyfill.DateTimeFormat(luxonLocale, {hour:'2-digit'}).format(new Date(dateData));
    // let minute=new IntlPolyfill.DateTimeFormat(luxonLocale, {minute:'2-digit',hour12: true}).format(new Date(dateData));
    // let period=new IntlPolyfill.DateTimeFormat(luxonLocale, {hour:"numeric",minute:'numeric',second:"numeric",hour12: true}).format(new Date(dateData)).split(" ")[1];
    // // console.log(period,"..period")
    // let timeView=hour+":"+minute+" "+period;
    //   return timeView;
    return new IntlPolyfill.DateTimeFormat(luxonLocale, {hour: 'numeric', minute: 'numeric',hour12: true}).format(new Date(dateData));
   // return DateTime.fromJSDate(new Date(dateData)).setLocale(luxonLocale).toFormat('hh:mm a');
  }
export const validateForm=(param:any,birthDate:any,isPremature:any,relationship:any,plannedTermDate:any,name?:any,gender?:any)=>{
   // console.log(param,birthDate,isPremature,relationship,plannedTermDate,name,gender);
    if(birthDate==null || birthDate==undefined){
    //    return 'Please enter birth date.';
    return false;
      }
      else{
        if(param==0){
            console.log(gender,"..gender11..");
            console.log(relationship,"..relationship11..");
            if(relationship =='' || relationship ==null || relationship ==undefined || gender =='' || gender ==0 || gender ==null || gender ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==1){
            if(name =='' || name ==null || name ==undefined){
                // return 'Please enter name.';
                return false;
            }
            if(gender =='' || gender ==0 || gender ==null || gender ==undefined){
                // return 'Please enter gender.';
                return false;
            }
        }
        if(param==2){
            console.log(gender,"..gender..");
            if(gender =='' || gender ==0 || gender ==null || gender ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==3){
            console.log(gender,"..gender..");
            if(relationship =='' || relationship ==null || relationship ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==4){
            console.log(gender,"..gender..");
            // if(relationship =='' || relationship ==null || relationship ==undefined){
            //     // return 'Please enter relationship.';
            //     return false;
            // }
        }
        if(isPremature=="true"){
          if(plannedTermDate==null || plannedTermDate==undefined){
            // return 'Please enter due date';
            return false;
          }
          else{
           return true;
          }
        }
        else{
            console.log(gender,"..gender112..");
            console.log(relationship,"..relationship112..");
            return true;
        }
      }
}

    /**
     * Get YouTube video ID from given url.
     */
    
    export const  getYoutubeId = (url: string): string => {
        let rval: string = url;

        // https://www.youtube.com/watch?v=LjkSW_j6-hA
        if (url?.indexOf('youtu.be') === -1) {
            let re = new RegExp('v=([^&]+)', 'img');
            let result = re.exec(url)

            if (result && result[1]) {
                rval = result[1];
            }
        }

        // https://youtu.be/uMcgJR8ESRc
        if (url?.indexOf('youtu.be') !== -1) {
            let re = new RegExp('youtu.be/([^?]+)', 'img');
            let result = re.exec(url)

            if (result && result[1]) {
                rval = result[1];
            }
        }

        return rval;
    }

    /**
     * Get Vimeo video ID from given url.
     * 
     * url = https://vimeo.com/277586602?foo=bar
     */
     export const  getVimeoId = (url: string): string => {
        let rval: string = url;

        let re = new RegExp('vimeo.com/([0-9]+)[^0-9]*', 'img');
        let result = re.exec(url)

        if (result && result[1]) {
            rval = result[1];
        }

        return rval;
    }
const isAnyKeyValueFalse = (o: { [x: string]: any; }) => !!Object.keys(o).find(k => !o[k]);
const formatImportedMeasures= (measures)=>{
    if (typeof measure === 'string' || measure instanceof String){
        //imported from old app
        if(measures==""){
            return [];
        }else{
            let importedMeasures = JSON.parse(measures);
            importedMeasures.forEach((measure:any) => {

                if (typeof measure?.measurementPlace === 'string' || measure?.measurementPlace instanceof String){
                if(measure?.measurementPlace=="doctor"){
                    measure.measurementPlace=0
                }else{
                    measure.measurementPlace=1
                }
                }
                if("length" in measure){
                    measure.weight = parseFloat(measure?.weight/1000).toFixed(2);
                    measure.height = parseFloat(measure?.length).toFixed(2);
                    delete measure.length;
                }

            });
            console.log(importedMeasures);
            return importedMeasures;
        }
    }else{
        return measures;
    }
}
const formatImportedReminders = (reminders)=>{
    if (typeof reminders === 'string' || reminders instanceof String){
        //imported from old app
    if(reminders==""){
        return [];
    }else{
        let importedReminders =  JSON.parse(reminders);
        importedReminders.forEach((reminder:any) => {
            reminder.reminderDate = Number(reminder.date);
            reminder.reminderTime = Number(reminder.time);
            reminder.reminderType = "healthCheckup";
            reminder.uuid = (reminder.uuid);
            delete reminder.date;
            delete reminder.time;
        });
        return importedReminders;
    }
}else{
    reminders
}
   
}
//child data get
export const getChild = async (child:any,genders:any) => {
    const photoUri=await RNFS.exists(CHILDREN_PATH + child.photoUri);
    // const childmeasures = await formatImportedMeasures(child.measures)
    // const childreminders = await formatImportedReminders(child.reminders)
    console.log(photoUri,"..photoUri..");
    console.log(child,"..childname..");
    console.log("name" in child,"..child.hasOwnProperty..");
    //const childName:any=child.hasOwnProperty("name") ? child.name:child.childName;
    const childName:any=("name" in child)=== true  ? child.name : ("childName" in child)=== true ? child.childName : ""
    console.log(childName,"..childname..");
    let genderValue:any=child.gender;
    console.log(typeof genderValue,"..typeof genderValue")
    if (typeof genderValue === 'string' || genderValue instanceof String){
    console.log(typeof genderValue,"..11typeof genderValue")
        // console.log(genders.find((genderset:any) => genderset.name == child.gender).id,"/idset");
    if(genders.length>0 && genderValue!=""){
     genderValue= genders.find((genderset) => genderset.name.toLowerCase() == child.gender.toLowerCase()).id
    }
    else{
     genderValue=0;
    }
    console.log(genderValue,"..22typeof genderValue")   
    }
    console.log(genderValue,"..genderValue..");        
    //child.isExpected?child.isExpected:"false"
    //mayur
    return {
      uuid: child.uuid,
      childName: childName,
      gender: genderValue,
      photoUri: photoUri?child.photoUri:"",
      createdAt: child.createdAt,
      updatedAt: child.updatedAt,
      plannedTermDate: child.plannedTermDate,
      birthDate: child.birthDate,
      babyRating:child.babyRating,
      //mayur
      measures:[],
      comment: child.comment,
      checkedMilestones:child.checkedMilestones,
      //mayur
      reminders: [],
      isMigrated:true,
      isPremature:'false', //calcualte if its premature or not?
      isExpected:'false'
      //relationship:''
     };
  }