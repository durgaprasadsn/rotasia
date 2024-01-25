import React, { useState, useEffect } from 'react';
import NavbarSimple from '../components/Navbar';
import SelectBasic from '../components/DropDown';
import { auth, db } from '../services/firebase';
import { onValue, ref, update } from '@firebase/database';
import Input from '../components/Input';
import { Button } from '@mui/material';
import { Alert } from '@mui/material';

const Register = () => {
    // State to store the fetched data
    const [data, setData] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
      // Fetch data from the database
      const reference = ref(db, '/dates');
      onValue(reference, (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
      });
    }, []);
  

    const finalData = {};
    useEffect(() => {
      const reference = ref(db, '/delegates');
      onValue(reference, (snapshot) => {
        const fetchedData = snapshot.val();
        if (fetchedData) {
          const summaryData = {};

          // Loop through each user
          Object.keys(fetchedData).forEach((user) => {
            // Loop through each date for the user
            console.log("User " + JSON.stringify(user));
            Object.keys(fetchedData[user]).forEach((key) => {
              const value = fetchedData[user][key];
              // console.log("Check the split " + key.split("-").length);
              if ((key.split("-")).length > 1) {
                summaryData.key = summaryData.key || { };
                console.log("Date " + key);
                Object.keys(fetchedData[user][key]).forEach((temp) => {
                  if (temp == "food") {
                    summaryData.key.food = summaryData.key.food || { breakfast: 0, lunch: 0, dinner: 0 };
                    Object.keys(fetchedData[user][key][temp]).forEach((foodCategory) => {
                      console.log("Category " + foodCategory);
                      summaryData.key.food[foodCategory] += fetchedData[user][key][temp][foodCategory] === 'Yes' ? 1 : 0;
                    })
                  } else if (temp == "checkedin") {
                    summaryData.checkedin = (summaryData.checkedin || 0) + 1;
                  }
                });
              } else if (key == "logistics"){
                console.log("Logs" + key + " " + value);
                // Update summary for logistics
                if (fetchedData[user][key] =="Yes") {
                  summaryData.logistics = (summaryData.logistics || 0) + 1;
                }
                
                // Update summary for checkedin
                // summaryData.checkedin = (summaryData.checkedin || 0) + (value.checkedin === 'Yes' ? 1 : 0);
              }
              console.log("Summary " + JSON.stringify(summaryData));
              // Update summary for each food category
              // Object.keys(value.food).forEach((foodCategory) => {
              //   summaryData.food[foodCategory] += value.food[foodCategory] === 'Yes' ? 1 : 0;
              // });
            });
          });
        }
      });
    })

    const dates = Object.keys(data);
  
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };
    
  return (<>
      <NavbarSimple />
      {/* Dropdown to select a project */}
      {/* <SelectBasic
        options={projects}
        onChange={handleProjectSelect}
        value={selectedProject}
        labelKey="projectName"
      /> */}

      <div>
      <label htmlFor="dateSelector">Select a Date:</label>
      <select id="dateSelector" onChange={handleDateChange}>
        <option value="">Select a date</option>
        {dates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      {selectedDate && (
        <div>
          <p>Date: {selectedDate}</p>
          <p>Checked In: "Checkiin"</p>
          <p>Name: "Name"</p>
          {/* Add more details based on your structure */}
        </div>
      )}
    </div>
      </>
  );
};

export default Register;