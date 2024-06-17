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
    <main className="flex items-start gap-5 p-10 min-h-screen bg-stone-900 text-stone-900">
      <div className="border-2 border-slate-200 rounded bg-slate-100 p-2">
        <h1 className="text-3xl">Первое устройство</h1>
        <div className="w-full h-[2px] bg-stone-900 my-2" />
        {modbusData?.arrayData.map((data, index) => {
          if (!isConnected) return <div key={index}>Соединение потеряно...</div>;

          return (
            <div className="flex gap-2 text-xl" key={index}>
              <p>Тег {index + 1}: </p>
              <p>{data}</p>
            </div>
          );
        })}
      </div>
      <div className="border-2 border-slate-200 rounded bg-slate-100 p-2">
        <h1 className="text-3xl">Второе устройство</h1>
        <div className="w-full h-[2px] bg-stone-900 my-2" />
        {abas?.arrayData.map((data, index) => {
          if (!isConnected) return <div key={index}>Соединение потеряно...</div>;

          return (
            <div className="flex gap-2 text-xl" key={index}>
              <p>Тег {index + 1}: </p>
              <p>{data}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default App;
