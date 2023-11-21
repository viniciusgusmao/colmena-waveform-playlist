import React, { useCallback, useState, useRef } from "react";
import Script from "next/script";
import EventEmitter from "events";
import WaveformPlaylist from "colmena-waveform-playlist";
import { saveAs } from "file-saver";
// import { initAudioExporter } from "../lib/export";

export default function Home() {
  const [ee] = useState(new EventEmitter());
  // const [toneCtx, setToneCtx] = useState(null);
  // const setUpChain = useRef();

  const container = useCallback(
    (node) => {
      if (node !== null) {
        const playlist = WaveformPlaylist(
          {
            // ac: toneCtx.rawContext,
            samplesPerPixel: 100,
            mono: true,
            waveHeight: 100,
            container: node,
            state: "cursor",
            colors: {
              waveOutlineColor: "#E0EFF1",
              timeColor: "grey",
              fadeColor: "black",
            },
            controls: {
              show: true,
              width: 150,
            },
            zoomLevels: [100, 300, 500],
          },
          ee
        );

        // ee.on("audiorenderingstarting", function (offlineCtx, a) {
        //   // Set Tone offline to render effects properly.
        //   const offlineContext = new Tone.OfflineContext(offlineCtx);
        //   Tone.setContext(offlineContext);
        //   setUpChain.current = a;
        // });

        ee.on("audiorenderingfinished", async function (type, data) {
          //restore original ctx for further use.
          // Tone.setContext(toneCtx);
          if (type === "wav") {
            saveAs(data, "test.wav");
          } else if (type === "buffer") {
            console.log(type, data);
          } else {
            // await initAudioExporter(data, type);
          }
        });

        playlist.load([
          {
            src: "hello.mp3",
            name: "Hello",
            // effects: function (graphEnd, masterGainNode, isOffline) {
            //   const reverb = new Tone.Reverb(1.2);

            //   if (isOffline) {
            //     setUpChain.current.push(reverb.ready);
            //   }

            //   Tone.connect(graphEnd, reverb);
            //   Tone.connect(reverb, masterGainNode);

            //   return function cleanup() {
            //     reverb.disconnect();
            //     reverb.dispose();
            //   };
            // },
          },
        ]);

        //initialize the WAV exporter.
        playlist.initExporter();
      }
    },
    [ee]
  );

  // function handleLoad() {
  //   setToneCtx(Tone.getContext());
  // }

  return (
    <>
      {/* <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.37/Tone.js"
        onLoad={handleLoad}
      /> */}
      <main>
        <div>
          <button
            onClick={() => {
              ee.emit("play");
            }}
          >
            Play
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              ee.emit("startaudiorendering", "wav");
            }}
          >
            Download wav
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              ee.emit("startaudiorendering", "mp3");
            }}
          >
            Download mp3
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              ee.emit("startaudiorendering", "opus");
            }}
          >
            Download opus
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              ee.emit("startaudiorendering", "buffer");
            }}
          >
            Show buffer
          </button>
        </div>
        <div ref={container}></div>
      </main>
    </>
  );
}
