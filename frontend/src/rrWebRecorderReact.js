import React, { useEffect } from 'react';
import { record } from 'rrweb';
import Dropbox from 'dropbox';

const RRWebRecorder = () => {
  useEffect(() => {
    let events = [];
    const dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_KEY });

    const stopRecording = record({
      emit(event) {
        events.push(event);

        // \Send to drop box each ten seconds
        if (events.length && events.length % 10 === 0) {
          const fileContent = JSON.stringify(events);

          dbx.filesUpload({ path: '/rrwebEvents.json', contents: fileContent })
            .then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.error(error);
            });

          // Clear
          events = [];
        }
      },
    });

    // Stop recording upon user exit
    window.addEventListener('beforeunload', () => {
      if (stopRecording) {
        stopRecording();
      }
    });

    // Cleanup on unmount
    return () => {
      if (stopRecording) {
        stopRecording();
      }
    };
  }, []); // Empty dependency array 

  return null; // no front end rendering
};

export default RRWebRecorder;