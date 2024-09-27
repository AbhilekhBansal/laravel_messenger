import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const AudioRecorder = ({ fileReady }) => {
    const [mediaRecorder, setMedisRecorder] = useState(null);

    const [recording, setRecording] = useState(false);

    const onMicrophoneClick = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMedisRecorder(null);
            }
            return;
        }
        setRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const newMediaRecorder = new MediaRecorder(stream, options);
            const chunks = [];
            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });
            newMediaRecorder.addEventListener("stop", (event) => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });
                let audioFile = new file([audioBlob], "recorded_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });
                const url = URL.createObjectURL(audioFile);
                fileReady(audioFile, url);
            });
            newMediaRecorder.start();
            setMedisRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.log("Error accessing microphone", error);
        }
    };
    return (
        <button
            onClick={onMicrophoneClick}
            className="p-1 text-gray-400 hover:text-gray-200"
        >
            {recording && <StopCircleIcon className="w-6 text-red-600" />}
            {!recording && <MicrophoneIcon className="w-6" />}
        </button>
    );
};

export default AudioRecorder;
