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
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Mebitek Modular System</Text>
          <Text style={styles.text}>Manual References</Text>
          <Image style={{flex: 1, height: undefined, width: undefined}}
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

    let source = {uri: item.url};
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

    this.state = {
      text: "",
      datasource: props.datasource
    };

    this.arrayholder = props.datasource;
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
