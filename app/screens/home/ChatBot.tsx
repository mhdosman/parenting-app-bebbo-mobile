import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import { Heading4Bold, Heading4Centerr, Heading4Regular, Heading4Centerw, SideSpacing15 } from '@styles/typography';
import { FlexRow } from '@components/shared/FlexBoxStyle';
import VectorImage from 'react-native-vector-image';
import { ButtonLinkPressLeft, ButtonTextMdLineL } from '@components/shared/ButtonGlobal';
import LinearGradient from 'react-native-linear-gradient';
import { IconML } from '@components/shared/Icon';
import { BotImage, BotBubbleContainer, BotBubbleTextContainer, UserBubbleContainer, UserBubbleTextContainer, OptionBubbleContainer, ActionBubbleContainer,ActionBubbleIcon, OptionBubblePressable, ActionBubblePressable } from '@components/shared/SupportChatStyle';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../App';
import ThreeDotsLoader from '../../services/ThreeDotsLoader';
import { img_logo_chatbot_new } from '@dynamicImportsClass/dynamicImports';
const styles=StyleSheet.create({
  flex1:{flex:1},
  flexShrink1:{ flexShrink: 1 },
  font14:{ fontSize: 14 },
  htmlView:{ padding: 15, paddingTop: 5, paddingBottom: 5 },
  htmlView2:{ padding: 15, paddingTop: 15, paddingBottom: 5 },
  linearGradient:{ alignItems: 'center', borderRadius: 100, flex: 1, height: 36, justifyContent: 'center', width: 36 },
  marginTop0:{marginTop:0},
  marginTop40:{marginTop:40},
  paddingTop0:{paddingTop:0},
  paddingTop10:{paddingTop:10},
  vectorImage:{ borderRadius: 100, height: 20, resizeMode: 'contain', width: 20 },
})
const BotBubble = (props: any) => {
  const { message, steps,stepindex,loading } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [answer2visible, setanswer2visible] = useState(false);
  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
    );
    const userNameData =
        allConfigData?.length > 0
          ? allConfigData.filter((item:any) => item.key === 'userName')
          : [];

  
  return (
    <FlexRow>
      <BotImage>
        <LinearGradient
          style={styles.linearGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#2B2F84', '#1F50A0', '#00AEEF']}>
          <VectorImage style={styles.vectorImage} source={img_logo_chatbot_new} />
        </LinearGradient>
      </BotImage>
      <BotBubbleContainer>
        <BotBubbleTextContainer>
          {loading == true ? <ThreeDotsLoader /> : 
            <>
              {stepindex == 0 ?
                  <Heading4Bold>{t('helloMessage',{parentName:userNameData?.length > 0 ? ' '+userNameData[0].value : ''})}</Heading4Bold>
                  : <Heading4Bold>{message}</Heading4Bold> 
              }
             </> 
          }
        </BotBubbleTextContainer>
        {loading == false && steps && steps.textToShow && steps.textToShow.answer_part_1 && steps.textToShow.answer_part_1 != '' ?
          <>
            <View style={styles.htmlView}>
              <HTML
                source={{ html: addSpaceToHtml(steps.textToShow.answer_part_1) }}
                baseFontStyle={styles.font14}
                ignoredStyles={['color', 'font-size', 'font-family']}
                tagsStyles={{
                  p: { marginBottom: 0, marginTop: 0, textAlign: 'left' },
                }}
              />
            </View>
            {steps && steps.textToShow && steps.textToShow.answer_part_2 && steps.textToShow.answer_part_2 != '' && answer2visible == false ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={() => {
                    //show answer 2
                    setanswer2visible(true)
                  }}>
                  <ButtonTextMdLineL >
                    {t('readMoreTxt')}
                  </ButtonTextMdLineL>
                </ButtonLinkPressLeft>
              </SideSpacing15>
              : null}
            {answer2visible == true ?
              <View style={styles.htmlView2}>
                <HTML
                  source={{ html: addSpaceToHtml(steps.textToShow.answer_part_2) }}
                  baseFontStyle={styles.font14}
                  ignoredStyles={['color', 'font-size', 'font-family']}
                  tagsStyles={{
                    p: { marginBottom: 0, marginTop: 0, textAlign: 'left' },
                  }}
                />
              </View>
              : null}
            {steps && steps.textToShow && steps.textToShow.related_article && steps.textToShow.related_article != 0 && (answer2visible == true || (steps.textToShow.answer_part_2 == '' && answer2visible == false)) ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={() => {
                    //show article related steps.textToShow.related_article
                      navigation.navigate('DetailsScreen',
                      {
                        fromScreen:"SupportChat",
                        headerColor:'',
                        backgroundColor:'',
                        detailData:steps.textToShow.related_article,
                        // setFilteredArticleData: setFilteredArticleData
                      });

                  }}>
                  <ButtonTextMdLineL>
                    {t('learnMoreLinkTxt')}
                  </ButtonTextMdLineL>
                </ButtonLinkPressLeft>
              </SideSpacing15>
              : null}
          </>
          : null
        }
      </BotBubbleContainer>
    </FlexRow>
  )
}
const UserBubble = (props: any) => {
  const { message, steps } = props
  return (
    <UserBubbleContainer>
      <UserBubbleTextContainer>
        <Heading4Centerw>{message}</Heading4Centerw>
      </UserBubbleTextContainer>
    </UserBubbleContainer>
  )
}
const OptionBubble = (props: any) => {
  const { optionval, optionindex, stepindex, steps, categorySelection, dynamicStepSelection, backToHomeScreen, showFeedbackLink, noDataStep } = props
  return (
    <>

      <OptionBubbleContainer>
        <OptionBubblePressable
          onPress={() => {
            optionval?.nextStepFunc(stepindex, optionindex, steps)
          }}>
          <Heading4Centerr>
            {optionval?.label}
          </Heading4Centerr>
        </OptionBubblePressable>
      </OptionBubbleContainer>

    </>
  )
}
const ActionBubble = (props: any) => {
  const { actionval, actionindex, stepindex, steps, stepsjson, backToStep, backToHomeScreen } = props
  return (
    <>

      <ActionBubbleContainer style={actionindex == 0 ? styles.marginTop40 : styles.marginTop0}>
        <ActionBubblePressable
          onPress={() => {
            actionval?.nextStepFunc(stepindex, actionindex, actionval.nextStepval, steps[stepindex].id, steps, stepsjson)
          }}>
          <ActionBubbleIcon>
            <IconML name="ic_back" size={16} color="#000" />
          </ActionBubbleIcon>
          <Heading4Regular style={styles.flexShrink1}>
            {actionval?.label}
          </Heading4Regular>
        </ActionBubblePressable>
      </ActionBubbleContainer>
    </>
  )
}


