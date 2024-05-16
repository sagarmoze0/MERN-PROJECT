import './App.css'
import TransactionsListing from './page/transctionsTable';
import StatisticsComponent from './page/statistics';
import Checkout from './page/Checkout';
import { useState } from 'react';

function App() {
  const [showStatistics, setShowStatistics] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
    setShowCheckout(false); // Hide checkout when showing statistics
  };

  const toggleCheckout = () => {
    setShowCheckout(!showCheckout);
    setShowStatistics(false); // Hide statistics when showing checkout
  };

  return (
    <div className="App p-4">
      <div className=" border-black p-4">
        <h1 className="text-xl font-bold mb-4 flex items-center justify-center text-black">
          ShopiFy
        </h1>
        <nav className="bg-green-200 border border-black p-2 flex ">
       <div className="flex">
  <div className="cursor-pointer" onClick={toggleStatistics}>
    <h1 className="text-xl font-bold mb-2">Statistics</h1>
  </div>
  {/* Vertical line */}
  <div className="cursor-pointer border-l-2 border-black h-full ml-4 pl-4" onClick={toggleCheckout}>
    <h1 className="text-xl font-bold mb-2">Checkout</h1>
  </div>
</div>

      </nav>
      {showStatistics && <StatisticsComponent />}
      {showCheckout && <Checkout />}
        <TransactionsListing />
      </div>
     
    </div>
  );
}

export default App;
