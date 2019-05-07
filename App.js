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
  AsyncStorage,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  BackHandler
} from 'react-native';
import SideMenu from "react-native-side-menu/index";
import Icon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import {CheckBox, ListItem} from 'react-native-elements';

import PhotoUpload from 'react-native-photo-upload';

import {
  handleAndroidBackButton,
  exitAlert,
  removeAndroidBackButtonHandler
} from './BackHandler';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    const datasource = require("./manuals.json");
    const defaultImage = require("./img/defaultImage.json");

    this.state = {
      isOpen: false,
      selectedItem: '',
      loaded: false,
      datasource: datasource,
      preferences: false,
      info: false,
      edit: false,
      sortType: 1,
      defaultImage: defaultImage.default_image
    };

    AsyncStorage.getItem('sortType').then(asyncStorageRes => {
      this.setState({
        sortType: asyncStorageRes
      });
    });

  }

  componentDidMount() {
    handleAndroidBackButton(exitAlert);
  }
  componentWillUnmount() {
    removeAndroidBackButtonHandler();
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
      preferences: false,
      info: false,
      edit: false
    });
  };

  onPrefrencesClicked = () => {
    this.setState({
      isOpen: false,
      preferences: true,
      loaded: false,
      info: false
    })
  };
  onInfoClicked = () => {
    this.setState({
      isOpen: false,
      preferences: false,
      loaded: false,
      info: true,
      edit: false
    })
  };

  onEditClicked = () => {
    this.setState({
      isOpen: false,
      preferences: false,
      loaded: false,
      info: false,
      edit: true
    })
  };

  onSavePrefs = () => {
    this.setState({
      isOpen: false,
      preferences: false,
      loaded: false,
    });

    AsyncStorage.getItem('sortType').then(asyncStorageRes => {
      this.setState({sortType: asyncStorageRes});
    })

  };

  render() {
    const menu = <Menu datasource={this.state.datasource}
                       onItemSelected={this.onMenuItemSelected}
                       onPreferencesSelect={this.onPrefrencesClicked}
                       onInfoSelect={this.onInfoClicked}
                       onEditSelect={this.onEditClicked}
                       savePrefs={this.onSavePrefs}
                       sortType={this.state.sortType}
    />;

    return (
        <SideMenu menu={menu} isOpen={this.state.isOpen}
                  onChange={isOpen => this.updateMenuState(isOpen)}>
          <ContentView
              datasource={this.state.datasource}
              loaded={this.state.loaded}
              selectedItem={this.state.selectedItem}
              preferences={this.state.preferences}
              info={this.state.info}
              edit={this.state.edit}
              defaultImage={this.state.defaultImage}
              onSavePrefs={this.onSavePrefs}/>
        </SideMenu>
    );
  }
}

export class ContentView extends Component {

  constructor(props) {
    super(props);

    this.state = {

      pdfPath: '',
      enablePdfPath: false,
      image: '',
      sortType: '1'
    };

    this.retrieveData();
    this.retrieveImage();

  }

  render() {
    return this.conditionalRender()
  }

  conditionalRender() {
    if (this.props.preferences) {
      return this.renderPreferences()
    }

    if (this.props.info) {
      return ContentView.renderInfo();
    }

    if (this.props.edit) {
      return this.renderEdit();
    }

    if (this.props.loaded) {
      return this.renderPdf(this.props.selectedItem);
    } else {
      return this.renderDiscalimer();
    }
  }

