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

        // Send events to Dropbox every 10 seconds
        if (events.length && events.length % 10 === 0) {
          const fileContent = JSON.stringify(events);

          dbx.filesUpload({ path: '/rrwebEvents.json', contents: fileContent })
            .then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.error(error);
            });

          // Clear events
          events = [];
        }
      },
    });

    // Stop recording when the user exits the website
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
  }, []); // Empty dependency array it runs when the user lands on the website and ends when they leave

  return null; // no front end rendering
};

export default RRWebRecorder;