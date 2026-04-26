import { TrendingUp, ArrowDownCircle, DollarSign, Wallet } from 'lucide-react';

const Earnings = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8">Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Available for payout</p>
          <p className="text-4xl font-black text-gray-900 mb-6">$0.00</p>
          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-primary/20">
            Request payout
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Monthly breakdown</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="h-40 bg-gray-50 rounded-2xl flex items-end justify-between p-4 gap-2">
            {[40, 20, 60, 30, 80, 40, 90, 50, 70, 30, 50, 20].map((h, i) => (
              <div key={i} className="bg-primary/20 hover:bg-primary transition-all rounded-t-lg flex-1" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        <div className="p-8 border-b">
          <h2 className="text-xl font-bold">Payout history</h2>
        </div>
        <div className="p-8">
          <div className="text-center py-12 text-gray-400">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No payouts have been processed yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Earnings;
