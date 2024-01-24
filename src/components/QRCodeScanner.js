import React, { useState, useCallback } from 'react';
import QrScanner from 'react-qr-scanner';

const QRCodeScanner = () => {
  const [result, setResult] = useState('');

  const handleScan = useCallback((data) => {
    if (data) {
        console.log("Result data " + data);
        setResult(data);
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error(err);
  }, []);

  return (
    <div>
      <QrScanner
        onScan={handleScan}
        onError={handleError}
      />
      <p>{result}</p>
    </div>
  );
};

export default QRCodeScanner;
