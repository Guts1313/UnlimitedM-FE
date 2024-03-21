import React from 'react';
import {faFacebookF, faGithub, faGoogle, faLinkedinIn} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './SocialIcons.css'; // Make sure to import the CSS file
const SocialIcons = () => {
    return (
        <div className="social-icons">
            <FontAwesomeIcon icon={faGoogle} className="icon" />
            <FontAwesomeIcon icon={faFacebookF} className="icon" />
            <FontAwesomeIcon icon={faGithub} className="icon" />
            <FontAwesomeIcon icon={faLinkedinIn} className="icon" />
        </div>
    );

};


export default SocialIcons;