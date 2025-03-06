import React from 'react';
import { Leaf, Droplets, Zap, BarChart3, Building2 } from 'lucide-react';
import Card from './ui/Card';

interface EnvironmentalImpactStatsProps {
  className?: string;
}

const EnvironmentalImpactStats: React.FC<EnvironmentalImpactStatsProps> = ({ className = '' }) => {
  // In a real application, these would come from an API or database
  // For now, we'll use static data for demonstration
  const stats = {
    co2Reduction: 1250, // tons of CO2 per year
    waterSaved: 8.5, // million liters per year
    energySaved: 3.2, // million kWh per year
    renovatedProperties: 78, // number of properties renovated
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Environmental Impact</h2>
        <div className="flex items-center text-slate-400 text-sm">
          <BarChart3 size={16} className="mr-1" />
          <span>Updated monthly</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-700/20">
          <div className="flex items-start">
            <div className="bg-green-500/20 p-3 rounded-xl mr-4">
              <Leaf className="text-green-500" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.co2Reduction.toLocaleString()}
                <span className="text-lg font-normal text-green-400 ml-1">tons</span>
              </div>
              <div className="text-slate-300">CO₂ emissions reduced annually</div>
              <div className="text-green-400 text-sm mt-2">
                Equivalent to planting {(stats.co2Reduction * 45).toLocaleString()} trees
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/20">
          <div className="flex items-start">
            <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
              <Droplets className="text-blue-500" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.waterSaved.toLocaleString()}
                <span className="text-lg font-normal text-blue-400 ml-1">million L</span>
              </div>
              <div className="text-slate-300">Water saved annually</div>
              <div className="text-blue-400 text-sm mt-2">
                Enough to supply {(stats.waterSaved * 170).toLocaleString()} households
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-700/20">
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-3 rounded-xl mr-4">
              <Zap className="text-amber-500" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.energySaved.toLocaleString()}
                <span className="text-lg font-normal text-amber-400 ml-1">million kWh</span>
              </div>
              <div className="text-slate-300">Energy saved annually</div>
              <div className="text-amber-400 text-sm mt-2">
                Equivalent to {(stats.energySaved * 300).toLocaleString()} homes' yearly usage
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/20">
          <div className="flex items-start">
            <div className="bg-purple-500/20 p-3 rounded-xl mr-4">
              <Building2 className="text-purple-500" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.renovatedProperties}
                <span className="text-lg font-normal text-purple-400 ml-1">properties</span>
              </div>
              <div className="text-slate-300">Buildings renovated to date</div>
              <div className="text-purple-400 text-sm mt-2">
                Housing {(stats.renovatedProperties * 3.5).toFixed(0)} people in need
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
        <div className="flex items-start">
          <div className="bg-orange-500/20 p-2 rounded-full mr-3 mt-0.5">
            <Leaf className="text-orange-500" size={16} />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">How We Calculate Impact</h3>
            <p className="text-slate-300 text-sm">
              Our environmental impact metrics are calculated based on before/after measurements of renovated properties, 
              including energy consumption, water usage, and carbon footprint. These figures are independently verified 
              by environmental certification bodies and updated monthly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpactStats;
