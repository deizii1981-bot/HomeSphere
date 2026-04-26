import { Calendar, BarChart3, PieChart } from 'lucide-react';

const Stats = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8">Hosting Stats</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Occupancy Heatmap
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className={`h-10 rounded-lg ${i % 5 === 0 ? 'bg-primary' : i % 3 === 0 ? 'bg-primary/40' : 'bg-gray-100'}`}></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-400 font-medium text-center">Last 35 days occupancy trends</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Nights by Property
          </h2>
          <div className="space-y-6">
            <div className="text-center py-12 text-gray-300 italic font-medium">
              Start hosting to see your property performance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Stats;
