import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import {
    faYoutube,
    faFacebook,
    faTwitter,
    faInstagram,
    faSoundcloud,
    faLinkedin
  } from "@fortawesome/free-brands-svg-icons";
  

const SocialFollow = ({muted, setMuted}) => {
  return (
    <div className="social-container">
      <a href="https:///www.linkedin.com/in/stephenmerickson"
        className="linkedin social" target="_blank">
        <FontAwesomeIcon icon={faLinkedin} size="1x" />
      </a>
    <a href="https://soundcloud.com/smerickson89"
        className="soundcloud social" target="_blank">
        <FontAwesomeIcon icon={faSoundcloud} size="1x" />
      </a>
      {/* <a href="https://www.facebook.com/"
        className="facebook social">
        <FontAwesomeIcon icon={faFacebook} size="1x" />
      </a> */}
      <a href="https://x.com/smerickson89" className="twitter social" target="_blank">
        <FontAwesomeIcon icon={faTwitter} size="1x"/>
      </a>
      <a href="https://www.instagram.com/stephenerickson1989"
        className="instagram social" target="_blank">
        <FontAwesomeIcon icon={faInstagram} size="1x"/>
      </a>
      <a className="speaker social" onClick={() => setMuted(!muted)}>
        {!muted ? <FontAwesomeIcon icon={faVolumeHigh} size="1x" /> : <FontAwesomeIcon className="red" icon={faVolumeXmark} size="1x" /> }
        </a>
    </div>
    //SUBSTACK.COM/@WARMANDSOFT
    //www.linkedin.com/in/stephenmerickson
  );
}

export default SocialFollow