import React from 'react';
import { Property } from '../services/supabaseService';
import { Wrench, Leaf, Thermometer, Shield, Wind, CheckCircle } from 'lucide-react';

interface RenovationProgressProps {
  property: Property;
}

const RenovationProgress: React.FC<RenovationProgressProps> = ({ property }) => {
  // Only show for properties in renovating status
  if (property.status !== 'renovating') {
    return null;
  }

  // Calculate a random progress percentage based on property ID
  // In a real app, this would come from the database
  const getProgressPercentage = () => {
    // Use the last character of the ID to generate a number between 10-90%
    const lastChar = property.id.charAt(property.id.length - 1);
    const base = parseInt(lastChar, 16) || 8; // Convert hex to decimal, default to 8
    return Math.max(10, Math.min(90, base * 6)); // Scale to 10-90%
  };

  const progressPercentage = getProgressPercentage();
  
  // Determine which renovation tasks are "complete" based on progress
  const isHeatingComplete = progressPercentage > 30;
  const isInsulationComplete = progressPercentage > 50;
  const isVentilationComplete = progressPercentage > 70;
  const isFinalInspectionComplete = progressPercentage > 85;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Renovation Progress</h3>
        <div className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-sm flex items-center">
          <Wrench size={16} className="mr-2" />
          <span>In Progress</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-slate-300">Overall Progress</span>
          <span className="text-white font-medium">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${isHeatingComplete ? 'bg-green-500/20 text-green-500' : 'bg-slate-600/20 text-slate-400'}`}>
            {isHeatingComplete ? <CheckCircle size={18} /> : <Thermometer size={18} />}
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="text-white font-medium">Heating System Upgrade</h4>
              {isHeatingComplete && (
                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Complete</span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {isHeatingComplete 
                ? 'New energy-efficient heating system installed.' 
                : 'Installing a modern, energy-efficient heating system.'}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${isInsulationComplete ? 'bg-green-500/20 text-green-500' : 'bg-slate-600/20 text-slate-400'}`}>
            {isInsulationComplete ? <CheckCircle size={18} /> : <Shield size={18} />}
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="text-white font-medium">Insulation Improvement</h4>
              {isInsulationComplete && (
                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Complete</span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {isInsulationComplete 
                ? 'Walls, roof, and windows have been properly insulated.' 
                : 'Upgrading insulation in walls, roof, and windows.'}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${isVentilationComplete ? 'bg-green-500/20 text-green-500' : 'bg-slate-600/20 text-slate-400'}`}>
            {isVentilationComplete ? <CheckCircle size={18} /> : <Wind size={18} />}
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="text-white font-medium">Ventilation System</h4>
              {isVentilationComplete && (
                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Complete</span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {isVentilationComplete 
                ? 'Modern ventilation system installed for improved air quality.' 
                : 'Installing proper ventilation system for better air quality.'}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${isFinalInspectionComplete ? 'bg-green-500/20 text-green-500' : 'bg-slate-600/20 text-slate-400'}`}>
            {isFinalInspectionComplete ? <CheckCircle size={18} /> : <Leaf size={18} />}
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="text-white font-medium">Final Inspection</h4>
              {isFinalInspectionComplete && (
                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Complete</span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {isFinalInspectionComplete 
                ? 'Final inspection completed. Property almost ready for occupancy.' 
                : 'Verifying all renovations meet environmental standards.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center">
          <div className="bg-green-500/20 p-2 rounded-full mr-3">
            <Leaf className="text-green-500" size={18} />
          </div>
          <div>
            <h4 className="text-white font-medium">Expected EPC Rating After Renovation</h4>
            <div className="flex items-center mt-1">
              <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-500 font-medium">B</span>
              <span className="ml-2 text-slate-400 text-sm">Significant improvement from original rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenovationProgress;
