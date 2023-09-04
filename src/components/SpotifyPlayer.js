/* global Spotify */

import React, { useEffect, useRef } from 'react';

// Define the callback at the top level, outside the component
window.onSpotifyWebPlaybackSDKReady = () => {
    // This will be called when the Spotify SDK is ready
    console.log("Spotify SDK Ready Callback Triggered");
};

const SpotifyPlayer = ({ trackUri }) => {
    console.log("SpotifyPlayer component rendered")
    console.log("SpotifyPlayer received trackUri:", trackUri);
    const playerRef = useRef(null); // We initialize a reference for player


    // Use your token here, but remember: don't hardcode it in production code!
    const token = 'BQDhnRykZ3ZOlij3_YgDlDO3ym2B8gD7Rz6axnyJyEDgfVD-imyIc8b24c3tYSBJz2XoXQM1AlOb_Ybw4g5GT3epxau8hjR1CUWyoU0eokL6qTATbMAjrRnf1AmZqeyJ7YtTMnZRMj3V9XJkGBh1V0rsfFWjfTKq0j29xFx8nHtdn6H5z1uMA4jXw0IjPRnVv8A';

    useEffect(() => {
        if (trackUri && playerRef.current) {
            console.log("Player connection status:", playerRef.current._options.id ? "Connected" : "Not Connected");
            if (!playerRef.current._options.id) {
                console.warn("Player is not connected. Cannot play song.");
                return;
            }
            console.log("Attempting to play song with URI:", trackUri);
            playerRef.current.play({ uris: [trackUri] }).then(() => {
                console.log('Playing track:', trackUri);
            }).catch(error => {
                console.error("Error in playing track:", error);
            });
        }
    }, [trackUri]);

    const handlePlay = () => {
        if (playerRef.current) {
            playerRef.current.resume();
        }
    }

    const handlePause = () => {
        if (playerRef.current) {
            playerRef.current.pause();
        }
    }

    return (
        <div className="spotify-player">
            <div style={{ padding: '10px', color: 'white', textAlign: 'center' }}>
                Spotify Player Controls
                <button style={{ marginTop: '10px' }} onClick={handlePlay}>Play</button>
                <button style={{ marginLeft: '5px' }} onClick={handlePause}>Pause</button>
            </div>
        </div>
    );       
}

export default React.memo(SpotifyPlayer);

