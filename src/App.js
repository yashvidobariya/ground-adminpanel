import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Users from './Screen/Users';
import Owners from './Screen/Owners';
import Reviewandrating from './Screen/Reviewandrating';
import Notification from './Screen/Notification';
import Signup from './Screen/Signup';
import Login from './Screen/Login';
import Logout from './Screen/Logout';
import Ground from './Details/Ground';
import Protected from './Authentication/ProtectedRoute ';
import PublicRoute from './Authentication/PublicRoute';
import SingleEdituser from './Single/SingleEdituser';
import SingleeditOwner from './Single/SingleeditOwner';
import Grounddetails from './Details/Grounddetails';
import Profile from './Screen/Profile';
import Header from './Component/Header';
import SingleeditGroundlist from './Single/SingleeditGroundlist';
import AddGround from './Single/AddGround';
import UserBooking from './Details/UserBooking';
import Bookings from './Screen/Bookings';
import Dashboard from './Screen/Dashboard';
import Financial from './Screen/Financial';
import Customer from './Screen/Customer';
import Marketing from './Screen/Marketing';
import Technical from './Screen/Technical';
import Setting from './Screen/Setting';
import Venue from './Screen/Venue';
import Bookingdetails from './Details/Bookingdetails';
import Custmoredetails from './Details/Custmoredetails';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublicRoute element={<Login />} />} />
          <Route path='/adminsignup' element={<PublicRoute element={<Signup />} />} />
        </Routes>

        <div className='main-content'>
          <Header />
          <Routes>
            <Route path="/profile" element={<Protected element={<Profile />} />} />
            <Route path="/Dashboard" element={<Protected element={<Dashboard />} />} />
            <Route path='/users' element={<Protected element={<Users />} />} />
            <Route path='/owners' element={<Protected element={<Owners />} />} />
            <Route path='/financial' element={<Protected element={<Financial />} />} />
            <Route path='/customer' element={<Protected element={<Customer />} />} />
            <Route path='/marketing' element={<Protected element={<Marketing />} />} />
            <Route path='/technical' element={<Protected element={<Technical />} />} />
            <Route path='/setting' element={<Protected element={<Setting />} />} />
            <Route path='/reviewandrating' element={<Protected element={<Reviewandrating />} />} />
            <Route path='/notification' element={<Protected element={<Notification />} />} />
            <Route path='/Venue' element={<Protected element={<Venue />} />} />
            <Route path='/logout' element={<Protected element={<Logout />} />} />
            <Route path='/owners/grounddetails/:userId' element={<Protected element={<Grounddetails />} />} />
            <Route path='/owners/grounds/:userId' element={<Protected element={<Ground />} />} />
            <Route path='/bookings' element={<Protected element={<Bookings />} />} />
            <Route path='/bookings/Bookingdetails/:bookingid' element={<Protected element={<Bookingdetails />} />} />
            <Route path='/users/booking/:userId' element={<Protected element={<UserBooking />} />} />
            <Route path='/users/edit/:userId' element={<Protected element={<SingleEdituser />} />} />
            <Route path='/owners/edit/:userId' element={<Protected element={<SingleeditOwner />} />} />
            <Route path='/venue/edit/:userId' element={<Protected element={<SingleeditGroundlist />} />} />
            <Route path='/venue/addground' element={<Protected element={<AddGround />} />} />
            <Route path='/customer/customerdetails/:ticketId' element={<Protected element={<Custmoredetails />} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
