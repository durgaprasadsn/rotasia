import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
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
import { Alert } from '@mui/material';

import { ref, onValue, update } from '@firebase/database';
import { auth, db } from '../services/firebase';
import { data } from 'autoprefixer';
import { CurrencyExchange } from '@mui/icons-material';
import Login from '../components/Login';
import TextField from '@mui/material/TextField';

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
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
  const [delegateID, setDelegateID] = useState("");
 
  const handleOpen = () => setOpen(!open);
  const navigate = useNavigate()
    useEffect(() => {
        console.log("Chck auth " + window.localStorage.getItem("authenticated"));
        if (window.localStorage.getItem("authenticated") == "true") {
            navigate("/home");
        } else {
            navigate("/");
        }
    })
  const stopScanning = useCallback(() => {
    setScanning(false);
    // Perform any additional cleanup or actions if needed
    setSuccessAlertVisible(false);
  }, [setScanning]);

  const startScanning = useCallback(
    (type) => {
      setOperationType(type);
      console.log("Operation Type here " + type);
      setScanning(true);
    },
    [setOperationType, setScanning]
  );

  // var default_url = "https://script.google.com/macros/s/AKfycbwILDYl0_HJgMsybfYEY0f0KcvU3utj_bFOKiyjcl9BnnnsVRd7-HjkLbecYbk8pRLi/exec";
  // var default_url = "http://127.0.0.1:5000";
  var default_url = "https://flask-acb6o9jhe-durgaprasadsns-projects.vercel.app";

  console.log(dayjs().format('DD/MM/YYYY'));
  const curr_date = dayjs().format('DD/MM/YYYY');
  const errorText = "Something is Wrong";
  const notFound = "User not found";
  var day_selected = -1;
  var location = [['AI', 'AJ', 'AK', 'AL'], ['AM', 'AN', 'AO', 'AP'], ['AQ', 'AR', 'AS', 'AT'], ['AU', 'AV', 'AW', 'AX']];

  var userid_location = 'C';
  var logistics_location = 'AH';
  function create_get_url(date, userid) {
    // return default_url + '?date=' + date + '&name=' + userid;
    return default_url + '/get_user?date=' + date + '&name=' + userid;
  }

  function create_post_url(type, user, date) {
    // var url = default_url + '?user=' + user + '&date=' + date;
    var url = default_url + '/update_user?user=' + user + '&date=' + date;
    if (type === "Checkin") {
      url += "&checkedin=Yes";
    }
    if (type === "Food") {
      url += "&food_type=" + selectedOption;
    }
    if (type === "Logistics") {
      url += "&logistics=Yes";
    }
    return url;
  }

  function columnNameToIndex(columnName) {
    var index = 0;
    for (var i = 0; i < columnName.length; i++) {
        index = index * 26 + (columnName.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    console.log("Index here " + index);
    return index - 1; // Adjust index to be 0-based
  }

  const fetchNameFromDB = useCallback(() => {
    if (result && operationType) {
      const reference = ref(db, "delegates/" + result.text);
      console.log("String to get " + create_get_url(curr_date, result.text));
      fetch(create_get_url(curr_date, result.text))
        .then(response => response.json())
        .then(data => {
          console.log("data received " + JSON.stringify(data));
          if (data.success) {
            console.log("Sucess received");
            var selected = data.day;
            if (selected == 'Day1') {
              day_selected = 0;
            } else if (selected == 'Day2') {
              day_selected = 1;
            } else if (selected == 'Day3') {
              day_selected = 2;
            } else if (selected == 'Day4') {
              day_selected = 3;
            }
          } else {
            console.log("Failure received");
            setNameFromDB(null);
            return;
          }
          const dataFromDB = data.response;
          console.log("Check the status and data  " + operationType + " " + data.success + " " + dataFromDB);
          if (!!dataFromDB) {
            setData(dataFromDB);
            // console.log("Today is correct" + operationType);
            if (operationType === "Checkin") {
              let index = columnNameToIndex('AI');
              console.log("Durga check here " + index + " " + dataFromDB[index]);
              if (dataFromDB[columnNameToIndex(location[day_selected][0])] === "No") {
                // Update the checkin details
                console.log("Checked in is no");
                setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
                setValid(true);
              } else {
                console.log("Checkedin yes");
                setNameFromDB(dataFromDB[columnNameToIndex(userid_location)] + " already checkedin");
              }
            } else if (operationType === "Food") {
              // Food operation has to be performed
              // console.log("Food validate " + JSON.stringify(dataFromDB[ret_date].food) +  " " + Object.keys(dataFromDB[ret_date].food));
              const food_data = {};
              let original = ["breakfast", "lunch", "dinner"];
              
              for (let i = 0; i < original.length; i++) {
                food_data[original[i]] = dataFromDB[columnNameToIndex(location[day_selected][i+1])];
              }
              for (let i = original.length - 1; i >= 0; i--) {
                console.log("Check value " + food_data[original[i]] + " " + original[i]);
                  if (food_data[original[i]] == "Yes") {
                      original.splice(i, 1);
                  }
              }

              setFoodItemList(original);
              if (original.length > 0) {
                setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
                setValid(true);
              } else {
                setNameFromDB(dataFromDB[columnNameToIndex(userid_location)] + " Food is already Served");
              }
              
            } else if (operationType === "Logistics") {
              // Logistics operation has to be performed
              if (dataFromDB[columnNameToIndex(logistics_location)] === "No") {
                setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
                setValid(true);
              } else {
                setNameFromDB(dataFromDB[columnNameToIndex(userid_location)] + " already received");
              }
            }
          } else {
            console.log("Data not found");
            setNameFromDB(null); // Set name to null if data is not found
          }
        });
      // onValue(reference, (snapshot) => {
      //   const dataFromDB = snapshot.val();
      //   if (!!dataFromDB) {
      //     setData(dataFromDB);
      //     // console.log("Name from DB:", dataFromDB.name);
      //     const ret_dates = Object.keys(dataFromDB);
      //     // console.log("Check " + ret_dates + " " + typeof(ret_dates));
      //     const ret_date = ret_dates.includes(curr_date) ?  curr_date : null;
      //     // console.log("Temp check " + ret_date);
          
      //     if (ret_date && ret_date == curr_date) {
      //       // console.log("Today is correct" + operationType);
      //       if (operationType === "Checkin") {
      //         if (dataFromDB[ret_date].checkedin === "No") {
      //           // Update the checkin details
      //           setNameFromDB(dataFromDB.name);
      //           setValid(true);
      //         } else {
      //           setNameFromDB(dataFromDB.name + " already checkedin");
      //         }
      //       } else if (operationType === "Food") {
      //         // Food operation has to be performed
      //         console.log("Food validate " + JSON.stringify(dataFromDB[ret_date].food) +  " " + Object.keys(dataFromDB[ret_date].food));
      //         const food_data = dataFromDB[ret_date].food;
      //         let original = ["breakfast", "lunch", "dinner"];

      //         for (let i = original.length - 1; i >= 0; i--) {
      //           console.log("Check value " + food_data[original[i]] + " " + original[i]);
      //             if (food_data[original[i]] == "Yes") {
      //                 original.splice(i, 1);
      //             }
      //         }

      //         setFoodItemList(original);
      //         if (original.length > 0) {
      //           setNameFromDB(dataFromDB.name);
      //           setValid(true);
      //         } else {
      //           setNameFromDB(dataFromDB.name + " Food is already Served");
      //         }
              
      //       } else if (operationType === "Logistics") {
      //         // Logistics operation has to be performed
      //         if (dataFromDB[ret_date].logistics === "No") {
      //           setNameFromDB(dataFromDB.name);
      //           setValid(true);
      //         } else {
      //           setNameFromDB(dataFromDB.name + " already received");
      //         }
      //       }
      //     } else {
      //       console.log("Today is not correct");
      //       setNameFromDB(errorText);
      //     }
      //   } else {
      //     console.log("Data not found");
      //     setNameFromDB(null); // Set name to null if data is not found
      //   }
      // });
    } else {
      console.log("Result or operationType is not available");
      setNameFromDB(null);
    }
  }, [result, operationType]);

  const handleOperation = useCallback(() => {
    fetchNameFromDB();
    setSuccessAlertVisible(false);
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
        setSuccessAlertVisible(false);
        
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
    setSuccessAlertVisible(false);
  }

  const handleLogsOperation = (userid) => {
    const path_update = "delegates/" + userid + "/";

    const updates = {"logistics" : "Yes"};
    console.log(updates);
    fetch(create_post_url(operationType, userid, curr_date), {
      method: 'POST',
    }).then(response => response.json())
      .then(data => {
        // Do something with the data
        console.log("Post return " + data);
        if (data.success) {
          setSuccessAlertVisible(true);
        }
      });   
  }

  const handleFoodOperation = (userid) => {
    const path_update = "delegates/" + userid + "/" + curr_date + "/food/";
    console.log("Food check " + selectedOption);

    const updates = {[selectedOption] : "Yes"};
    console.log(updates);
    fetch(create_post_url(operationType, userid, curr_date), {
      method: 'POST',
    }).then(response => response.json())
      .then(data => {
        // Do something with the data
        console.log("Post return " + data);
        if (data.success) {
          setSuccessAlertVisible(true);
        }
      });
  }

  const handleCheckinOperation = (userid) => {
    // const updates = {}
    const path_update = "delegates/" + userid + "/" + curr_date + "/";
    console.log("Check the path " + path_update);
    const updates = {"checkedin": "Yes"};
    console.log("Check the url " + create_post_url(operationType, userid, curr_date));
    fetch(create_post_url(operationType, userid, curr_date), {
      method: 'POST',
    }).then(response => response.json())
      .then(data => {
        // Do something with the data
        console.log("Post return " + data);
        if (data.success) {
          setSuccessAlertVisible(true);
        }
      });
  }

  const handleCancelSelection = () => {
    setResult(null);
    setNameFromDB(null);
    setValid(false);
  }

  function handleIDSubmit() {
    console.log("Check the entered value " + delegateID);
  }

  const handleChangeDelegateID = (event) => {
    setDelegateID(event.target.value);
  };

  return (
    <div>
      {window.localStorage.getItem("authenticated") == "true" ?
      <>
        <NavbarSimple />
      {scanning ? (
        <div className='flex flex-col items-center p-3'>
            <TextField id="delegate_id" label="Delegate ID" onChange={handleChangeDelegateID}/>
            <br/>
            <Button id="delegate_id_btn" type="submit" variant="contained" size="small" onClick={handleIDSubmit}>Submit</Button>
            <br/>
            <p>OR</p>
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
        {isSuccessAlertVisible && (
          <>
          <div className='flex flex-col items-center p-3'>
          <Alert severity="success">
            {/* <AlertTitle>Success</AlertTitle> */}
            Successfully Updated.
          </Alert>
          </div>
          </>)
        }
        {(!scanning && result) ? (<>
          <Dialog open={true} handler={handleOpen} className="max-w-lg mx-auto">
            <div className='flex flex-col items-center p-3'>
              <DialogHeader>Delegate Status</DialogHeader>
              <DialogBody>
                {nameFromDB ? (<>
                      <p>{nameFromDB}</p> 
                      {(operationType === "Food" &&
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
      </>
      : <Login/>}
    </div>
  );
};

export default Home;
