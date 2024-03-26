import React from "react";
import videoBg from '../../../../../images/onboardingClient/img-bg.png'

function VideoViewer({ url, id }) {
  return (
    <div style={{ marginBottom: "2rem", background: "#6a6a6a", position: "relative", zIndex:0, overflow: 'hidden'}}>
      <img src={videoBg} style={{position:'absolute', left: 0, zIndex: -1}}/>
      {/* <video
        id={id}
        controls
        style={{ height: "30rem" }}
        className="foreground__video"
      >
        <source src={url} type="video/mp4"></source>
      </video> */}

      <iframe id={id+"_video"} width="560" height="315" src={url+"&rel=0"}  frameBorder='0' allowFullScreen ></iframe>
    </div>
  );
}

export default VideoViewer;
