import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import { Container, Content, List, ListItem, Text, Item, Input, Header, Body, Title, Icon, Button, Toast } from 'native-base';

const RNFS = require('react-native-fs');
const FileOpener = require('react-native-file-opener');

export default class FindFile extends Component {

  ItemCache = null;

  constructor() {

    const folderPath = RNFS.ExternalStorageDirectoryPath + '/PdfData'
    let items = [];

    this.state = {
      load: false,
      items: [],
      search: null
    };

    RNFS.readDir(folderPath).then(info => {
      this.setState({ file: JSON.stringify(info) });
      info.forEach(function (element) {
        if (element.isFile() && element.path.indexOf(".pdf") > -1) {
          items.push(element);
        }
      }, this);

      this.setState({ items: items, load: true });
      this.ItemCache = items;
    });
  }

  openPdf(path) {
    FileOpener.open(
      path,
      'application/pdf'
    ).then(() => { }, (e) => {

       Toast.show({
              supportedOrientations: ['potrait','landscape'],
              text: 'Dosya Açılamadı.',
              position: 'center',
              buttonText: 'Tamam',
              type:'danger'
            })
    });
  }

  search(search) {
    var foundItems = this.ItemCache.filter(function (el) {
      if (el.name.toLowerCase().search(search.text) > -1)
        return el;
    });
    this.setState({ items: foundItems });
  }

  render() {
    if (this.state.load) {
      return (
        <Container>
          <Header>
            <Body>
              <Title>Find File</Title>
            </Body>
          </Header>
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input onChangeText={(text) => this.search({ text })} placeholder='Ara' />
            </Item>
          </Header>

          <Content>
            <List dataArray={this.state.items}
              renderRow={(item) =>
                <ListItem onPress={() => { this.openPdf(item.path) }}>
                  <Text>{item.name}</Text>
                </ListItem>
              }>
            </List>
          </Content>
        </Container>
      )
    }
    else {
      return (<Text>Loading...</Text>)
    }
  }
}

AppRegistry.registerComponent('FindFile', () => FindFile);