import './styling/App.css';
import Login from './pages/Login'; // Import your Login component
import Lottie from "lottie-react";
import testanimation from "./assets/testanimation.json";
import loginsuccessanimation from './assets/testanimation.json';

import axios from 'axios'; // You might need to install axios via npm if you haven't already

function App() {


    return (
        <div>
            <Login/>
        </div>
    );




}

export default App;
