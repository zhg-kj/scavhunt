import React, {Component} from 'react';
import Lottie from 'react-lottie';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

import './detector.css';
import '../animations.css'

import * as confettiData from '../assets/confetti.json';

class Detector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      list: ['person','laptop','scissors','mouse', 'spoon', 'keyboard',],
      isStopped: true,
    }
  } 
  videoRef = React.createRef();

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        })
        .then(stream => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.checkPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };

  checkPredictions = predictions => {
    predictions.forEach(prediction => {
      if(prediction.class === this.state.list[0]) {
        const tempL = this.state.list;
        const tempC = this.state.count + 1;
        tempL.shift();
        this.setState({list: tempL, count: tempC, isStopped: false});
      }
    });
  };

  render() {

    const defaultOptions = {
      loop: false,
      autoplay: false, 
      animationData: confettiData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <div>
        <Lottie options={defaultOptions}
                width='100vw'
                height={500}
                isStopped={this.state.isStopped}
                eventListeners={[
                  {
                    eventName: 'complete',
                    callback: () => this.setState({isStopped:true}),
                  },
                ]}
                isClickToPauseDisabled={true}/>
        <div className='display'>
          <div className='texts'>
            <h1 className='static'><i>FIND A</i></h1>
            <h1 className='target splat' key={this.state.count}>{this.state.list[0].toUpperCase()}</h1>
          </div>
        </div>
        <div className='score'>
          <h1 className='scoreT'>SCORE: {this.state.count}</h1>
        </div>
        <video
          className="feed"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
        />
      </div>
    );
  }
}

export default Detector;
