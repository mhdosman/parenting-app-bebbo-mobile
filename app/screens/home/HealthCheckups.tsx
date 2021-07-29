import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import PreviousHealthCheckup from '@components/healthChekup/PreviousHealthCheckup';
import UpcomingHealthCheckup from '@components/healthChekup/UpcomingHealthCheckup';
import {
  ButtonContainerAuto,
  ButtonHealth,
  ButtonText,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { ToolsBgContainer } from '@components/shared/ToolsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2Center,
  Heading4Center,
  ShiftFromBottom20,
  ShiftFromTopBottom10
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { getAllHealthCheckupPeriods } from '../../services/healthCheckupService';

type HealthCheckupsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
};
const HealthCheckups = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext.colors.HEALTHCHECKUP_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const {t} = useTranslation();
  let {
    upcomingPeriods,
    previousPeriods,
    sortedGroupsForPeriods,
    totalPreviousVaccines,
    totalUpcomingVaccines,
    currentPeriod,
  } = getAllHealthCheckupPeriods();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  let reminders = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild).reminders
      : [],
  );
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  // console.log(reminders,"UpcomingHealthCheckup-reminders");
  const healthCheckupReminder = reminders.filter(
    (item) => item.reminderType == 'healthCheckup',
  )[0];
  // console.log(healthCheckupReminder,"healthCheckupReminder",);
  const renderItem = (index: number) => {
    if (index === 0) {
      return (
        <View>
          {upcomingPeriods.length > 0 ? (
            upcomingPeriods?.map((item, itemindex) => {
              return (
                <UpcomingHealthCheckup
                  item={item}
                  currentPeriodId={currentPeriod?.id}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
              );
            })
          ) : (
            <Heading4Center>{t('noDataTxt')}</Heading4Center>
          )}
        </View>
      );
    } else if (index === 1) {
      return (
        <View>
          {previousPeriods.length > 0 ? (
            previousPeriods?.map((item, itemindex) => {
              return (
                <PreviousHealthCheckup
                  item={item}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
              );
            })
          ) : (
            <Heading4Center>{t('noDataTxt')}</Heading4Center>
          )}
        </View>
      );
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ToolsBgContainer>
          <TabScreenHeader
            title={t('hcHeader')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4}}>
            <MainContainer style={{backgroundColor: backgroundColor}}>
              <ShiftFromBottom20>
                <Heading2Center>{t('hcSummaryHeader')}</Heading2Center>
              </ShiftFromBottom20>

              {
              isFutureDate(activeChild?.birthDate) ? (null) :
              healthCheckupReminder ? null : 
                (<Pressable
                  onPress={() => {
                    navigation.navigate('AddReminder', {
                      reminderType: 'healthCheckup', // from remiderType
                      headerTitle: t('vcReminderHeading'),
                      buttonTitle: t('hcReminderAddBtn'),
                      titleTxt: t('hcReminderText'),
                      warningTxt: t('hcReminderDeleteWarning'),
                      headerColor: headerColor,
                    });
                  }}>
                  <ButtonTextSmLine>{t('hcReminderbtn')}</ButtonTextSmLine>
                </Pressable>)
              }

              <ButtonContainerAuto>
                <ButtonHealth
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    navigation.navigate('AddChildHealthCheckup', {
                      headerTitle: t('hcNewHeaderTitle'),
                    })
                  }>
                  <ButtonText>{t('hcNewBtn')}</ButtonText>
                </ButtonHealth>
              </ButtonContainerAuto>
            </MainContainer>

            <TabBarContainer>
              {data.map((item, itemindex) => {
                return (
                  <Pressable
                    key={itemindex}
                    style={{flex: 1}}
                    onPress={() => {
                      setSelectedIndex(itemindex);
                    }}>
                    <TabBarDefault
                      style={[
                        {
                          backgroundColor:
                            itemindex == selectedIndex
                              ? headerColor
                              : backgroundColor,
                        },
                      ]}>
                      <Heading4Center>{item.title}</Heading4Center>
                    </TabBarDefault>
                  </Pressable>
                );
              })}
            </TabBarContainer>
            <ShiftFromTopBottom10>
              <Flex1>{renderItem(selectedIndex)}</Flex1>
            </ShiftFromTopBottom10>
          </ScrollView>
        </ToolsBgContainer>
      </SafeAreaView>
    </>
  );
};

export default HealthCheckups;
