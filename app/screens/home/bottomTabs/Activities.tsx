import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import ActivitiesCategories from '@components/ActivitiesCategories';
import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ActivityBox, ArticleHeading, ArticleListContainer, ArticleListContent } from '@components/shared/ArticlesStyle';
import { ButtonTextSmLine } from '@components/shared/ButtonGlobal';

import { MainContainer } from '@components/shared/Container';
import { DividerAct } from '@components/shared/Divider';
import { FDirCol, FDirRow, FlexCol, FlexDirRow, FlexDirRowSpace } from '@components/shared/FlexBoxStyle';
import PrematureTag, { PrematureTagActivity } from '@components/shared/PrematureTag';
import ProgressiveImage from '@components/shared/ProgressiveImage';

import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4, Heading5Bold, Heading6Bold, ShiftFromTop5, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet, View
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../../App';
import downloadImages from '../../../downloadImages/ImageStorage';
type ActivitiesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route:any
  navigation: ActivitiesNavigationProp;
};

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];
const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;

const Activities = ({ route,navigation }: Props) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const fromPage = 'Activities';
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const ActivitiesData = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const activityCategoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const [filterArray, setFilterArray] = useState([]);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [selectedChildActivitiesData, setSelectedChildActivitiesData] = useState([]);
  const [suggestedGames, setsuggestedGames] = useState([]);
  const [otherGames, setotherGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData,setfilteredData] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      // console.log("useFocusEffect called");
      setLoading(true);
      // setModalVisible(true);
      async function fetchData() {
        // console.log("categoryarray--",route.params?.categoryArray);
          if(route.params?.categoryArray)
          {
            // console.log(route.params?.categoryArray);
            setFilterArray(route.params?.categoryArray);
            setFilteredActivityData(route.params?.categoryArray);
          }
          else {
            setFilterArray([]);
            setFilteredActivityData([]);
          }
      }
      fetchData()

    },[selectedChildActivitiesData,route.params?.categoryArray])
  );

  const showSelectedBracketData = async (item: any) => {
    // console.log("in showSelectedBracketData--",item);
    setCurrentSelectedChildId(item.id);
    let filteredData = ActivitiesData.filter((x: any) => x.child_age.includes(item.id));
    // filteredData =filteredData.map( item => ({ ...item, name:item.name }) )
    setSelectedChildActivitiesData(filteredData);
    // console.log(filteredData?.length);
    let imageArray:any=[];
    if(filteredData?.length>0){
      filteredData.map((item: any, index: number) => {
        if(item['cover_image'] != "")
        {
          imageArray.push({
              srcUrl: item['cover_image'].url, 
              destFolder: destinationFolder, 
              destFilename: item['cover_image'].url.split('/').pop()
          })
        }
        });
        // console.log(imageArray,"..imageArray..");
        const imagesDownloadResult = await downloadImages(imageArray);
        console.log(imagesDownloadResult,"..imagesDownloadResult..");
  }
  }
  useFocusEffect(
    React.useCallback(() => {
      // console.log("child dev usefocuseffect");
      console.log(route.params?.currentSelectedChildId);
      if(route.params?.currentSelectedChildId && route.params?.currentSelectedChildId != 0)
      {
        // console.log(route.params?.categoryArray);
        const firstChildDevData = childAge.filter((x:any)=> x.id == route.params?.currentSelectedChildId);
        // console.log("firstChildDevData---",firstChildDevData);
        showSelectedBracketData(firstChildDevData[0]);
      }
      else {
        const firstChildDevData = childAge.filter((x:any)=> x.id == activeChild?.taxonomyData.id);
        // console.log("firstChildDevData---",firstChildDevData);
        showSelectedBracketData(firstChildDevData[0]);
      }
      return () => {
        setFilterArray([]);
        setCurrentSelectedChildId(0);
        setSelectedChildActivitiesData([]);
        setsuggestedGames([]);
        setotherGames([]);
        setLoading(false);
        setfilteredData([]);

        console.log("in unmount-",route.params?.currentSelectedChildId);
          if(route.params?.currentSelectedChildId)
          {
            navigation.setParams({currentSelectedChildId:0})
            // route.params?.currentSelectedChildId = 0;
          }
          if(route.params?.categoryArray)
          {
            navigation.setParams({categoryArray:[]})
            // route.params?.currentSelectedChildId = 0;
          }
      };
    }, [activeChild?.uuid,route.params?.currentSelectedChildId])
  );
  useFocusEffect(
    React.useCallback(() => {
      // console.log("child dev usefocuseffect");
      setsuggestedGames(filteredData.filter((x: any) => x.related_milestone.length > 0));
      setotherGames(filteredData.filter((x: any) => x.related_milestone.length == 0));
      // console.log("firstChildDevData---",firstChildDevData);
    }, [filteredData])
  );
  const setFilteredActivityData = (itemId:any) => {
    // console.log(itemId,"articleData in filtered ",articleData);
    if(selectedChildActivitiesData && selectedChildActivitiesData.length > 0 && selectedChildActivitiesData != [])
    {
      if(itemId.length>0)
      {
        const newArticleData = selectedChildActivitiesData.filter((x:any)=> itemId.includes(x.activity_category));
        setfilteredData(newArticleData);
        setLoading(false);
      }else {
        const newArticleData = selectedChildActivitiesData.length > 0 ? selectedChildActivitiesData : [];
        setfilteredData(newArticleData);
        setLoading(false);
      }
    }
  }
  const goToActivityDetail = (item:typeof filteredData[0]) => {
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"Activities",
      headerColor:headerColor,
      backgroundColor:backgroundColor,
      detailData:item,
      listCategoryArray: filterArray,
      selectedChildActivitiesData: selectedChildActivitiesData
      // setFilteredArticleData: setFilteredArticleData
    });
  };
  // console.log(selectedChildActivitiesData,"--selectedChildActivitiesData");
  // console.log(filteredData,"--filteredData");
  // console.log(suggestedGames,"--suggestedGames");
  // console.log(otherGames,"--otherGames");
  
  const onFilterArrayChange = (newFilterArray: any) => {
    // console.log("on filterarray change",newFilterArray);
    // filterArray = [...newFilterArray];
    setFilterArray(newFilterArray)
    // console.log("on filterarray change after",filterArray)
  }
  const renderActivityItem = (item: any, index: number) => (
    <Pressable onPress={() => { goToActivityDetail(item)}} key={index}>
      <ArticleListContainer>
        {/* <Image
          style={styles.cardImage}
          source={item.imagePath}
          resizeMode={'cover'}
        /> */}
        <ProgressiveImage
          thumbnailSource={require('@assets/trash/defaultArticleImage.png')}
          source={item.cover_image ? { uri: "file://" + destinationFolder + item.cover_image.url.split('/').pop() } : require('@assets/trash/defaultArticleImage.png')}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <ArticleListContent>
          <ShiftFromTopBottom5>
            <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
        </ArticleListContent>

        <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'} />
      </ArticleListContainer>
    </Pressable>
  );
  const SuggestedActivities = (item: any, index: number) => (
    <Pressable onPress={() => { goToActivityDetail(item)}} key={index}>
      <ArticleListContainer>
        {/* <Image
          style={styles.cardImage}
          source={require('@assets/trash/card5.jpeg')}
          resizeMode={'cover'}
        /> */}
        <ProgressiveImage
          thumbnailSource={require('@assets/trash/defaultArticleImage.png')}
          source={item.cover_image ? { uri: "file://" + destinationFolder + item.cover_image.url.split('/').pop() } : require('@assets/trash/defaultArticleImage.png')}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <ArticleListContent>
          <ShiftFromTopBottom5>
            <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
          {/* keep below code ActivityBox for future use */}
          {/* <ActivityBox>
          <View>
            <Heading6Bold>
              {t('actScreenpendingMilestone')} {t('actScreenmilestones')}
            </Heading6Bold>
            <ShiftFromTop5>
            <Heading4>{'Laugh at Human face'}</Heading4>
            </ShiftFromTop5>
          </View>
          <View>
            <ButtonTextSmLine>
              {t('actScreentrack')} {t('actScreenmilestones')}
            </ButtonTextSmLine>
          </View>
        </ActivityBox> */}
        </ArticleListContent>
        <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'} />
      </ArticleListContainer>
    </Pressable>
  );
  const ContentThatGoesAboveTheFlatList = () => {

    return (
      <>
        <View style={{}}>
          {suggestedGames && suggestedGames?.length > 0 ?
            <>
              <ArticleHeading>
                <FlexDirRowSpace>
                  <Heading3>{t('actScreensugacttxt')}</Heading3>
                  {/* <PrematureTagActivity>
                <Heading5Bold>{t('actScreenprematureText')}</Heading5Bold>
              </PrematureTagActivity> */}
                </FlexDirRowSpace>
              </ArticleHeading>

              <FlatList
                data={suggestedGames}
                renderItem={({ item, index }) => SuggestedActivities(item, index)}
                keyExtractor={(item) => item.id.toString()}
              />
              {otherGames && otherGames?.length > 0 ?
                <ArticleHeading>
                  <Heading3>{t('actScreenotheracttxt')}</Heading3>
                </ArticleHeading>
                :null}
            </>
            : null
          }
        </View>

      </>
    );
  };
  
  return (
    <>
      <ContainerView>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        {/* <ScrollView nestedScrollEnabled={true}> */}
        <TabScreenHeader
          title={t('actScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#000"
        />

        {currentSelectedChildId && currentSelectedChildId != 0 ?
          <AgeBrackets
            itemColor={backgroundColor}
            activatedItemColor={headerColor}
            currentSelectedChildId={currentSelectedChildId}
            showSelectedBracketData={showSelectedBracketData}
            ItemTintColor={backgroundColor}
          />
          : null
        }
        <FlexCol>
          <DividerAct></DividerAct>
          <ActivitiesCategories
            borderColor={headerColor}
            filterOnCategory={setFilteredActivityData}
            fromPage={fromPage}
            filterArray={filterArray}
            onFilterArrayChange={onFilterArrayChange}
          />
          <DividerAct></DividerAct>

          <View>
          
                
                <FlatList
                  data={otherGames}
                  renderItem={({ item, index }) => renderActivityItem(item, index)}
                  keyExtractor={(item) => item.id.toString()}
                  ListHeaderComponent={ContentThatGoesAboveTheFlatList}
                // ListFooterComponent={ContentThatGoesBelowTheFlatList}
                />
              
          </View>
        </FlexCol>
      </ContainerView>
    </>
  );
};

export default Activities;

const styles = StyleSheet.create({
  cardImage: {
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center',

  },
  // item: {
  //   height: '100%',
  //   backgroundColor: '#FFF',
  //   // padding: 20,
  //   // marginVertical: 8,
  //   // marginHorizontal: 16,
  //   // borderRadius: 5,
  //   flex: 1,
  // },
  // title: {
  //   fontSize: 16,
  //   padding: 10,
  //   // flex: 1,
  //   color: '#000',
  // },
  // label: {
  //   // fontSize: 12,
  //   // paddingLeft: 10,
  //   // flex: 1,
  //   // color: '#000',
  // },

});
