import * as React from 'react'
import {  View } from 'react-native'
import AddEntry from './components/AddEntry';
import { Provider } from 'react-redux'
import reducer from './reducers'
import {createStore} from 'redux'

export default function App() {
  return (
    <Provider store={ createStore(reducer) }>
      <View style={{flex: 1}}>
        <AddEntry />
      </View>
    </Provider>
  );
}

