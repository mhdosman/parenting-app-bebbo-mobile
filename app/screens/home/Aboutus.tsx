import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import { HomeDrawerNavigatorStackParamList } from '../../navigation/types';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const Aboutus = ({ navigation }: Props) => {
  const body = "<p>UNICEF is on the ground in over 150 countries and territories to help children survive and thrive, from early childhood through adolescence.</p>\n\n<p>UNICEF’s work on early childhood development in Europe and Central Asia (ECA) recognizes that every growing child need nurturing care, good health, optimal nutrition and a stimulating and safe environment that offers plenty of support for early learning. To ensure the best start for their children, all families need some support. Vulnerable families, who face additional challenges such as poverty, disability or social exclusion, need more help than others and they are in the focus of our attention.</p>\n\n<p>Recognizing that parents and caregivers are the main providers of nurturing care to young children, UNICEF prioritizes building of parental competencies as well as supporting parental wellbeing  throughout its programs. </p>\n\n<h2>About the Application</h2>\n\n<p>ParentBuddy application has been developed by the UNICEF Regional Office for Europe and Central Asia and UNICEF Serbia CO in close collaboration with the Institute of Public Health of Belgrade, Serbia.</p>\n\n<p>ParentBuddy is an application that supports responsive, positive parenting. Its aim is to provide comprehensive information about early childhood development and parental care in a parent-friendly format. The ParentBuddy also supports dissemination of messages and information related to COVID-19 prevention and protection for children.</p>\n\n<div alt=\"Parents and children\" data-embed-button=\"media_browser\" data-entity-embed-display=\"media_image\" data-entity-type=\"media\" data-entity-uuid=\"8fd1adbd-5f17-48b0-8986-1851afa09a7e\" data-langcode=\"en\" title=\"Parents and children\" class=\"embedded-entity\">  <img src=\"/parent_buddy_prod/docroot/sites/default/files/2020-06/Parents%20with%20two%20children%402x.png\" alt=\"Parents and children\" title=\"Parents and children\" typeof=\"foaf:Image\" /></div>\n\n\n<p>The app can also be used by service providers as a resource in their work with parents and as a tool for building trustworthy relationships and a partnership for the benefit of young children.</p>\n\n<p>The app contains a rich library of articles and videos grouped under thematic categories of:</p>\n\n<ul><li>Play and Learning                          - Nutrition and breastfeeding</li>\n\t<li>Responsive parenting                   - Safety and protection</li>\n\t<li>Health and wellbeing                    - Parental wellbeing</li>\n</ul><p>The app is using the information on child’s date of birth, gender, season of the year and other information entered by a parent to recommend suitable content and tailored guidance.</p>\n\n<p>Parents also have a possibility to use some or all four functional features of the app:</p>\n\n<ul><li>Child growth </li>\n\t<li>Developmental diary</li>\n\t<li>Vaccination</li>\n\t<li>Health check-ups</li>\n</ul><p>The contents of the application are complemented by a database of questions and answers from many years of parental, pedagogical and medical experience. The parent can search the contents and find answers to all questions regarding the child and parenthood - the answers are organized by age and thematic categories for better visibility and easier navigation.</p>\n\n<p>Some content throughout this app has been sourced, adapted and translated with permission from the Raising Children Network Australia (<a href=\"https://raisingchildren.net.au/\">raisingchildren.net.au</a>).</p>\n\n<p>The app will require internet connectivity to download the content and use interactive features (monitoring of growth, development, reminders for immunization or check-ups).</p>\n\n<p>The app will operate in off-line mode in environments with limited internet connectivity where all the articles and FAQ  will be available but interactive monitoring features will not be available. The precondition for that is that user was previously online <strong>at least once</strong> when s/he was downloading the app and logging into it. This is when user's phone has downloaded articles and FAQs from the server.</p>\n\n<p>Download the app and let the ParentBuddy be your companion in the parenting journey!</p>\n\n<p> </p>";
  return (
    <View>
      <Text>Aboutus screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
      <ScrollView contentContainerStyle={{ padding: 24, }}>
          <HTML
              source={{ html: body }}
              // contentWidth={contentWidth}
              baseFontStyle={{ fontSize: 18 }}
              // tagsStyles={htmlStyles}
              // imagesMaxWidth={Dimensions.get('window').width}
              // staticContentMaxWidth={Dimensions.get('window').width}
          />

      </ScrollView>
    </View>
  );
};
// Notifications.navigationOptions = screenProps => ({
//   title: 'Home',
// });
Aboutus.navigationOptions = () => ({
  title: 'Aboutus',
});
export default Aboutus;