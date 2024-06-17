import React from 'react';
import { socket } from './socket';

interface IData {
  arrayData: number[];
  id: number;
}

function App() {
  const [isConnected, setIsConnected] = React.useState(socket.connected);
  const [modbusData, setModbusData] = React.useState<IData>();
  const [abas, sabas] = React.useState<IData>();

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    function dataHandler(data: IData) {
      setModbusData(data);
    }

    function dataHandler2(data: IData) {
      sabas(data);
    }

    socket.on('message', dataHandler);
    socket.on('message2', dataHandler2);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('message', dataHandler);
      socket.off('message2', dataHandler2);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <main>
      {modbusData?.arrayData.map((data, index) => {
        if (!isConnected) return <div key={index}>Соединение потеряно...</div>;

        return <div key={index}>{data}</div>;
      })}
      {abas?.arrayData.map((data, index) => {
        if (!isConnected) return <div key={index}>Соединение потеряно...</div>;

        return <div key={index}>{data}</div>;
      })}
    </main>
  );
}

export default App;
