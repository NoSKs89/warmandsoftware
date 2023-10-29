import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faFacebook,
    faTwitter,
    faInstagram,
    faSoundcloud
  } from "@fortawesome/free-brands-svg-icons";
  
export default function SocialFollow() {
  return (
    <div className="social-container">
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
    </div>
    //SUBSTACK.COM/@WARMANDSOFT
  );
}