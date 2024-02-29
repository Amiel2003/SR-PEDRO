import { useState, useEffect } from "react";
import io from 'socket.io-client';
const socket = io.connect("http://192.168.1.56:3001") //backend url

function OrangePi() {
  const [receivedMessage, setReceivedMessage] = useState('')
  const [accelerationData, setAccelerationData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    socket.on("return_acceleration_data", (data) => {
        console.log(data)
        setAccelerationData(data)
    })
  }, [socket])

  return (
    <div className="App">
      <center>
        <div>
           <h4 style={{color: 'red'}}>Accelerometer Data</h4>
        </div>
        <div style={{marginTop: '50px'}}>
          <h4>X: {accelerationData.x}</h4>
          <h4>Y: {accelerationData.y}</h4>
          <h4>Z: {accelerationData.z}</h4>
        </div>
      </center>
    </div>
  )
}

export default OrangePi;