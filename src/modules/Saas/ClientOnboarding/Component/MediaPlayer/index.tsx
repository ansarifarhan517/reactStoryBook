import React from "react";
import "./media.css";
// import { sendGA } from "../../../../../utils/ga";

interface IMediaPlayerProps {
  styles: object;
  url?: string | undefined;
  id?:string;
  clientId?:string
}

//After deplolyment remove this commented code

// const gaMapping = {
//   'order_dispatch_video' : {
//     gaCategory :'Onboarding-ModelType'
//   },
//   'operation_video':{
//     gaCategory: 'Onboarding-operationtype'
//   },
//   '':{
//     gaCategory :'blank'
//   }

// }

const MediaPlayer = ({ styles, id }: IMediaPlayerProps) => {
  // const video = useRef(null);
  // const background = useRef(null);
  // const username = '';

  // const playVideo = () => {
  //   // video?.current.play()
  //   background && background?.current && background?.current.play();
  //   video.current.currentTime = background.current.currentTime;
  //   // GA-event for all the model type
  //   sendGA(
  //     gaMapping[id ? id : ''].gaCategory,
  //     `Click on video` +
  //       `${clientId ? clientId : ""} - ${username ? username : ""}`
  //   );
  // };

  // const pauseVideo = () => {
  //   // video?.current.play()
  //   background && background?.current && background?.current.pause()
  // };
const videoUrl = 'https://www.youtube.com/embed/BrYkhUc0qew?playlist=BrYkhUc0qew&loop=1&&rel=0';
  return (
    <div className="media__wrapper" style={styles}>
      <div className="background__video">
        {/* <video height="100%" ref={background} muted={true}>
          <source src={url} type="video/mp4"></source>
        </video> */}
      </div>
      {/* <video id={id} onPlay={playVideo} onPause={pauseVideo} controls height="99%" ref={video} className="foreground__video">
        <source src={url} type="video/mp4"></source>
      </video> */}
      <iframe id={id} className="foreground__video"  height="99%" src={videoUrl}  frameBorder='0' allowFullScreen ></iframe>

    </div>
  );
};

export default MediaPlayer;
