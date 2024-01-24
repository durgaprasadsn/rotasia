import React, { useState, useCallback } from 'react';
import { Button } from '@mui/material';
import QrScanner from 'react-qr-scanner';
import NavbarSimple from '../components/Navbar';

const Home = () => {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [operationType, setOperationType] = useState(null);

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

  const handleOperation = useCallback(() => {
    // Perform the operation using the scanned QR code result based on the operationType
    console.log("Check data here " + operationType);
    if (result && operationType) {
      console.log(`Performing ${operationType} operation with QR code:`, result.text);
      // Add your specific logic for each operation type
    }
  }, [result, operationType]);

  const handleError = useCallback(() => {

  });

  const handleScan = useCallback(
    (data) => {
      if (data) {
        setResult(data);
        console.log("Operation Type " + operationType);
        stopScanning();
        handleOperation();
      }
    },
    [operationType, stopScanning, handleOperation]
  );

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
        {/* <p>Click a button to start scanning</p> */}
        <p>{result ? JSON.stringify(result.text) + `${operationType}` : 'No result'}</p>
        <div className='flex justify-center p-3'>
            <Button id="checkin" type="submit" variant="contained" onClick={() => startScanning('Checkin')}>Checkin</Button>
            <Button id="food" type="submit" variant="contained" onClick={() => startScanning('Food')}>Food</Button>
            <Button id="logistics" type="submit" variant="contained" onClick={() => startScanning('Logistics')}>Logistics</Button>
        </div>
        
        {/* <button onClick={handleOperation} disabled={!result || !operationType || scanning}>
            Perform Operation
        </button> */}
        </>
      )}
      
    </div>
  );
};

export default Home;

// const Home = () => {
//     const [result, setResult] = useState('');
//     const [scanning, setScanning] = useState(false);
//     const [operationType, setOperationType] = useState(null);
  
//     const prepare = () => {
//         BarcodeScanner.prepare();
//     };

//     const stopScanning = () => {
//         setScanning(false);
//         BarcodeScanner.showBackground();
//         BarcodeScanner.stopScan();
//     };

      
//     const checkPermission = async () => {
//         // check or request permission
//         const status = await BarcodeScanner.checkPermission({ force: true });
      
//         if (status.granted) {
//           // the user granted permission
//           return true;
//         }
      
//         return false;
//     };
//     // const stopScanning = useCallback(() => {
//     //   setScanning(false);
//     //   // Perform any additional cleanup or actions if needed
//     // }, [setScanning]);
  
//     const startScanning = async (type) => {
//         prepare();
//         setOperationType(type);
//         console.log("Operation Type here " + type);
//         setScanning(true);
//         BarcodeScanner.hideBackground();
//         const result = await BarcodeScanner.startScan();
//         if (result.hasContent) {
//           console.log(result.content);
//         }
        
//     };
  
//     const handleOperation = useCallback(() => {
//       // Perform the operation using the scanned QR code result based on the operationType
//       console.log("Check data here " + operationType);
//       if (result && operationType) {
//         console.log(`Performing ${operationType} operation with QR code:`, result.text);
//         // Add your specific logic for each operation type
//       }
//     }, [result, operationType]);
  
//     const handleScan = useCallback(
//       (data) => {
//         if (data) {
//           setResult(data);
//           console.log("Operation Type " + operationType);
//           stopScanning();
//           handleOperation();
//         }
//       },
//       [operationType, stopScanning, handleOperation]
//     );
//     checkPermission();
//     return (
//       <div>
//         {scanning ? (
//         //   <div className='flex flex-col items-center p-3'>
//         //       <QrScanner onScan={handleScan} constraints={{
//         //       audio: true,
//         //       video: { facingMode: "environment" }
//         //       }}/>
//         //       <div className='flex justify-center p-3'>
//         //       <Button id="stop_scanning" type="submit" variant="contained" onClick={stopScanning}>
//         //           Stop Scanning
//         //       </Button>
//         //       </div>
//         //   </div>
//         <div className='flex flex-col items-center p-3'>
//             <span className='flex flex-col items-center p-3'>BESbswy</span>
//         </div>
//         ) : (
//           <>
//           {/* <p>Click a button to start scanning</p> */}
//           {/* <p>{result ? JSON.stringify(result) + `${operationType}` : 'No result'}</p> */}
//           <div className='flex justify-center p-3'>
//               <Button id="checkin" type="submit" variant="contained" onClick={() => startScanning('Checkin')}>Checkin</Button>
//               <Button id="food" type="submit" variant="contained" onClick={() => startScanning('Food')}>Food</Button>
//               <Button id="logistics" type="submit" variant="contained" onClick={() => startScanning('Logistics')}>Logistics</Button>
//           </div>
          
//           {/* <button onClick={handleOperation} disabled={!result || !operationType || scanning}>
//               Perform Operation
//           </button> */}
//           </>
//         )}
        
//       </div>
//     );
//   };
  
//   export default Home;
  