import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image } from 'react-native';
import firebase from './firebase';

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+639',
      confirmResult: null,
      loggedIn: null 
    };
  }

  componentDidMount() {
    //   firebase.initializeApp({
    //         apiKey: "AIzaSyC8JTU-B6osMdrLbLAoaE04Wxim6hiwGkI",
    //         authDomain: "test-ef9b2.firebaseapp.com",
    //         databaseURL: "https://test-ef9b2.firebaseio.com",
    //         projectId: "test-ef9b2",
    //         storageBucket: "test-ef9b2.appspot.com",
    //         messagingSenderId: "992146345978"
    //     });

    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+639',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }
      
      ));console.log('response', );
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 50, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#78a1e2', color: '#fff', height: 40 }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult, codeInput } = this.state;
    
    return (
        <View>
            <View>
                {this.renderMessage()}
            </View>

            <View >
                {!user && !confirmResult && this.renderPhoneNumberInput()}
            </View>

            <View>
                 {/*{!user && confirmResult && */}
                <View style={{ marginTop: 25, padding: 25 }}>
                        <Text>Enter verification code below:</Text>
                    <TextInput
                        autoFocus
                        style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                        onChangeText={value => this.setState({ codeInput: value })}
                        placeholder={'Code ... '}
                        value={codeInput}
                    />
                    <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
                </View>
                {/*//}*/}
            </View>

            <View>
               
                    <View
                        style={{
                        padding: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#77dd77',
                        }}
                    >
                            <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
                            <Text style={{ fontSize: 25 }}>Signed In!</Text>
                            <Text>{JSON.stringify(user)}</Text>
                        <Button title="Sign Out" color="red" onPress={this.signOut} />
                    </View>
             
            </View>
        </View>
        );
    }
}