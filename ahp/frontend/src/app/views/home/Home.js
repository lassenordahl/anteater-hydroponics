import React, { useState, useEffect } from "react";
import './Home.scss';

import { DatePicker, Modal } from 'react-rainbow-components';
import Particles from 'react-particles-js';
import axios from "axios";
import particlesParams from 'globals/particles-config.js';
import ahp_logo from './../../assets/ahp_logo.png';

import {
  PlantInfo,
  DataCard
} from 'app/components';

const dataCards = [
  {
    title: "Light Sensor",
    endpoint: "light",
    color: {
      r: 255,
      g: 155,
      b: 41
    }
  },
  {
    title: "Humidity Sensor",
    endpoint: "humidity",
    color: {
      r: 109,
      g: 222,
      b: 216
    }
  },
  {
    title: "Water Levels",
    endpoint: "water",
    color: {
      r: 3,
      g: 165,
      b: 252
    }
  },
  {
    title: "Temperature Sensor",
    endpoint: "temperature",
    color: {
      r: 242,
      g: 70,
      b: 70
    }
  }
]


function Home(props) {

  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    let plantId = + props.match.params.plantId;
    getPlant(plantId);
  }, []);

  function getPlant(plantId) {
    axios.get('/api/plant/' + plantId) 
    .then(function (response){
      setPlant(response.data);
      getPlantData(plantId);
    })
    .catch(function (error){
      console.log(error);
    });
  }

  function getPlantData(plantId) {

  }

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
          <img src={ahp_logo}></img>
          <div>
            <h1>
              Anteater Hydroponics
            </h1>
            <p>
              IoT Project by Lasse Nordahl and Jesse Chong
            </p>
          </div>
        </div>
        <div className="home-animated-tree flex-center">
          <PlantInfo 
            plant={plant}
            setSettingsPanelOpen={setSettingsPanelOpen}
          ></PlantInfo>
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
          {dataCards.map(function(dataCard, index) {
            return (
              <div key={index}>
                <DataCard 
                  plant={plant}
                  title={dataCard.title} 
                  endpoint={dataCard.endpoint}
                  color={dataCard.color}
                ></DataCard>
              </div>
            );
          })}
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
