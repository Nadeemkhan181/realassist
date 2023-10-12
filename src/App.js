import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import "./App.css"
import moment from 'moment/moment';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const chartRef = React.createRef();

  // useEffect(() => {
  //   // Fetch data when the component mounts
  //   fetchDataFromAPI();
  // }, []);

  const fetchDataFromAPI = async () => {
    try {
      // Make an API request and get data
      
      axios.get('https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv')
        .then((apiData) => {
          // Set the data in the state
          setData(apiData.data);
         

          // Create a line chart
          const chartCanvas = chartRef.current;

          if (chartCanvas) {
          const chartContext = chartCanvas.getContext('2d');

          new Chart(chartContext, {
            type: 'line',
            data: {
              labels: apiData.data.data.map((data) => data.data_year),
              datasets: [
                {
                  label: 'Burglary',
                  data: apiData.data.data.map((data) => data.Burglary),
                  borderColor: 'blue',
                },
              ],
            },
            options: {
              animation: {
                onComplete: () => {
                  // The chart has been fully rendered, now capture the canvas as an image
                  const chartDataURL = chartCanvas.toDataURL('image/png');
                  const pdf = new jsPDF();
                  pdf.addImage(chartDataURL, 'PNG', 10, 10, 190, 100);
                  pdf.save('chart.pdf');
                },
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Arrests',
                  },
                },
              },
            },
          });
        }
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <div className="centered-container">
        <button className="styled-button" onClick={fetchDataFromAPI}>Print</button>
      </div>
      <div className='outer-div' >
    <h4>Burglary</h4>
      <canvas className="inner-div" ref={chartRef} width={400} height={200}></canvas>
      <div class="footer">
     
     <h4 className="left">Report generated on {moment().format('MMMM Do YYYY')}</h4>

     </div>    
     </div>
    </div>
  );
};

export default App;
