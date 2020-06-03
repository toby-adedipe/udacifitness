import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform} from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciStepper from './UdaciStepper';
import UdaciSlider from './UdaciSlider';
import DateHeader from './DateHeader'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { getDailyReminderValue } from '../utils/helpers';
import { addEntry, receiveEntries } from '../actions'
import { white, purple } from '../utils/colors';

function SubmitBtn ({ onPress }){
    return(
        <TouchableOpacity
            onPress = {onPress}
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
        >
            <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
      }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)
    
        this.setState((state) => {
          const count = state[metric] + step
    
          return {
            ...state,
            [metric]: count > max ? max : count,
          }
        })
      }
    decrement = (metric)=>{
        this.setState((state)=>{
            const count = state[metric] - getMetricMetaInfo.step

            return {
                ...state,
                [metric]: count < 0 ? 0 :count
            }
        })
    }

    slide = (metric, value)=>{
        this.setState(()=>({
            [metric]:value,
        }))
    }

    submit = ()=>{
        const key = timeToString()
        const entry = this.state

        
        this.props.dispatch(addEntry({
            [key]: entry
        }))

        this.setState(()=>({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }))

        //navigte to home

        submitEntry({ key, entry})

        //clear notification
    }
    reset= ()=>{
        const key = timeToString()

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        //Route to Home

        removeEntry({key})
    }
    render(){
        const metaInfo = getMetricMetaInfo()

        if (this.props.alreadyLogged) {
            return (
              <View style={styles.center}>
                <Ionicons name={Platform.OS === 'ios' ? "ios-happy" : 'md-happy'} size={100} />
                <Text>You already logged your information for today.</Text>
                <TextButton style={{padding: 10}} onPress={this.reset}>
                    Reset
                </TextButton>
              </View>
            );
          }
        return(
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {Object.keys(metaInfo).map((key)=>{
                    const { getIcon, type, ...rest} =  metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View key = {key} style={styles.row}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value)=> this.slide(key, value)}
                                    {...rest}
                                    />
                                : <UdaciStepper
                                    value={value}
                                    onIncrement={()=>this.increment(key)}
                                    onDecrement={()=>this.decrement(key)}
                                    {...rest}
                                    />
                            }
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        paddingTop: 40,
        backgroundColor: white,
    },
    row:{
        flexDirection: "row",
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',

    },
    submitBtnText:{
        color: white,
        fontSize: 22,
        textAlign: 'center',
    },
    center: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginRight: 30,
       marginLeft: 30, 
    }
})

function mapStateToProps (state){
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)