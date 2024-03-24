import './App.css'
import TransactionsListing from './page/transctionsTable';
import StatisticsComponent from './page/statistics';
import BarChart from './page/barChart';

function App() {
  return (
    <div className="App p-4">
    <div className=" bg-yellow-200 border border-black p-4 mb-4">
      <h1 className="text-xl font-bold mb-2">Transaction</h1>
      <TransactionsListing />
    </div>
    <div className=" bg-green-200 border border-black p-4 mb-4">
      <h1 className="text-xl font-bold mb-2">Statistics</h1>
      <StatisticsComponent />
    </div>
    <div className=" bg-violet-200 border border-black p-4">
      <h1 className="text-xl font-bold mb-2">Bar Chart</h1>
      <BarChart />
    </div>
  </div>
  );
}

export default App;
