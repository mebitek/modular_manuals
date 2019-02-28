/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';
import SideMenu from "react-native-side-menu/index";
import Icon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    const datasource = require("./manuals.json");

    this.state = {
      isOpen: false,
      selectedItem: '',
      loaded: false,
      datasource: datasource
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({isOpen});
  }

  onMenuItemSelected = item => {
    this.setState({
      isOpen: false,
      loaded: true,
      selectedItem: item,
    });
  };

  render() {
    const menu = <Menu datasource={this.state.datasource} onItemSelected={this.onMenuItemSelected}/>;

    return (
        <SideMenu menu={menu} isOpen={this.state.isOpen}
                  onChange={isOpen => this.updateMenuState(isOpen)}>
          <ContentView loaded={this.state.loaded}
                       selectedItem={this.state.selectedItem}/>
        </SideMenu>
    );
  }
}

export class ContentView extends Component {

  render() {
    return this.conditionalRender()
  }

  conditionalRender() {

    if (this.props.loaded) {
      return ContentView.renderPdf(this.props.selectedItem);
    } else {
      return this.renderDiscalimer();
    }
  }

  renderDiscalimer() {

    let width = Dimensions.get("window").width - 20;
    let height = Dimensions.get("window").height - 20;

    return (
        <View style={styles.container}>
          <Text style={styles.text}>Mebitek Modular System</Text>
          <Text style={styles.text}>Manual References</Text>
          <Image style={{flex: 1, width: width, height: height} }
                 source={require('./img/modulargrid_833923.png')}
                 resizeMode="contain"
          />
          <Text style={styles.text}>
            <Icon name={"md-arrow-back"}/>Select a manual from the sidebar menu
          </Text>
        </View>
    )
  }

  static renderPdf(item) {

    let source = {uri: item.url, cache: true};
    if (item.type === 'int') {
      source = {uri: "bundle-assets:"+item.url}
    }

    return (
        <View style={styles.container}>
          <Pdf
              key={item.key}
              source={source}
              style={styles.pdf}/>
        </View>
    )
  }
}

export class Menu extends Component{

  constructor(props) {
    super(props);

    this.arrayholder = shuffle(props.datasource);

    this.state = {
      text: "",
      datasource: this.arrayholder
    };

  }

  searchFilterFunction = (text: string) => {
      const newData = this.arrayholder.filter(function(item) {
        const itemData = item.key.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        datasource: newData,
        text: text
      });
  };

  render() {
    return (
        <View style={styles.menu}>
          <Text style={styles.text}>MANUALS</Text>
          <TextInput
              style={styles.textInputStyle}
              onChangeText={text => this.searchFilterFunction(text)}
              value={this.state.text}
              underlineColorAndroid="transparent"
              placeholder="Search Here"
          />
        <ScrollView scrollsToTop={false} >
          <FlatList
              data={this.state.datasource}
              renderItem={({item}) => (
                  <Text onPress={() => this.props.onItemSelected(item)}
                                            style={styles.item}>{item.key}</Text>
              )}
              enableEmptySections={true}
              style={{ marginTop: 10 }}

          />
        </ScrollView>
        </View>)
  }
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#FFF'
  },
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
});