const ChatBot = (props: any) => {
  const { item, index, steps, stepsjson, categorySelection, dynamicStepSelection, backToStep, backToHomeScreen, showFeedbackLink,noDataStep } = props;
  const [loading,setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    },item.delay);       
  }, [item.showNextStep]);
  return (
    <View style={[styles.flex1,(index == 0 ? styles.paddingTop10 : styles.paddingTop0)]} key={index}>
      {item.showNextStep == true ?
        <>
          <BotBubble key={'b' + item.id + '-' + index} message={item.message} steps={item} stepindex={index} loading={loading}/>
            {loading == false ? 
              <>
                {
                  item.answer ?
                    <UserBubble key={'u' + item.id + '-' + item.answer.value} message={item.answer.label} steps={item} />
                    :
                    <>
                      {item.options && item.options.length > 0 ?
                        item.options.map((y: any, i2: any) => {
                          return (
                            <OptionBubble key={'o' + index + '-' + i2} optionval={y} optionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToHomeScreen={backToHomeScreen} showFeedbackLink={showFeedbackLink} noDataStep={noDataStep} />
                          )
                        })
                        : null}
                      {item && item.actions && item.actions.length > 0 ?
                        item.actions.map((y: any, i2: any) => {
                          return (
                            <ActionBubble key={'a' + index + '-' + i2} actionval={y} actionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} backToStep={backToStep} backToHomeScreen={backToHomeScreen} />
                          )
                        })
                        : null}
                    </>
                }
              </> 
              : null
            }
        </>
        : null
      }
    </View>
  )
};

export default React.memo(ChatBot);
