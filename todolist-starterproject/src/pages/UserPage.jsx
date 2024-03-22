import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';

function UserPage() {
  const welcomeText = "Welcome ";
  const [username, setUsername] = useState();

  const fetchUsernames = async () => {
    const usernames = await axios(
      'https://randomuser.me/api/',
    );
    const nameObject = usernames.data.results[0].name;
    setUsername(nameObject.title + " " +
      nameObject.first + " " +
      nameObject.last);
  }

  useEffect(() => {
  });

  return (
    <div>
      {welcomeText + username}
    </div>
  )
}

export default UserPage;