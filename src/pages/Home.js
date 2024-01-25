import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import QrScanner from 'react-qr-scanner';
import NavbarSimple from '../components/Navbar';
import dayjs from 'dayjs';
import { insert } from '../services/authService';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ref, onValue, update } from '@firebase/database';
import { auth, db } from '../services/firebase';
import { data } from 'autoprefixer';
import { CurrencyExchange } from '@mui/icons-material';

const Home = () => {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [operationType, setOperationType] = useState(null);
  const [nameFromDB, setNameFromDB] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState(''); // Initial selected option
  const [valid, setValid] = useState(false);
  const [data, setData] = useState(null);
  const [foodValid, setFoodValid] =useState(true);
  const [foodItemList, setFoodItemList] = useState(null);
 
  const handleOpen = () => setOpen(!open);

  const stopScanning = useCallback(() => {
    setScanning(false);
    // Perform any additional cleanup or actions if needed
  }, [setScanning]);

  const startScanning = useCallback(
    (type) => {
      setOperationType(type);
      console.log("Operation Type here " + type);
      setScanning(true);
    },
    [setOperationType, setScanning]
  );

  console.log(dayjs().format('DD-MM-YYYY'));
  const curr_date = dayjs().format('DD-MM-YYYY');
  const errorText = "Something is Wrong";
  const notFound = "User not found";
  const fetchNameFromDB = useCallback(() => {
    if (result && operationType) {
      const reference = ref(db, "delegates/" + result.text);
      onValue(reference, (snapshot) => {
        const dataFromDB = snapshot.val();
        if (!!dataFromDB) {
          setData(dataFromDB);
          // console.log("Name from DB:", dataFromDB.name);
          const ret_dates = Object.keys(dataFromDB);
          // console.log("Check " + ret_dates + " " + typeof(ret_dates));
          const ret_date = ret_dates.includes(curr_date) ?  curr_date : null;
          // console.log("Temp check " + ret_date);
          
          if (ret_date && ret_date == curr_date) {
            // console.log("Today is correct" + operationType);
            if (operationType === "Checkin") {
              if (dataFromDB[ret_date].checkedin === "No") {
                // Update the checkin details
                setNameFromDB(dataFromDB.name);
                setValid(true);
              } else {
                setNameFromDB(dataFromDB.name + " already checkedin");
              }
            } else if (operationType === "Food") {
              // Food operation has to be performed
              console.log("Food validate " + JSON.stringify(dataFromDB[ret_date].food) +  " " + Object.keys(dataFromDB[ret_date].food));
              const food_data = dataFromDB[ret_date].food;
              let original = ["breakfast", "lunch", "dinner"];

              for (let i = original.length - 1; i >= 0; i--) {
                console.log("Check value " + food_data[original[i]] + " " + original[i]);
                  if (food_data[original[i]] == "Yes") {
                      original.splice(i, 1);
                  }
              }

              setFoodItemList(original);
              if (original.length > 0) {
                setNameFromDB(dataFromDB.name);
                setValid(true);
              } else {
                setNameFromDB(dataFromDB.name + " Food is already Served");
              }
              
            } else if (operationType === "Logistics") {
              // Logistics operation has to be performed
              if (dataFromDB[ret_date].logistics === "No") {
                setNameFromDB(dataFromDB.name);
                setValid(true);
              } else {
                setNameFromDB(dataFromDB.name + " already received");
              }
            }
          } else {
            console.log("Today is not correct");
            setNameFromDB(errorText);
          }
        } else {
          console.log("Data not found");
          setNameFromDB(null); // Set name to null if data is not found
        }
      });
    } else {
      console.log("Result or operationType is not available");
      setNameFromDB(null);
    }
  }, [result, operationType]);

  const handleOperation = useCallback(() => {
    fetchNameFromDB();
  }, [fetchNameFromDB]);

  useEffect(() => {
    fetchNameFromDB();
  }, [result, operationType, fetchNameFromDB]);

  const handleError = useCallback(() => {

  });

  const handleScan = useCallback(
    (data) => {
      if (data) {
        setResult(data);
        console.log("Operation Type " + operationType);
        stopScanning();
        handleOperation();
        // setUserSelection(null);
        
      }
    },
    [operationType, stopScanning, handleOperation]
  );

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    // console.log("Value after change " + selectedOption + event.target.value);
    // console.log("Data " + JSON.stringify(data) +  curr_date);
  };

  const handleConfirmSelection = () => {
    console.log("Check the values " + result.text + " " + operationType + " " + valid);
    if (valid) {
      if (operationType === "Food") {
        handleFoodOperation(result.text);
      } else if (operationType === "Checkin") {
        handleCheckinOperation(result.text);
      } else if(operationType === "Logistics") {
        handleLogsOperation(result.text);
      }
    }
    setResult(null);
    setNameFromDB(null);
    setValid(false);
    setSelectedOption('');
  }

  const handleLogsOperation = (userid) => {
    const path_update = "delegates/" + userid + "/";

    const updates = {"logistics" : "Yes"};
    console.log(updates);
    update(ref(db, path_update), updates).then( () => {
      console.log("SUCCESS");
    } ) .catch((error) => {
      console.log(error);
    } )    
  }

  const handleFoodOperation = (userid) => {
    const path_update = "delegates/" + userid + "/" + curr_date + "/food/";
    console.log("Food check " + selectedOption);

    const updates = {[selectedOption] : "Yes"};
    console.log(updates);
    update(ref(db, path_update), updates).then( () => {
        console.log("SUCCESS");
      } ) .catch((error) => {
        console.log(error);
      } )
  }

  const handleCheckinOperation = (userid) => {
    // const updates = {}
    const path_update = "delegates/" + userid + "/" + curr_date + "/";
    console.log("Check the path " + path_update);
    const updates = {"checkedin": "Yes"};

    update(ref(db, path_update), updates).then( () => {
        console.log("SUCCESS");
      } ) .catch((error) => {
        console.log(error);
      } )
  }

  const handleCancelSelection = () => {
    setResult(null);
    setNameFromDB(null);
    setValid(false);
  }

  // useEffect((selectedOption) => {
  //   console.log(selectedOption);
  // }, selectedOption);
  

  return (
    <div>
        <NavbarSimple />
      {scanning ? (
        <div className='flex flex-col items-center p-3'>
            <QrScanner onScan={handleScan} onError={handleError} constraints={{
            audio: false,
            video: { facingMode: "environment" }
            }}/>
            <div className='flex justify-center p-3'>
            <Button id="stop_scanning" type="submit" variant="contained" onClick={stopScanning}>
                Stop Scanning
            </Button>
            </div>
        </div>
      ) : (
        <>
        {/* {result ? (<> 
            <p>{result ? JSON.stringify(result.text) + `${operationType}` : 'No result'}</p> 
            </>) : (<> </>)} */}
        {/* <p>Click a button to start scanning</p> */}
        {(!scanning && result) ? (<>
          <Dialog open={true} handler={handleOpen} className="max-w-lg mx-auto">
            <div className='flex flex-col items-center p-3'>
              <DialogHeader>Delegate Status</DialogHeader>
              <DialogBody>
                {nameFromDB ? (<>
                      <p>{nameFromDB}</p> 
                      {(operationType === "Food" &&
                      // <RadioGroup
                      //   aria-label="options"
                      //   name="options"
                      //   value={selectedOption}
                      //   onChange={handleOptionChange}>
                      //   <FormControlLabel value="breakfast" control={<Radio />} label="Breakfast" />
                      //   <FormControlLabel value="lunch" control={<Radio />} label="Lunch" />
                      //   <FormControlLabel value="dinner" control={<Radio />} label="Dinner" />
                      // </RadioGroup>

                      foodItemList) ? 
                      <RadioGroup
                        aria-label="options"
                        name="options"
                        value={selectedOption}
                        onChange={handleOptionChange}>
                      {foodItemList.map((item) => (
                        <FormControlLabel
                          key={item} // Replace with a unique identifier for each item
                          value={item}
                          control={<Radio />}
                          label={item}
                        />
                      ))}
                      </RadioGroup> : <></>
                    }
                    </>) : (
                      <p>Name not found in DB</p>
                    )}
                      
              </DialogBody>
            
              <DialogFooter className='flex items-center justify-center space-x-4 mt-30'>
              <Button id="btn" type="submit" variant="contained" size="small" className='mb-80' onClick={handleCancelSelection}>Cancel</Button>
              <Button id="btn"  type="submit" variant="contained" size="small" className='mb-80' onClick={handleConfirmSelection}>Confirm</Button>
              </DialogFooter>
            </div>
          </Dialog>
        </>) : (<>
          <div className='flex items-center justify-center space-x-4 mt-40'>
            <Button id="checkin" type="submit" variant="contained" className="mb-8" onClick={() => startScanning('Checkin')}>Checkin</Button>
            <Button id="food" type="submit" variant="contained" className='mb-8' onClick={() => startScanning('Food')}>Food</Button>
            <Button id="logistics" type="submit" variant="contained" onClick={() => startScanning('Logistics')}>Logistics</Button>
          </div>
        </>)}
        
        </>
      )}
      
    </div>
  );
};

export default Home;
