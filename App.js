import * as React from 'react'
import {  View } from 'react-native'
import AddEntry from './components/AddEntry';
import { Provider } from 'react-redux'
import reducer from './reducers'
import {createStore} from 'redux'
import History from './components/History';

export default function App() {
  return (
    <Provider store={ createStore(reducer) }>
      <View style={{flex: 1}}>
        <History />
      </View>
    </Provider>
  );
}

