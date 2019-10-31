import React, { useState } from "react";
import './Home.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { DatePicker, Modal } from 'react-rainbow-components';
import { Line } from 'react-chartjs-2';
import P5Wrapper from 'react-p5-wrapper';
import Particles from 'react-particles-js';
import particlesParams from 'globals/particles-config.js';
import treeImage from './../../assets/tree.jpg';

import {
  Card
} from 'app/containers';

import sketch from 'app/sketches/sketch.js';

function Home() {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

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
      <div className="home-layout">
        <div className="home-header"> 
          <h1>
            Anteater Hydroponics
          </h1>
          <p>
            IoT Project by Lasse Nordahl and Jesse Chong
          </p>
        </div>
        <div className="home-animated-tree flex-center">
          <P5Wrapper sketch={sketch}></P5Wrapper>
          {/* <img src={treeImage}></img> */}
          <h2>
            Tomato Plant
          </h2>
          <FontAwesomeIcon 
            icon={faCog}
            onClick={() => setSettingsPanelOpen(true)}
          ></FontAwesomeIcon>
          <div className="half-circle"></div>
        </div>
        <div className="home-filtering flex-center">
          <DatePicker
            label="From"
          >

          </DatePicker>
          <DatePicker
            label="To"
          >

          </DatePicker>
        </div>
        <div className="home-card-layout">
          <div>
            <Card className="graph-card" title="Light Sensor">
              <Line data={data}/>
            </Card>
          </div>
          <div>
            <Card className="graph-card" title="Humidity Sensor">
              <Line data={data}/>
            </Card>
          </div>
          <div>
            <Card className="graph-card" title="Water Levels">
              <Line data={data}/>
            </Card>
          </div>
          <div>
            <Card className="graph-card" title="Temperature Sensor">
              <Line data={data}/>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        size="large"
        title="Anteater Hydroponics Settings"
        isOpen={settingsPanelOpen}
        onRequestClose={() => setSettingsPanelOpen(false)}   
      >
          hay baby
      </Modal>
    </div>
  );
}

export default Home;