  renderHeader = () => {
    return (<View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      backgroundColor: '#FFF',
      width: "100%",
      padding: 10
    }}>
      <Text onPress={() => alert("save json")}><Icon
          name={"md-save"} size={32}/></Text>
      <Text onPress={() => alert("clear json")}><Icon
          name={"md-trash"} size={32}/></Text>
      <Text onPress={() => alert("restore defailt json")}><Icon
          name={"md-funnel"} size={32}/></Text>
      <Text onPress={() => alert("download json")}><Icon
          name={"md-download"} size={32}/></Text>
    </View>)
  }

  renderSeparator = () => {
    return (
        <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
        />
    );
  };

  renderEdit() {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>EDIT MANUALS LIST</Text>
          <ScrollView>
            <FlatList
                data={this.props.datasource}
                renderItem={({item}) => (
                    <ListItem
                        title={item.key}
                        subtitle={`${item.url}${item.fileName}`}
                    />
                )}
                enableEmptySections={true}
                style={{marginTop: 10}}
                ListHeaderComponent={this.renderHeader}
                ItemSeparatorComponent={this.renderSeparator}
            />
          </ScrollView>


        </View>
    )
  }

  static renderInfo() {
    return (<View style={styles.container}>

      <Text style={styles.text}>Modular Manuals</Text>
      <Text style={styles.text}>version 0.2.4</Text>
      <Text/>
      <Text style={styles.text}>mebitek@gmail.com</Text>
      <Text style={styles.text}>http://www.mebitek.com</Text>
      <Text/>

    </View>)
  }

  renderPreferences() {
    let width = Dimensions.get("window").width - 20;

    return (
        <View style={styles.container}>
          <CheckBox
              style={{width: width, color: "#000", backgroundColor: "#FFF"}}
              title={"Enable Load from FS"}
              checked={this.state.enablePdfPath}
              onPress={() => this.setState(
                  {enablePdfPath: !this.state.enablePdfPath})}/>

          {this.state.enablePdfPath &&
          <View>
            <Text style={styles.text}>Pdf File Path</Text>
            <TextInput
                style={{width: width, color: "#000", backgroundColor: "#FFF"}}
                value={this.state.pdfPath}
                onChangeText={text => this.onChangePrefs(text)}/>
          </View>
          }
          <View>
            <Text style={styles.text}>Sort Type</Text>
            <Picker style={{
              height: 50,
              width: width,
              backgroundColor: "#FFF",
              color: '#000'
            }}

                    selectedValue={this.state.sortType}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({
                          sortType: itemValue
                        })
                    }>
              <Picker.Item label="Alphabetical" value="1"/>
              <Picker.Item label="Shuffle" value="2"/>
            </Picker>
          </View>
          <Text style={styles.text} onPress={this.storeData}>OK</Text>
        </View>
    )

  }

  onChangePrefs = (text: string) => {
    this.setState({pdfPath: text})

  };

  storeData = () => {
    try {
      AsyncStorage.setItem("pdfPath", this.state.pdfPath).then(() => {
        this.setState({
          pdfPath: this.state.pdfPath.endsWith("/") ? this.state.pdfPath
              : this.state.pdfPath + "/"
        });
      });
      AsyncStorage.setItem("enablePdfPath",
          JSON.stringify(this.state.enablePdfPath)).then(() => {
        this.setState({
          enablePdfPath: this.state.enablePdfPath
        });
      });
      AsyncStorage.setItem("sortType", this.state.sortType).then(() => {
        this.setState({
          sortType: this.state.sortType
        });
      });
      this.props.onSavePrefs()

    } catch (error) {
      alert(error)
    }
  };

  storeImage = () => {
    AsyncStorage.setItem("image", this.state.image).then(() => {
      this.setState({
        image: this.state.image
      });
    });
  };

  retrieveImage = async () => {
    await AsyncStorage.getItem('image').then(asyncStorageRes => {
      if (asyncStorageRes === null) {
        asyncStorageRes = this.props.defaultImage
      }
      this.setState({
        image: asyncStorageRes
      });
    });
  };

  retrieveData = async () => {
    try {

      await AsyncStorage.getItem('enablePdfPath').then(asyncStorageRes => {
        this.setState({
          enablePdfPath: JSON.parse(asyncStorageRes)
        });
      });

      await AsyncStorage.getItem('pdfPath').then(asyncStorageRes => {
        this.setState({
          pdfPath: asyncStorageRes
        });

      });
      await AsyncStorage.getItem('sortType').then(asyncStorageRes => {
        this.setState({
          sortType: asyncStorageRes
        });

      });

    } catch (error) {
      return "ERROR"
    }
  };

  renderDiscalimer() {

    let width = Dimensions.get("window").width - 20;
    let height = Dimensions.get("window").height - 20;

    return (
        <View style={styles.container}>
          <Text style={styles.text}>Mebitek Modular System</Text>
          <Text style={styles.text}>Manual References</Text>

          <PhotoUpload
              onPhotoSelect={avatar => {
                if (avatar) {
                  this.setState({image: avatar});
                  this.storeImage()
                }
              }}
          >
            <Image
                style={{
                  flex: 1,
                  width: width,
                  height: height,
                }}
                resizeMode='contain'
                source={{
                  uri: this.state.image.startsWith("http") ? this.state.image
                      : "data:image/png;base64," + this.state.image
                }}
            />
          </PhotoUpload>

          <Text style={styles.text}>
            <Icon name={"md-arrow-back"}/>Select a manual from the sidebar menu
          </Text>
        </View>
    )
  }

  renderPdf(item) {

    let source = '';
    if (this.state.enablePdfPath) {
      source = {uri: "file://" + this.state.pdfPath + item.fileName}
    } else {
      source = {uri: item.url + item.fileName, cache: true};
    }
    if (item.type === 'int') {
      source = {uri: "bundle-assets:" + item.url + item.fileName}
    }

    return (
        <View style={styles.container}>
          <Pdf
              key={item.key}
              source={source}
              style={styles.pdf}
              onError={(error)=>{
                alert(error);
              }}


          />
        </View>
    )
  }
}

export class Menu extends Component {

  constructor(props) {
    super(props);

    this.arrayholder = props.datasource;

    this.state = {
      text: "",
      datasource: this.arrayholder,
      sortType: props.sortType
    };
  }

  searchFilterFunction = (text: string) => {
    const newData = this.arrayholder.filter(function (item) {
      const itemData = item.key.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      datasource: newData,
      text: text
    });
  };

  componentDidUpdate() {
    if (this.state.sortType !== this.props.sortType) {
      this.setState({sortType: this.props.sortType})
    }
  }

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
          <ScrollView scrollsToTop={false}>
            <FlatList
                data={this.props.sortType === "1" ? this.state.datasource.sort(
                    (a, b) => a.key.localeCompare(b.key))
                    : this.shuffle(this.state.datasource)}
                renderItem={({item}) => (
                    <Text onPress={() => this.props.onItemSelected(item)}
                          style={styles.item}>{item.key}</Text>
                )}
                enableEmptySections={true}
                style={{marginTop: 10}}

            />
          </ScrollView>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
            <Text onPress={() => this.props.onPreferencesSelect()}><Icon
                name={"md-settings"} size={32}/></Text>
            <Text onPress={() => {/*this.props.onEditSelect()*/}}><Icon
                name={"md-create"} size={32}/></Text>
            <Text onPress={() => this.props.onInfoSelect()}><Icon
                name={"md-information-circle"} size={32}/></Text>
          </View>
        </View>)
  }

  shuffle(array) {

    if (this.state.sortType === this.props.sortType) {
      return array;
    }

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
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  onPreferencesSelect: PropTypes.func.isRequired,
  onInfoSelect: PropTypes.func.isRequired,
  onEditSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  containerTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
