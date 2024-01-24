import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Alert } from '@mui/material';
import { set, ref } from '@firebase/database';
import { db } from '../services/firebase';

const DynamicForm = () => {
  const [formFields, setFormFields] = useState([{ id: 1, value: '' }]);
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
  const project_select = document.getElementById('project_name');
  const addFormField = () => {
    const newField = { id: formFields.length + 1, value: '' };
    setFormFields([...formFields, newField]);
  };

  const removeFormField = (id) => {
    const updatedFields = formFields.filter((field) => field.id !== id);
    setFormFields(updatedFields);
  };

  const handleInputChange = (id, value) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setFormFields(updatedFields);
  };

  const handleSubmit = () => {
    try {
        // Perform actions to store the form data, e.g., send to an API
        console.log('Form Data:', JSON.stringify(formFields));
        const newSet = {};
        const projectName = project_select.value;
        for (const [key, value] of Object.entries(formFields)) {
            console.log("Key and Value " + key + " " + value.value);
            newSet[value.value] = "";
        }
        // const status = insert("projects/" + projectName, newSet);
        const path = "projects/" + projectName;
        set(ref(db, path), newSet).then(() => {
            console.log("Successufully updated the db");
            setSuccessAlertVisible(true);
            setFormFields([{ id: 1, value: '' }]);
            project_select.value = "";
            return 
        }).catch(alert);    
    } catch(error) {
        console.log(error);
    }
    
  };

  return (
    <>
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded">
        <div>
        <TextField
            id="project_name"
            label={'Project Name'}
            variant="outlined"
            fullWidth
            />
        </div>
        <br></br>
      {formFields.map((field) => (
        <div key={field.id} className="flex items-center space-x-2 mb-4">
            <div>
          <TextField
            label={`Field ${field.id}`}
            variant="outlined"
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
          />
          </div>
          <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => removeFormField(field.id)}
            startIcon={<RemoveIcon />}
          >
            Remove
          </Button>
          </div>
        </div>
      ))}
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={addFormField}
        startIcon={<AddIcon />}
        className="mb-4"
      >
        Add Field
      </Button>
      </div>
      <br></br>
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={formFields.length === 0}
      >
        Submit
      </Button>
      </div>
    </div>
    {isSuccessAlertVisible && (
        <Alert severity="success">
        {/* <AlertTitle>Success</AlertTitle> */}
        Successfully Updated.
        </Alert>)
    }
    </>
  );
};

export default DynamicForm;
