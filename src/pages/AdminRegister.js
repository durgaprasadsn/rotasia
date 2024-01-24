import React, { useState, useEffect } from 'react';
import DynamicForm from '../components/DynamicForm';
import AdminNavbarSimple from '../components/AdminNavbar';

const AdminRegister = () => {
    
  return (
    <>
        <AdminNavbarSimple/>
        <DynamicForm />           
    </>
  )
};

export default AdminRegister;