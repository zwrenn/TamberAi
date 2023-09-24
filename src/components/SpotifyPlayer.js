/* global Spotify */
import React, { useEffect, useRef, useState } from "react";
import "./SpotifyPlayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStepBackward,
  faPlay,
  faPause,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

let setSdkState; // Declare a variable in the outer scope

// Define the global function
window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Spotify SDK Ready Callback Triggered");
  if (setSdkState) setSdkState(true);
};

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce((initial, item) => {
    let parts = item.split("=");
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial;
  }, {});

const tokenFromURL = hash.access_token || null;
console.log("Token extracted from URL:", tokenFromURL);

const SpotifyPlayer = ({ trackUri }) => {
  console.log("SpotifyPlayer component rendered");
  console.log("SpotifyPlayer received trackUri:", trackUri);

  const playerRef = useRef(null);
  const [isSdkReady, setSdkReady] = useState(window.Spotify !== undefined);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deviceId, setDeviceId] = useState(null);
  const [trackDetails, setTrackDetails] = useState({
    title: "",
    artist: "",
    albumCover: "",
  });

  const handlePreviousTrack = () => {
    if (playerRef.current) {
      playerRef.current
        .previousTrack()
        .then(() => {
          console.log("Set to previous track");
        })
        .catch((error) => {
          console.error("Error setting to previous track:", error);
        });
    } else {
      console.warn("Player reference is null or undefined");
    }
  };

  const handleNextTrack = () => {
    if (playerRef.current) {
      playerRef.current
        .nextTrack()
        .then(() => {
          console.log("Set to next track");
        })
        .catch((error) => {
          console.error("Error setting to next track:", error);
        });
    } else {
      console.warn("Player reference is null or undefined");
    }
  };

  useEffect(() => {
    setSdkState = setSdkReady;
    return () => {
      setSdkState = null;
    }; // Cleanup on unmount
  }, []);

  useEffect(() => {
    let interval;

    if (isSdkReady) {
      const token = tokenFromURL || "YOUR_FALLBACK_TOKEN";
      console.log("Using token:", token);

      playerRef.current = new Spotify.Player({
        name: "TamberPlayer",
        getOAuthToken: (callback) => {
          console.log("getOAuthToken callback triggered.");
          callback(token);
        },
      });

      if (tokenFromURL) {
        window.location.hash = "";
        console.log("Token cleared from URL for cleaner look.");
      }

      playerRef.current.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsPlayerReady(true);
      });

      playerRef.current.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsPlayerReady(false);
      });

      playerRef.current.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });

      playerRef.current.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });

      playerRef.current.addListener("account_error", ({ message }) => {
        console.error("Account Error:", message);
      });

      playerRef.current.addListener("player_state_changed", (state) => {
        setPosition(state.position);
        setDuration(state.duration);
      });

      console.log("Attempting to connect player...");
      playerRef.current.connect();

      interval = setInterval(() => {
        if (playerRef.current) {
          playerRef.current.getCurrentState().then((state) => {
            if (state) {
              setPosition(state.position);
            }
          });
        }
      }, 1000);
    } else {
      console.warn("Spotify window object or Player not detected.");
    }

    return () => {
      clearInterval(interval);
    };
  }, [isSdkReady]);

  useEffect(() => {
    if (window.Spotify) {
      setSdkReady(true);
    }
  }, []);

  useEffect(() => {
    if (trackUri && isPlayerReady) {
      console.log("Attempting to set playback context to URI:", trackUri);
      console.log("Using Device ID for playback:", deviceId);

      fetch(`https://api.spotify.com/v1/tracks/${trackUri.split(":").pop()}`, {
        headers: {
          Authorization: `Bearer ${tokenFromURL}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTrackDetails({
            title: data.name,
            artist: data.artists[0].name,
            albumCover: data.album.images[0].url,
          });
        })
        .catch((error) => {
          console.error("Error fetching track details:", error);
        });

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenFromURL}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw err;
            });
          }
          console.log("Playback context set successfully");
          playerRef.current
            .togglePlay()
            .then(() => {
              console.log("Toggled playback successfully");
            })
            .catch((error) => {
              console.error("Error toggling playback:", error);
            });
        })
        .catch((error) => {
          console.error("Error in setting playback context:", error);
        });
    } else {
      console.log(
        "Track URI or player readiness check failed. Skipping playback attempt."
      );
    }
  }, [trackUri, isPlayerReady, deviceId]);

  const handlePlay = () => {
    console.log("Play button clicked.");
    if (!isPlayerReady) {
      console.warn("Player is not yet ready");
      return;
    }

    if (playerRef.current) {
      playerRef.current
        .resume()
        .then(() => {
          console.log("Resumed playback successfully");
        })
        .catch((error) => {
          console.error("Error resuming playback:", error);
        });
    } else {
      console.warn("Player reference is null or undefined");
    }
  };

  const handlePause = () => {
    console.log("Pause button clicked.");
    if (playerRef.current) {
      playerRef.current
        .pause()
        .then(() => {
          console.log("Paused playback successfully");
        })
        .catch((error) => {
          console.error("Error pausing playback:", error);
        });
    } else {
      console.warn("Player reference is null or undefined");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);

    if (trackUri) {
      const trackId = trackUri.split(":").pop();

      fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: isLiked ? "DELETE" : "PUT",
        headers: {
          Authorization: `Bearer ${tokenFromURL}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log(
              isLiked
                ? "Track removed from Liked Songs"
                : "Track added to Liked Songs"
            );
          } else {
            setIsLiked(!isLiked);
            console.error("Error updating Liked Songs:", response.statusText);
          }
        })
        .catch((error) => {
          setIsLiked(!isLiked);
          console.error("Error in updating Liked Songs:", error);
        });
    }
  };

  const handleScrub = (event) => {
    const newPosition = event.target.value;
    setPosition(newPosition);

    playerRef.current.seek(newPosition).then(() => {
      console.log(`Changed position to ${newPosition}`);
    });
  };

  return (
    <div className="spotify-player">
      <div className="track-info">
        <FontAwesomeIcon
          className="like-icon"
          icon={faHeart}
          onClick={handleLike}
          style={{ color: isLiked ? "lime" : "gray", cursor: "pointer" }}
        />
        <img
          src={trackDetails.albumCover}
          alt="Album Cover"
          className="album-cover"
        />
        <div className="track-details">
          <p className="track-title">{trackDetails.title}</p>
          <p className="track-artist">{trackDetails.artist}</p>
        </div>
      </div>
      <div className="controls">
        <input
          type="range"
          value={position}
          max={duration}
          onChange={handleScrub}
          style={{ width: "250%" }}
        />
        <div className="buttons">
          <button className="prev-track" onClick={handlePreviousTrack}>
            <FontAwesomeIcon icon={faStepBackward} />
          </button>
          <button onClick={handlePlay}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button onClick={handlePause}>
            <FontAwesomeIcon icon={faPause} />
          </button>
          <button className="next-track" onClick={handleNextTrack}>
            <FontAwesomeIcon icon={faStepForward} />
          </button>
        </div>
      </div>
      <div className="auth-controls">
        <a
          href="https://accounts.spotify.com/authorize?client_id=e74b4171efe74283b6e4f39d226eb8a7&redirect_uri=http://localhost:3000/&scope=streaming user-read-email user-read-private user-library-modify&response_type=token"
          className="spotify-login"
          onClick={() => console.log("Login button clicked!")}
        >
          Login <FontAwesomeIcon icon={faSpotify} />
        </a>
      </div>
    </div>
  );
};

export default React.memo(SpotifyPlayer);
