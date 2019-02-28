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
          <Text style={styles.welcome}>Mebitek Modular System</Text>
          <Text>Manual References</Text>
          <Image style={{flex: 1, height: undefined, width: undefined}}
                 source={require('./img/modulargrid_833923.png')}
                 resizeMode="contain"
          />
          <Text style={styles.instructions}>
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

export function Menu({datasource, onItemSelected}) {

  return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <FlatList
            data={datasource}
            renderItem={({item}) => <Text onPress={() => onItemSelected(item)}
                                          style={styles.item}>{item.key}</Text>}
        />
      </ScrollView>)

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
  }
});
