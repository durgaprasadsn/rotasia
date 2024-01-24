import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function CardSimple({ handleChange, handleUpdate, uid, data, flag }) {
    // console.log("Card Simple " + handleChange + " " + handleUpdate);
    
  return (
    <Card className="bg-white rounded-lg overflow-auto shadow-md p-6 mb-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      
      <CardContent>
        <div>
            {!flag && Object.entries(data).map(([key, value]) => (
                key !== 'uid' &&
                <Typography variant="body2" color="text.secondary" key={key}>
                <TextField
                    id={key}
                    onChange={handleChange}
                    label={key}
                    defaultValue={value}
                    />
                    <br></br>
                </Typography>
                // <CardActions>

                // </CardActions>
            ))}
            {flag && Object.entries(data).map(([key, value]) => (
                key !== 'uid' &&
                <Typography variant="body2" color="text.secondary" key={key}>
                {key}: {value}
                </Typography>
            ))}
            
        </div>
      </CardContent>
      {!flag && 
      <CardActions>
        <Button id="btn" type="submit" variant="contained" size="small" onClick={handleUpdate}>Update</Button>
      </CardActions>}
    </Card>
  );
}