import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });



const App = () => {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(()=> {
    load();
  }, []);

  const convert2gif = async () => {
    setProcessing(true);
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mp4', '-t', '5', '-ss', '1.5', '-f', 'gif', 'out.gif');
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
    setSucceeded(true);
  }

  return ready ? (
    <div className="App">
      {
        video && 
        <video
          className="vid"
          controls
          src={ URL.createObjectURL(video) }
        />
      }
      
      <input type="file" id="select" onChange={ (e) => setVideo(e.target.files?.item(0)) } style={{ display: "none" }} />
      <button 
        className="btn orange"
        onClick={ () => { 
          document.getElementById('select').click();
          setSucceeded(false);
        } }
      >
        Upload Video
      </button>

      <button 
        className="btn" 
        onClick={ async () => {
          convert2gif(); 
          setProcessing(false);} 
        }
        disabled={ processing || succeeded }
        style={ processing || succeeded ? {opacity: '0.5'} : {} }
      >
      <span id="button-text">
        {
          processing ? "Converting..." : succeeded ? "Converted" : "Convert to GIF"
        }
      </span>
      </button>
      {
        gif &&
        <>
          <img className="gif" src={gif} alt="GIF" />
        </>
      }
    </div>
  ) : (
    <div className="App">
      <p className="load">Loading...</p>
    </div>
  );
}

export default App;
