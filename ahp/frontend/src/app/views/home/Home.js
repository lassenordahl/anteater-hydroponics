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
    endpoint: "light"
  },
  {
    title: "Humidity Sensor",
    endpoint: "humidity"
  },
  {
    title: "Water Levels",
    endpoint: "water"
  },
  {
    title: "Temperature Sensor",
    endpoint: "temperature"
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
          {dataCards.map(function(dataCard) {
            return (
              <div>
                <DataCard 
                  plant={plant}
                  title={dataCard.title} 
                  endpoint={dataCard.endpoint}
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
