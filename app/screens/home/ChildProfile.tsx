import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonLinkPress, ButtonTextMdLineL,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import { MainContainer,AreaContainer } from '@components/shared/Container';
import { FDirRow, FlexColEnd,FlexCol} from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import PrematureTag from '@components/shared/PrematureTag';
import {
  ParentData, ParentLabel, ParentListView, ParentRowView, ParentSection, ProfileActionView, ProfileContentView, ProfileIconView, ProfileLinkCol,
  ProfileLinkRow, ProfileLinkView, ProfileListDefault, ProfileListInner, ProfileListViewSelected1, ProfileSectionView, ProfileTextView
} from '@components/shared/ProfileListingStyle';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2w,
  Heading3,
  Heading5,
  Heading5Bold,
  Heading6,
  ShiftFromBottom5,
  Heading5BoldW
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { getAllChildren, setActiveChild } from '../../services/childCRUD';
import { formatDate } from '../../services/Utils';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const ChildProfile = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const secopndaryColor = themeContext.colors.SECONDARY_COLOR;
  const secopndaryTintColor = themeContext.colors.SECONDARY_TINTCOLOR;
  const genders = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender:[],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      //getAllConfigData(dispatch);
    },[])
  );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
);
const isFutureDate = (date: Date) => {
  return new Date(date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
};
const currentActiveChild =activeChild.uuid;
const child_age = useAppSelector(
  (state: any) =>
  state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
);
  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
  );
  const userParentalRoleData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userParentalRole')
      : [];
  const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userName')
      : [];
   const relationshipData = useAppSelector(
        (state: any) =>
        state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender:[],
      );
      console.log(relationshipData,"..relationshipData..")
    let relationshipValue = relationshipData.length>0 && userParentalRoleData.length>0 ? relationshipData.find((o:any) => String(o.id) === userParentalRoleData[0].value):'';
    console.log(relationshipValue,"..relationshipValue..")
  // const currentActiveChildId =
  //   allConfigData?.length > 0
  //     ? allConfigData.filter((item) => item.key === 'currentActiveChildId')
  //     : [];
  //console.log(allConfigData,"..userParentalRole..")
  // const currentActiveChild =
  //   currentActiveChildId?.length > 0 ? currentActiveChildId[0].value : null;
  // //console.log(currentActiveChild,"..currentActiveChild..");
  const SortedchildList = [...childList].sort((a: any, b: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  const renderChildProfile = (dispatch: any, data: any, index: number,genderName:string) => (
    console.log(genderName,"...ggnme"),
    <View key={data.uuid}>
      {currentActiveChild != '' &&
      currentActiveChild != null &&
      currentActiveChild != undefined &&
      currentActiveChild == data.uuid ? (
        <ProfileListViewSelected1>
          
          <ProfileIconView>
            {
          data.photoUri!='' ? 
          <ImageIcon source={{uri:  "file://"+CHILDREN_PATH +data.photoUri }} style={{borderRadius:20,width:40,height:40}}>
         </ImageIcon>  : <Icon name="ic_baby" size={30} color="#000" />
            }
          </ProfileIconView>
          <ProfileTextView>
            <ProfileSectionView>
              <Heading3>{data.childName}{genderName!='' && genderName!=null && genderName!=undefined ?<Text style={{fontSize:12,fontWeight:'normal'}}>{', '+genderName}</Text>:null}
              </Heading3>
            </ProfileSectionView>
            <Heading5>      
              {( data.birthDate != '' &&
                    data.birthDate != null &&
                    data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn',{childdob:data.birthDate!=null? formatDate(data.birthDate):''}):t('expectedChildDobLabel')}
            </Heading5>
            <ProfileLinkView>
              <ButtonTextSmLine
                onPress={() => {
                  console.log("..2222..");
                  data.index = index;
                  console.log(isFutureDate(data.birthDate),"..isFutureDate(data.birthDate)..");
                  if(isFutureDate(data.birthDate)){
                    navigation.navigate('AddExpectingChildProfile', {childData: data});
                  }
                  else{
                    navigation.navigate('EditChildProfile', {childData: data});
                  }
                }}>
                <Text>{t('editProfileBtn')}</Text>
              </ButtonTextSmLine>
            </ProfileLinkView>
          </ProfileTextView>
          
          <ProfileActionView>
          <FlexColEnd>
            {/* Premature Tag Insert Here */}
          {/* <ShiftFromBottom5>
          <PrematureTag>
          <Heading5BoldW>
          {t('developScreenprematureText')}
          </Heading5BoldW>
          </PrematureTag>
          </ShiftFromBottom5> */}
          {/* Premature Tag End Here */}
          <FDirRow>
            <OuterIconRow>
              <OuterIconLeft>
                <TickView>
                  <Icon name="ic_tick" size={12} color="#009B00" />
                </TickView>
              </OuterIconLeft>
            </OuterIconRow>

            <Heading5Bold>{t('childActivatedtxt')}</Heading5Bold>
            </FDirRow>
            </FlexColEnd>  
          </ProfileActionView>
        </ProfileListViewSelected1>
      ) : (
        
        <ProfileListDefault
          style={{
            backgroundColor: secopndaryTintColor,
          }}>
          <ProfileListInner>
            <ProfileIconView>
              {
          data.photoUri!='' ? 
          <ImageIcon source={{uri:  "file://"+CHILDREN_PATH +data.photoUri }} style={{borderRadius:20,width:40,height:40}}>
         </ImageIcon>  : <Icon name="ic_baby" size={30} color="#000" />
            }
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView style={{alignItems:'flex-start'}}>
              <Heading3>{data.childName}{genderName!='' && genderName!=null && genderName!=undefined ?<Text style={{fontWeight:'normal'}}>{', '+genderName}</Text>:null}
              </Heading3>
                
              </ProfileSectionView>
              <Heading5>      
                          {( data.birthDate != '' &&
                               data.birthDate != null &&
                               data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn',{childdob:data.birthDate!=null? formatDate(data.birthDate):''}):t('expectedChildDobLabel')}
                        </Heading5>
              <ProfileLinkView>
                <ButtonTextSmLine
                  onPress={() => {
                  data.index = index;
                  console.log(isFutureDate(data.birthDate),"..isFutureDate(data.birthDate)..");
                  if(isFutureDate(data.birthDate)){
                    navigation.navigate('AddExpectingChildProfile', {childData: data});
                  }
                  else{
                    navigation.navigate('EditChildProfile', {childData: data});
                  }
                  }}>
                  <Text>{t('editProfileBtn')}</Text>
                </ButtonTextSmLine>
                <View>
                  <Text>|</Text>
                </View>
                <ButtonTextSmLine
                  onPress={() => {
                    setActiveChild(languageCode,data.uuid,dispatch,child_age);
                  }}>
                 {t('childActivatebtn')}
                </ButtonTextSmLine>
              </ProfileLinkView>
            </ProfileTextView>
            <ProfileActionView>
              {/* Pressable button */}
              {/* <Text></Text> */}
              <FlexColEnd>
              {/* Premature Tag Insert Here */}
          {/* <ShiftFromBottom5>
          <PrematureTag>
          <Heading5BoldW>
          {t('developScreenprematureText')}
          </Heading5BoldW>
          </PrematureTag>
          </ShiftFromBottom5> */}
           {/* Premature Tag End Here */}
            </FlexColEnd>  
            </ProfileActionView>
          </ProfileListInner>
        </ProfileListDefault>     
      )}
    </View>
  );
  
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
       
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
          <Pressable
              onPress={(e) => {
                e.stopPropagation();
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </Pressable>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2w>{t('childProfileHeader')}</Heading2w>
          </HeaderTitleView>
        </HeaderRowView>
        <FlexCol>
        <AreaContainer>
          <View style={{flexDirection: 'column'}}>
            <ScrollView style={{maxHeight:'70%',height:'auto'}} nestedScrollEnabled={true}>
              {SortedchildList.length > 0
                ? SortedchildList.map((item: any, index: number) => {
                   console.log(item,"..item..");
                  // console.log(genders,"..genders..");
                  const genderLocal=(genders?.length>0 && item.gender!="")? genders.find(genderset => genderset.id == parseInt(item.gender)).name:'';
                  console.log(genderLocal,"..genderLocal..")
                  return renderChildProfile(dispatch, item, index,genderLocal);
                  })
                : null}
            </ScrollView>
            <ProfileLinkRow
              style={{
                backgroundColor: secopndaryTintColor,
              }}>
              <ProfileLinkCol>
                <ButtonLinkPress
                  onPress={() => {
                    navigation.navigate('EditChildProfile', {childData: null});
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={24} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>

                  <ButtonTextMdLineL>{t('childSetupListaddSiblingBtn')}</ButtonTextMdLineL>
                </ButtonLinkPress>
              </ProfileLinkCol>
              <ProfileLinkCol>
                <ButtonLinkPress
                  onPress={() => {
                    navigation.navigate('AddExpectingChildProfile',{childData: null});
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={24} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>

                  <ButtonTextMdLineL>{t('expectChildAddTxt2')}</ButtonTextMdLineL>
                </ButtonLinkPress>
              </ProfileLinkCol>
            </ProfileLinkRow>

            <ParentListView style={{backgroundColor: secopndaryTintColor}}>
              <ProfileContentView>
                <ProfileTextView>
                  <Heading3>{t('parentDetailsTxt')}</Heading3>
                </ProfileTextView>
                <ProfileActionView>
                  <ButtonLinkPress
                    onPress={() => {
                      navigation.navigate('EditParentDetails', {
                        userParentalRoleData:
                          userParentalRoleData?.length > 0
                            ? userParentalRoleData[0].value
                            : '',
                        parentEditName:
                          userNameData?.length > 0 ? userNameData[0].value : '',
                      });
                    }}>
                    <ButtonTextSmLine>{t('editProfileBtn')}</ButtonTextSmLine>
                  </ButtonLinkPress>
                </ProfileActionView>
              </ProfileContentView>

              <ProfileContentView>
                <ParentRowView>
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentRoleLabel')}</Text>
                    </ParentLabel>
                    <ParentData>
                      <Text style={{marginLeft:15}}>
                        {
                        userParentalRoleData?.length > 0
                          ? relationshipValue.name
                          : ''
                        }
                      </Text>
                    </ParentData>
                  </ParentSection>
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentNameLabel')}</Text>
                    </ParentLabel>
                    <ParentData>
                      <Text style={{marginLeft:15}}>
                        {userNameData?.length > 0 ? userNameData[0].value : ''}
                      </Text>
                    </ParentData>
                  </ParentSection>
                </ParentRowView>
              </ProfileContentView>
            </ParentListView>
            {/* <View style={{flexDirection: 'row'}}>
                  <View style={{padding: 10}}>
                    <Text>Name</Text>
                  </View>
                  <View style={{padding: 10}}>
                    <Text>{userNameData?.length>0?userNameData[0].value:''}</Text>
                  </View>
                </View> */}
          </View>
        </AreaContainer>
        </FlexCol>
      </SafeAreaView>
    </>
  );
};

export default ChildProfile;
