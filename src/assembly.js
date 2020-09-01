import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';

import Detector from './detector/detector.js';

class Assembly extends Component {
  render() {
    return(
      <div>
        {!isMobile ? (
          <Detector/>
        ) : (
          <div className='browser'>
            <h1 className='error'>THIS WEB-APP IS FOR MOBILE ONLY.</h1>
          </div>
        )}
      </div>
    )
  }
}

export default Assembly;
