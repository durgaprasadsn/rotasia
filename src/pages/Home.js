import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button';
import QrScanner from 'react-qr-scanner';
import NavbarSimple from '../components/Navbar';
import dayjs from 'dayjs';
import { getFromDB, insert } from '../services/authService';
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

import { ref, get, set, child, onValue, update } from '@firebase/database';
import { auth, db } from '../services/firebase';
import { data } from 'autoprefixer';
import { CurrencyExchange } from '@mui/icons-material';
import Login from '../components/Login';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

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
  const [type, setType] = useState(null);
  const [foodItemList, setFoodItemList] = useState(null);
  const [logisticsList, setLogisticsList] = useState(null);
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
  const [delegateID, setDelegateID] = useState("");
  const [dID, setDid] = useState("");
  const [RID, setRID] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [accomName, setAccomName] = useState("");
  const [accomLocation, setAcccomLocation] = useState("");
  const [idcard, setidcard] = useState(false);
  const [generic_kit, setgenerickit] = useState(false);
  const [caricature, setcaricature] = useState(false);
  const [tshirt, settshirt] = useState(false);
  const [validDay, setValidDay] = useState("");
  const [tshirtVar, setthsirtVar] = useState("");
  const [foodType, setFoodType] = useState("");
 
  const handleOpen = () => setOpen(!open);
  const navigate = useNavigate()
    useEffect(() => {
        // console.log("Chck auth " + window.localStorage.getItem("authenticated"));
        if (window.localStorage.getItem("authenticated") == "true") {
            navigate("/home");
            // return <Navigate replace to="/home" />;
        } else {
            navigate("/");
        }
    }, []);

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
  var default_url = "https://flask-gqwgb9yu9-durgaprasadsns-projects.vercel.app";

  // console.log(auth.currentUser.email);
  const curr_date = dayjs().format('DD-MM-YYYY');
  const errorText = "Something is Wrong";
  const notFound = "User not found";
  var day_selected = -1;

  var location = [['AK', 'AL', 'AM', 'AN', 'AO'], ['AP', 'AQ', 'AR', 'AS', 'AT'], ['AU', 'AV', 'AW', 'AX', 'AY'], ['AZ', 'BA', 'BB', 'BC', 'BD']]
  var room_details_location = {"delegate_id_column": "B", "district_column": "K", "accomodation_name_column": "N", "accomodation_location_column": "O", "room_no_column": "M"}
  // ID Card, Generic Kit, Caricature, TShirt
  var logistics = ["AG", "AH", "AI", "AJ"]

  var tshirt_size_location = "X";
  var userid_location = 'I';
  // var logistics_location = 'AH';
  var hashedid_location = 'AX';
  function create_get_url(date, userid) {
    // return default_url + '?date=' + date + '&name=' + userid;
    return default_url + '/get_user?date=' + date + '&name=' + userid;
  }

  function create_gethash_url(date, userid) {
    // return default_url + '?date=' + date + '&name=' + userid;
    return default_url + '/get_user_delegate?date=' + date + '&name=' + userid;
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
      url += "&logistics=Yes&idcard=" + idcard + "&generic_kit=" + generic_kit + "&caricature=" + caricature + "&tshirt=" + tshirt;
    }
    if (type === "Room Details") {
      url += "&room_details=Yes&room_no=" + roomNo + "&accom_name=" + accomName + "&accom_location=" + accomLocation;
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

  function performOperation(value, day_today) {
    console.log(value);
    get(child(ref(db), "delegates/" + value)).then((snapshot) => {
      if (snapshot.exists()) {
        const dataFromDB = snapshot.val();
        
        console.log("Snapshot in get " + JSON.stringify(dataFromDB[day_today]) + " " + dataFromDB[day_today]['Checkedin']);
        if (operationType === "Checkin") {
          if (dataFromDB[day_today]['Checkedin'] === "No") {
            setDid(value);
            setNameFromDB(dataFromDB['name']);
            setValid(true);
            setRID(dataFromDB.district)
          } else {
            setNameFromDB(dataFromDB.name + " already checkedin");
          }
        }  else if (operationType === "Food") {
          // Food operation has to be performed
          // console.log("Food validate " + JSON.stringify(dataFromDB[ret_date].food) +  " " + Object.keys(dataFromDB[ret_date].food));
          // const food_data = {};
          // let original = ["Breakfast", "Lunch", "HighTea", "Dinner"];
          
          // for (let i = 0; i < original.length; i++) {
          //   food_data[original[i]] = dataFromDB[day_today][original[i]];
          // }
          get(child(ref(db), "food/")).then((snapshot) => {
            if (snapshot.exists()) {
                const food_data = snapshot.val();
                console.log("Snapshot in get " + JSON.stringify(food_data));
                setFoodType(food_data.food_type)
                if (dataFromDB[day_today][food_data.food_type] == 'No') {
                  setNameFromDB(dataFromDB.name);
                  setDid(value);
                  setValid(true);
                } else {
                  setNameFromDB(dataFromDB.name + " - " + food_data.food_type + " is already served. ");
                  setValid(false);
                }
            } else {
                console.log("Data not found");
                setNameFromDB("Data not Found");
            }
          });
          
          // for (let i = original.length - 1; i >= 0; i--) {
          //   console.log("Check value " + food_data[original[i]] + " " + original[i]);
          //     if (food_data[original[i]] == "Yes") {
          //         original.splice(i, 1);
          //     }
          // }

          // setFoodItemList(original);
          // if (original.length > 0) {
          //   setNameFromDB(dataFromDB.name);
          //   setDid(value);
          //   setValid(true);
          // } else {
          //   setNameFromDB(dataFromDB.name + " Food is already Served");
          //   setValid(false);
          // }
        } else if (operationType === "Logistics") {
          // Logistics operation has to be performed
          const logistics_data = {};
          console.log(dataFromDB);
          var tshirt_var = "T-Shirt (" + dataFromDB.tshirt + ")";
          setthsirtVar(tshirt_var);
          console.log("Check the shirt here " + tshirt_var);
          let original = ["IDCard", "GenericKit", "Caricature", tshirt_var];
          
          for (let i = 0; i < original.length; i++) {
            logistics_data[original[i]] = dataFromDB['logistics'][original[i]];
            console.log(logistics_data[original[i]]);
          }

          setLogisticsList(original);
          setNameFromDB(dataFromDB.name);
          setidcard(dataFromDB['logistics'][original[0]] === "No" ? false : true);
          setgenerickit(dataFromDB['logistics'][original[1]] === "No" ? false : true);
          setcaricature(dataFromDB['logistics'][original[2]] === "No" ? false : true);
          settshirt(dataFromDB['logistics'][original[3]] === "No" ? false : true);
          setValid(true);
          setDid(value);
        } else if (operationType === "Room Details") {
          setValid(true);
          setNameFromDB(dataFromDB.name);
          setRID(dataFromDB.district);
          setDid(value);
          setAcccomLocation(dataFromDB['room_details']['accomodationLocation']);
          setAccomName(dataFromDB['room_details']['accomodationName']);
          setRoomNo(dataFromDB['room_details']['roomNo']);
        }
      } else {
          console.log("Data not found");
          setNameFromDB("Data not Found");
      }
    });
  }

  const fetchNameFromDB = useCallback(() => {
    console.log("Type here " + type + " " + result)
    if (result && operationType) {
      console.log("String to get " + create_gethash_url(curr_date, result));
      const reference = ref(db, "map/" + result);
      get(child(ref(db), "date/" + curr_date)).then((snapshot) => {
          if (snapshot.exists()) {
              console.log("Snapshot in get " + snapshot.val() + type);
              const day_today = snapshot.val();
              setValidDay(day_today);
              if (type == "typed") {
                console.log("TYpe " + result)
                performOperation(result, day_today);
                // get(child(ref(db), "map/" + result.text)).then((snapshot) => {
                //     if (snapshot.exists()) {
                //         console.log("Snapshot in get " + snapshot.val());
                //         return snapshot.val();
                //     } else {
                //         console.log("Data not found");
                //     }
                // });
              } else {
                get(child(ref(db), "map/" + result)).then((snapshot) => {
                  if (snapshot.exists()) {
                      console.log("Snapshot in get " + snapshot.val());
                      performOperation(snapshot.val(), day_today);
                  } else {
                      console.log("Data not found");
                      setNameFromDB("Data not Found");
                  }
                });
              }
          } else {
              console.log("Data not found");
              setNameFromDB("Data not Found");
          }
      });
      // const day = getFromDB("date/" + curr_date)
      // console.log("Day here " + day.value);
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
      // fetch((type == "typed") ? create_gethash_url(curr_date, result) : create_get_url(curr_date, result))
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log("data received " + JSON.stringify(data));
      //     if (data.success) {
      //       console.log("Sucess received");
      //       var selected = data.day;
      //       if (selected == 'Day1') {
      //         day_selected = 0;
      //       } else if (selected == 'Day2') {
      //         day_selected = 1;
      //       } else if (selected == 'Day3') {
      //         day_selected = 2;
      //       } else if (selected == 'Day4') {
      //         day_selected = 3;
      //       }
      //     } else {
      //       console.log("Failure received");
      //       setNameFromDB("Data not found");
      //       return;
      //     }
      //     const dataFromDB = data.response;
      //     console.log("Check the status and data  " + operationType + " " + data.success + " " + dataFromDB);
      //     if (!!dataFromDB) {
      //       setData(dataFromDB);
      //       // console.log("Today is correct" + operationType);
      //       if (operationType === "Checkin") {
      //         let index = columnNameToIndex('AI');
      //         console.log("Durga check here " + index + " " + dataFromDB[index]);
      //         if (dataFromDB[columnNameToIndex(location[day_selected][0])] === "No") {
      //           // Update the checkin details
      //           console.log("Checked in is no "+ room_details_location["delegate_id_column"] + 'Checejchecjhekcjehk' + dataFromDB[columnNameToIndex(room_details_location["delegate_id_column"])]);
      //           setDid(dataFromDB[columnNameToIndex(room_details_location["delegate_id_column"])]);
      //           setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
      //           setValid(true);
      //         } else {
      //           console.log("Checkedin yes");
      //           setNameFromDB(dataFromDB[columnNameToIndex(userid_location)] + " already checkedin");
      //         }
      //       } else if (operationType === "Food") {
      //         // Food operation has to be performed
      //         // console.log("Food validate " + JSON.stringify(dataFromDB[ret_date].food) +  " " + Object.keys(dataFromDB[ret_date].food));
      //         const food_data = {};
      //         let original = ["Breakfast", "Lunch", "HighTea", "Dinner"];
              
      //         for (let i = 0; i < original.length; i++) {
      //           food_data[original[i]] = dataFromDB[columnNameToIndex(location[day_selected][i+1])];
      //         }
      //         for (let i = original.length - 1; i >= 0; i--) {
      //           console.log("Check value " + food_data[original[i]] + " " + original[i]);
      //             if (food_data[original[i]] == "Yes") {
      //                 original.splice(i, 1);
      //             }
      //         }

      //         setFoodItemList(original);
      //         if (original.length > 0) {
      //           setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
      //           setDid(dataFromDB[columnNameToIndex(room_details_location["delegate_id_column"])]);
      //           setValid(true);
      //         } else {
      //           setNameFromDB(dataFromDB[columnNameToIndex(userid_location)] + " Food is already Served");
      //           setValid(false);
      //         }
              
      //       } else if (operationType === "Logistics") {
      //         // Logistics operation has to be performed
      //         const logistics_data = {};
              
      //         var tshirt_var = "T-Shirt (" + dataFromDB[columnNameToIndex(tshirt_size_location)] + ")";
      //         console.log("Check the shirt here " + tshirt_var);
      //         let original = ["ID Card", "Generic Kit", "Caricature", tshirt_var];
              
      //         for (let i = 0; i < original.length; i++) {
      //           logistics_data[original[i]] = dataFromDB[columnNameToIndex(logistics[i])];
      //         }
      //         setLogisticsList(original);
      //         setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
      //         setidcard(dataFromDB[columnNameToIndex(logistics[0])] === "No" ? false : true);
      //         setgenerickit(dataFromDB[columnNameToIndex(logistics[1])] === "No" ? false : true);
      //         setcaricature(dataFromDB[columnNameToIndex(logistics[2])] === "No" ? false : true);
      //         settshirt(dataFromDB[columnNameToIndex(logistics[3])] === "No" ? false : true);
      //         setValid(true);
      //         setDid(dataFromDB[columnNameToIndex(room_details_location["delegate_id_column"])]);
      //       } else if (operationType === "Room Details") {
      //         setValid(true);
      //         setNameFromDB(dataFromDB[columnNameToIndex(userid_location)]);
      //         setRID(dataFromDB[columnNameToIndex(room_details_location["district_column"])]);
      //         setDid(dataFromDB[columnNameToIndex(room_details_location["delegate_id_column"])]);
      //         setAcccomLocation(dataFromDB[columnNameToIndex(room_details_location["accomodation_location_column"])]);
      //         setAccomName(dataFromDB[columnNameToIndex(room_details_location["accomodation_name_column"])]);
      //         setRoomNo(dataFromDB[columnNameToIndex(room_details_location["room_no_column"])]);
      //       }
      //     } else {
      //       console.log("Data not found");
      //       setNameFromDB(null); // Set name to null if data is not found
      //     }
      //   });
    } else {
      console.log("Result or operationType is not available");
      setNameFromDB(null);
    }
  }, [result, operationType]);

  const handleOperation = useCallback(() => {
    fetchNameFromDB();
    setSuccessAlertVisible(false);
  }, [fetchNameFromDB]);

  const handleHashOperation = useCallback(() => {
    console.log("Handle hash operation")
    fetchNameFromDB("hashed");
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
        setType("scaned")
        setResult(data.text);
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
    console.log("Check the values " + result + " " + operationType + " " + valid + " " + dID);
    if (valid) {
      if (operationType === "Food") {
        handleFoodOperation(dID);
      } else if (operationType === "Checkin") {
        handleCheckinOperation(dID);
      } else if(operationType === "Logistics") {
        handleLogsOperation(dID);
      } else if(operationType === "Room Details") {
        handleRoomDetailsOperation(dID);
      }
    }
    setResult(null);
    setNameFromDB(null);
    setValid(false);
    setSelectedOption('');
    setSuccessAlertVisible(false);
  }

  const handleRoomDetailsOperation = (userid) => {
    const path_update = "delegates/" + userid + "/room_details/";
    const updates = {'roomNo': roomNo, 'accomodationLocation': accomLocation, 'accomodationName': accomName};
    console.log(updates);
    update(ref(db, path_update), updates).then( () => {
      console.log("SUCCESS");
      setSuccessAlertVisible(true);
    } ) .catch((error) => {
      console.log(error);
    } )
    // fetch(create_post_url(operationType, userid, curr_date), {
    //   method: 'POST',
    // }).then(response => response.json())
    //   .then(data => {
    //     // Do something with the data
    //     console.log("Post return " + data);
    //     if (data.success) {
    //       setSuccessAlertVisible(true);
    //     }
    //   });   
  }

  const handleLogsOperation = (userid) => {
    const path_update = "delegates/" + userid + "/logistics/";
    // var tshirt_var = "T-Shirt (" + dataFromDB.tshirt + ")";
    console.log("Check the shirt here " + tshirtVar);
    let original = ["IDCard", "GenericKit", "Caricature", tshirtVar];
    const updates = {};
    if (idcard) {
      updates[original[0]] = "Yes";
    } else {
      updates[original[0]] = "No";
    }
    if (generic_kit) {
      updates[original[1]] = "Yes";
    } else {
      updates[original[1]] = "No";
    }
    if (caricature) {
      updates[original[2]] = "Yes";
    } else {
      updates[original[2]] = "No";
    }
    if (tshirt) {
      updates[original[3]] = "Yes";
    } else {
      updates[original[3]] = "No";
    }
    console.log(updates);
    update(ref(db, path_update), updates).then( () => {
        console.log("SUCCESS");
        setSuccessAlertVisible(true);
      } ) .catch((error) => {
        console.log(error);
      } )
    // fetch(create_post_url(operationType, userid, curr_date), {
    //   method: 'POST',
    // }).then(response => response.json())
    //   .then(data => {
    //     // Do something with the data
    //     console.log("Post return " + data);
    //     if (data.success) {
    //       setSuccessAlertVisible(true);
    //     }
    //   });   
  }

  const handleFoodOperation = (userid) => {
    const path_update = "delegates/" + userid + "/" + validDay + "/";
    console.log("Food check " + selectedOption + " " + foodType);

    const updates = {};
    updates[foodType] = "Yes";
    console.log(updates);
    update(ref(db, path_update), updates).then( () => {
        console.log("SUCCESS");
        setSuccessAlertVisible(true);
      } ) .catch((error) => {
        console.log(error);
      } )
    // console.log(updates);
    // fetch(create_post_url(operationType, userid, curr_date), {
    //   method: 'POST',
    // }).then(response => response.json())
    //   .then(data => {
    //     // Do something with the data
    //     console.log("Post return " + data);
    //     if (data.success) {
    //       setSuccessAlertVisible(true);
    //     }
    //   });
  }

  const handleCheckinOperation = (userid) => {
    // const updates = {}
    const path_update = "delegates/" + userid + "/" + validDay + "/";
    console.log("Check the path " + path_update + " " + validDay);
    const updates = {"Checkedin": "Yes"};

    update(ref(db, path_update), updates).then( () => {
        console.log("SUCCESS");
        setSuccessAlertVisible(true);
      } ) .catch((error) => {
        console.log(error);
      } )
    // console.log("Check the url " + create_post_url(operationType, userid, curr_date));
    // fetch(create_post_url(operationType, userid, curr_date), {
    //   method: 'POST',
    // }).then(response => response.json())
    //   .then(data => {
    //     // Do something with the data
    //     console.log("Post return " + JSON.stringify(data));
    //     if (data.success) {
    //       setSuccessAlertVisible(true);
    //     }
    //   });
  }

  const handleCancelSelection = () => {
    setResult(null);
    setNameFromDB(null);
    setValid(false);
  }

  function handleIDSubmit() {
    console.log("Check the entered value " + delegateID);
    setType("typed");
    setResult(delegateID);
    stopScanning();
    handleHashOperation();
    setSuccessAlertVisible(false);
  }

  const handleChangeDelegateID = (event) => {
    setDelegateID(event.target.value);
  };

  const handleChangeDID = (event) => {
    setDid(event.target.value);
  };

  const handleChangeRoomNo = (event) => {
    setRoomNo(event.target.value);
  };

  const handleChangeDistrict = (event) => {
    setRID(event.target.value);
  };

  const handleChangeAccomLocation = (event) => {
    setAcccomLocation(event.target.value);
  };

  const handleChangeAccomName = (event) => {
    setAccomName(event.target.value);
  };

  const handleIDCardChange = (event) => {
    console.log("ID HEre " + event.target.checked);
    setidcard(event.target.checked);
  }

  const handleGenericKitChange = (event) => {
    console.log("Kit HEre " + event.target.checked);
    setgenerickit(event.target.checked);
  }

  const handleCaricatureChange = (event) => {
    console.log("Caricature HEre " + event.target.checked);
    setcaricature(event.target.checked);
  }

  const handleTshirtChange = (event) => {
    console.log("T SHirt HEre " + event.target.checked);
    settshirt(event.target.checked);
  }

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
                  <div className="flex justify-center py-4">
                    <div className='content-between'>
                        <p>{nameFromDB}</p>
                        <div className='flex justify-center content-between'>
                        <p>{RID}</p>
                        </div>
                    </div>
                  </div>
                      {
                      // (valid && operationType === "Food" &&
                      // foodItemList) ? 
                      // <RadioGroup
                      //   aria-label="options"
                      //   name="options"
                      //   value={selectedOption}
                      //   onChange={handleOptionChange}>
                      // {foodItemList.map((item) => (
                      //   <FormControlLabel
                      //     key={item} // Replace with a unique identifier for each item
                      //     value={item}
                      //     control={<Radio />}
                      //     label={item}
                      //   />
                      // ))}
                      // </RadioGroup> : 
                      (operationType === "Room Details") ? 
                      <>
                        <div className="grid grid-cols-2 gap-4">
                        <TextField id="delegate_id" className='px-8 py-4' label="Delegate ID" value={dID} onChange={handleChangeDID} InputProps={{ readOnly: true }}/>
                        <TextField id="district" className='px-8 py-4' label="RI District" value={RID} onChange={handleChangeDistrict} InputProps={{ readOnly: true }}/>
                        <TextField id="room_no" className='px-8 py-4' label="Room Number" value={roomNo} onChange={handleChangeRoomNo}/>
                        <TextField id="accommodation_name" className='px-8 py-4' label="Accommodation Name" value={accomName} onChange={handleChangeAccomName}/>
                        <TextField id="accommodation_location" className='px-8 py-4' label="Accommodation Location" value={accomLocation} onChange={handleChangeAccomLocation}/>
                        </div>
                      </> : <>{(operationType === "Logistics" && logisticsList) ? 
                      <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={idcard} onChange={handleIDCardChange} name={logisticsList[0]} />
                        }
                        label={logisticsList[0]}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={generic_kit} onChange={handleGenericKitChange} name={logisticsList[1]} />
                        }
                        label={logisticsList[1]}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={caricature} onChange={handleCaricatureChange} name={logisticsList[2]} />
                        }
                        label={logisticsList[2]}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={tshirt} onChange={handleTshirtChange} name={logisticsList[3]} />
                        }
                        label={logisticsList[3]}
                      /> 
                    </FormGroup> : <></>}</>
                    }
                    </>) : (
                      <p>{nameFromDB}</p>
                    )}
                      
              </DialogBody>
            
              <DialogFooter className='flex items-center justify-center space-x-4 mt-30'>
              <Button id="btn" type="submit" variant="contained" size="small" className='mb-80' onClick={handleCancelSelection}>Cancel</Button>
              <Button id="btn"  type="submit" variant="contained" size="small" className='mb-80' onClick={handleConfirmSelection}>Confirm</Button>
              </DialogFooter>
            </div>
          </Dialog>
        </>) : (<>
          <div className='flex items-center justify-center space-x-3 mt-40'>
            <Button id="checkin" type="submit" variant="contained" className="mb-8" onClick={() => startScanning('Checkin')}>Checkin</Button>
            <Button id="food" type="submit" variant="contained" className='mb-8' onClick={() => startScanning('Food')}>Food</Button>
            <Button id="logistics" type="submit" variant="contained" className='mb-8' onClick={() => startScanning('Logistics')}>Logistics</Button>
            <Button id="room" type="submit" variant="contained" className='mb-8' onClick={() => startScanning('Room Details')}>Room Details</Button>
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