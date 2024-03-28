import './App.css'
import TransactionsListing from './page/transctionsTable';
import StatisticsComponent from './page/statistics';
import { FaCircle } from 'react-icons/fa';
import BarChart from './page/barChart';
import { useState } from 'react';

function App() {
  const [showStatistics, setShowStatistics] = useState(false);
  const [barChat, setBarChart]=useState(false)
  return (
    <div className="App p-4">
    <div className=" bg-sky-950 border border-black p-4">
      <h1 className="text-xl font-bold mb-2 flex items-center justify-center text-white">
      Transaction</h1>
      <TransactionsListing />
    </div>
    <div className=" bg-green-200 border border-black p-4 ">
      <h1 className="text-xl font-bold mb-2 cursor-pointer"
      onClick={()=>setShowStatistics(!showStatistics)}>Show Statistics</h1>
     {showStatistics && <StatisticsComponent />}
    </div>
    <div className=" bg-violet-200 border border-black p-4">
      <h1 className="text-xl font-bold mb-2 cursor-pointer"
      onClick={()=>setBarChart(!barChat)}>Show Bar Chart</h1>
      {barChat && <BarChart />}
      
    </div>
  </div>
  );
}

export default App;
