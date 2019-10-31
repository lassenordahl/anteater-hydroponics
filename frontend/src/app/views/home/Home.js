import React from "react";
import './Home.scss';

import Particles from 'react-particles-js';
import particlesParams from 'globals/particles-config.js';
import treeImage from './../../assets/tree.jpg';

import {
  Card
} from 'app/containers';

function Home() {
  return (
    <div className="Home">
      <div className="home-particles-container">
        <Particles 
          className="home-particles" 
          style={{
            'width': '100%',
            'height': '100%'
          }} 
          params={particlesParams}
        />
      </div>
      <div className="home-header flex-center"> 
        <h1>
          Anteater Hydroponics
        </h1>
        <p>
          Lasse Nordahl and Jesse Chong
        </p>
      </div>
      <div className="home-animated-tree flex-center">
        <img src={treeImage}></img>
        haha this is a tree 
      </div>
      <div className="home-filtering flex-center">
        This is where the date filtering will go
      </div>
      <div className="home-layout">
        <div>
          <Card>

          </Card>
        </div>
        <div>
          <Card>

          </Card>
        </div>
        <div>
          <Card>

          </Card>
        </div>
        <div>
          <Card>

          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
