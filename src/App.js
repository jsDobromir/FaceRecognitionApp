import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Navigation/Logo/Logo.js';
import ImageLinkForm from './components/Navigation/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Navigation/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import 'tachyons';
import Clarifai from 'clarifai';
const app=new Clarifai.App({
  apiKey : '6a0aaac70a94480090bf77c582e9ea9b'
});

class App extends Component {

  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      box : {},
      route: 'signin',
      isSignedIn: false
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width = Number(image.width);
    const height =Number (image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box : box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    console.log(event.target.value);

  }

  onButtonSubmit= () =>{
    console.log("submitted");
    this.setState({imageUrl : this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange= (data) => {
    if(this.state.route === 'singout'){
      this.setState({isSignedIn: false});
    }else if(this.state.route==='home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route : data});
  }



  render() {
    return (
      <div className="App">
        <Navigation onRouteChange={this.onRouteChange}/>
        { this.state.route==='home ' ?
        <div>
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        : (
          this.state.route==='signin' ? <Signin onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange} />
        )
      }
      </div>
    );
  }
}

export default App;
