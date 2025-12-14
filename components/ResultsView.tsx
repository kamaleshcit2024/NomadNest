import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FileText, ShieldAlert, Compass, ExternalLink, Map as MapIcon, Volume2, StopCircle, RefreshCw, Info, Utensils, Car, Bed, Coffee, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { TravelReport, GroundingLink } from '../types';
import { formatText } from '../utils/textFormatting';
import L from 'leaflet';

interface ResultsViewProps {
  report: TravelReport;
}

interface ChartData {
  origin: string;
  destination: string;
  data: {
    label: string;
    originPrice: number;
    destPrice: number;
  }[];
}

interface CurrencyData {
  code: string;
  name: string;
  rate: number;
}

interface TippingItem {
  category: string;
  advice: string;
  explanation: string;
}

interface MapPoint {
  name: string;
  day: number;
  lat: number;
  lng: number;
  desc: string;
}

interface MapData {
  center: { lat: number; lng: number };
  points: MapPoint[];
}

interface SafetyHotspot {
  name: string;
  lat: number;
  lng: number;
  riskLevel: string;
  description: string;
}

interface SafetyData {
  center: { lat: number; lng: number };
  hotspots: SafetyHotspot[];
}

const CostChart: React.FC<{ data: ChartData }> = ({ data }) => {
  if (!data || !data.data || data.data.length === 0) return null;

  const { origin, destination, data: items } = data;
  
  // Find max value for scaling the bars
  const maxValue = Math.max(
    ...items.map((item) => Math.max(item.originPrice, item.destPrice))
  ) || 1;

  return (
    <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-indigo-100 p-1.5 rounded-lg">
           <Compass className="w-4 h-4 text-indigo-600"/>
        </span>
        Cost Comparison (USD)
      </h4>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              <span>{item.label}</span>
            </div>
            <div className="space-y-3">
              {/* Origin Bar */}
              <div className="flex items-center gap-3">
                 <div className="w-24 text-xs font-semibold text-slate-500 truncate text-right" title={origin}>
                    {origin}
                 </div>
                 <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(item.originPrice / maxValue) * 100}%` }}
                    />
                 </div>
                 <div className="w-16 text-xs font-bold text-slate-600 text-right">${item.originPrice.toFixed(2)}</div>
              </div>
              
              {/* Destination Bar */}
              <div className="flex items-center gap-3">
                 <div className="w-24 text-xs font-semibold text-indigo-600 truncate text-right" title={destination}>
                    {destination}
                 </div>
                 <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(item.destPrice / maxValue) * 100}%` }}
                    />
                 </div>
                 <div className="w-16 text-xs font-bold text-indigo-600 text-right">${item.destPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-6 text-center italic">
        * Estimated average costs in USD based on recent data.
      </p>
    </div>
  );
};

const CurrencyConverter: React.FC<{ data: CurrencyData }> = ({ data }) => {
  const [amount, setAmount] = useState<number>(1);
  
  if (!data || !data.rate) return null;

  const converted = (amount * data.rate).toFixed(2);
  
  return (
    <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner animate-fade-in">
       <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-emerald-100 p-1.5 rounded-lg">
             <RefreshCw className="w-4 h-4 text-emerald-600"/>
          </span>
          Quick Currency Converter
       </h4>
       
       <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Input Area */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200 w-full md:w-auto flex-grow max-w-md">
             <div className="flex flex-col flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase mb-1">USD ($)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full font-bold text-xl text-slate-800 focus:outline-none border-b border-slate-200 focus:border-indigo-500 transition-colors bg-transparent"
                />
             </div>
             <div className="text-slate-300 font-light text-2xl">=</div>
             <div className="flex flex-col flex-1 items-end">
                <label className="text-xs font-bold text-slate-400 uppercase mb-1">{data.code}</label>
                <div className="font-bold text-xl text-indigo-600 truncate w-full text-right">
                   {Number(converted).toLocaleString()} <span className="text-sm font-medium text-slate-500">{data.code}</span>
                </div>
             </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex gap-2 flex-wrap justify-center">
             {[10, 50, 100].map(val => (
               <button 
                 key={val}
                 onClick={() => setAmount(val)}
                 className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
               >
                 ${val}
               </button>
             ))}
          </div>
       </div>
       <p className="text-xs text-slate-400 mt-3 text-center md:text-left">
         * Rate: 1 USD ≈ {data.rate} {data.code} ({data.name}). Rates may vary.
       </p>
    </div>
  );
}

const TippingGuide: React.FC<{ data: TippingItem[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const getIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('restaurant') || lower.includes('food') || lower.includes('dining')) return <Utensils className="w-5 h-5" />;
    if (lower.includes('taxi') || lower.includes('transport') || lower.includes('driver')) return <Car className="w-5 h-5" />;
    if (lower.includes('hotel') || lower.includes('housekeeping') || lower.includes('porter')) return <Bed className="w-5 h-5" />;
    if (lower.includes('guide') || lower.includes('tour')) return <MapIcon className="w-5 h-5" />;
    return <Coffee className="w-5 h-5" />;
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in">
       <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-amber-100 p-1.5 rounded-lg">
             <DollarSign className="w-4 h-4 text-amber-600"/>
          </span>
          Tipping Etiquette Guide
       </h4>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {data.map((item, idx) => (
           <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm mb-3">
               {getIcon(item.category)}
             </div>
             <div className="font-bold text-slate-700 text-sm mb-1">{item.category}</div>
             <div className="font-extrabold text-indigo-600 text-lg mb-1">{item.advice}</div>
             <div className="text-xs text-slate-500 leading-tight">{item.explanation}</div>
           </div>
         ))}
       </div>
    </div>
  );
};

const ItineraryMap: React.FC<{ data: MapData }> = ({ data }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !data) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const { center, points } = data;
    const map = L.map(mapContainer.current).setView([center.lat, center.lng], 12);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    points.forEach(point => {
      const icon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #4f46e5; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">D${point.day}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="font-sans">
            <div class="text-xs font-bold text-indigo-600 uppercase mb-1">Day ${point.day}</div>
            <h3 class="font-bold text-sm text-slate-900 mb-1">${point.name}</h3>
            <p class="text-xs text-slate-600">${point.desc}</p>
          </div>
        `);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div className="mt-8 rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
         <h4 className="font-bold text-slate-700 flex items-center gap-2">
           <MapIcon className="w-4 h-4 text-indigo-600" />
           Interactive Itinerary Map
         </h4>
         <div className="text-xs text-slate-500 flex items-center gap-1">
           <Info className="w-3 h-3"/> Click markers for details
         </div>
      </div>
      <div ref={mapContainer} className="h-[400px] w-full z-0 relative" />
    </div>
  );
};

const SafetyMap: React.FC<{ data: SafetyData }> = ({ data }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
  
    useEffect(() => {
      if (!mapContainer.current || !data) return;
  
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
  
      const { center, hotspots } = data;
      const map = L.map(mapContainer.current).setView([center.lat, center.lng], 12);
      mapInstance.current = map;
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
  
      hotspots.forEach(spot => {
        let bgColor = '#ef4444'; // Red for High
        let borderColor = '#b91c1c';
        
        const risk = spot.riskLevel.toLowerCase();
        if (risk.includes('medium')) {
            bgColor = '#f97316'; // Orange
            borderColor = '#c2410c';
        } else if (risk.includes('safe') || risk.includes('low')) {
            bgColor = '#10b981'; // Green
            borderColor = '#047857';
        }
  
        const icon = L.divIcon({
          className: 'custom-map-icon',
          html: `<div style="background-color: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 0 10px ${bgColor}80;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10]
        });
  
        L.marker([spot.lat, spot.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="font-sans">
              <div class="text-xs font-bold uppercase mb-1" style="color: ${borderColor}">${spot.riskLevel}</div>
              <h3 class="font-bold text-sm text-slate-900 mb-1">${spot.name}</h3>
              <p class="text-xs text-slate-600">${spot.description}</p>
            </div>
          `);
      });
  
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }, [data]);
  
    return (
      <div className="mt-8 rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
           <h4 className="font-bold text-slate-700 flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-red-600" />
             Regional Safety Hotspots
           </h4>
           <div className="flex gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Medium</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Safe Zone</span>
           </div>
        </div>
        <div ref={mapContainer} className="h-[400px] w-full z-0 relative" />
      </div>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'visa' | 'safety' | 'culture' | 'itinerary'>('visa');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Parse structured data specifically for the Cultural Compass section
  const parsedCultureSection = useMemo(() => {
    if (!report.cultureSection) return { text: '', chart: null, currency: null, tipping: null };
    
    let cleanText = report.cultureSection;
    let chartData = null;
    let currencyData = null;
    let tippingData = null;

    // Extract Chart Data
    const chartMatch = cleanText.match(/<chart_data>([\s\S]*?)<\/chart_data>/);
    if (chartMatch && chartMatch[1]) {
        try {
            chartData = JSON.parse(chartMatch[1]);
            cleanText = cleanText.replace(/<chart_data>([\s\S]*?)<\/chart_data>/, '');
        } catch (e) { console.error("Failed to parse chart", e); }
    }

    // Extract Currency Data
    const currencyMatch = cleanText.match(/<currency_data>([\s\S]*?)<\/currency_data>/);
    if (currencyMatch && currencyMatch[1]) {
        try {
            currencyData = JSON.parse(currencyMatch[1]);
            cleanText = cleanText.replace(/<currency_data>([\s\S]*?)<\/currency_data>/, '');
        } catch (e) { console.error("Failed to parse currency", e); }
    }
    
    // Extract Tipping Data
    const tippingMatch = cleanText.match(/<tipping_data>([\s\S]*?)<\/tipping_data>/);
    if (tippingMatch && tippingMatch[1]) {
        try {
            tippingData = JSON.parse(tippingMatch[1]);
            cleanText = cleanText.replace(/<tipping_data>([\s\S]*?)<\/tipping_data>/, '');
        } catch (e) { console.error("Failed to parse tipping", e); }
    }

    return {
        text: cleanText.trim(),
        chart: chartData as ChartData,
        currency: currencyData as CurrencyData,
        tipping: tippingData as TippingItem[]
    };
  }, [report.cultureSection]);

  // Parse structured data specifically for the Itinerary section (Map)
  const parsedItinerarySection = useMemo(() => {
    if (!report.itinerarySection) return { text: '', map: null };
    
    let cleanText = report.itinerarySection;
    let mapData = null;

    // Extract Map Data
    const mapMatch = cleanText.match(/<itinerary_data>([\s\S]*?)<\/itinerary_data>/);
    if (mapMatch && mapMatch[1]) {
        try {
            mapData = JSON.parse(mapMatch[1]);
            cleanText = cleanText.replace(/<itinerary_data>([\s\S]*?)<\/itinerary_data>/, '');
        } catch (e) { console.error("Failed to parse map data", e); }
    }

    return {
      text: cleanText.trim(),
      map: mapData as MapData
    };
  }, [report.itinerarySection]);

  // Parse structured data for Safety Section
  const parsedSafetySection = useMemo(() => {
    if (!report.safetySection) return { text: '', map: null };
    
    let cleanText = report.safetySection;
    let mapData = null;

    // Extract Map Data
    const mapMatch = cleanText.match(/<safety_data>([\s\S]*?)<\/safety_data>/);
    if (mapMatch && mapMatch[1]) {
        try {
            mapData = JSON.parse(mapMatch[1]);
            cleanText = cleanText.replace(/<safety_data>([\s\S]*?)<\/safety_data>/, '');
        } catch (e) { console.error("Failed to parse safety map data", e); }
    }

    return {
      text: cleanText.trim(),
      map: mapData as SafetyData
    };
  }, [report.safetySection]);


  // Stop speaking if component unmounts or tab changes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [activeTab]);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown chars and hidden tags for smoother speech
    let cleanText = text.replace(/[*#|]/g, '');
    cleanText = cleanText.replace(/<chart_data>[\s\S]*?<\/chart_data>/g, '');
    cleanText = cleanText.replace(/<currency_data>[\s\S]*?<\/currency_data>/g, '');
    cleanText = cleanText.replace(/<tipping_data>[\s\S]*?<\/tipping_data>/g, '');
    cleanText = cleanText.replace(/<itinerary_data>[\s\S]*?<\/itinerary_data>/g, '');
    cleanText = cleanText.replace(/<safety_data>[\s\S]*?<\/safety_data>/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode, textContent: string) => (
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-lg border flex-grow mr-4 ${
         activeTab === 'visa' ? 'bg-indigo-50 border-indigo-100 text-indigo-900' :
         activeTab === 'safety' ? 'bg-red-50 border-red-100 text-red-900' :
         activeTab === 'culture' ? 'bg-teal-50 border-teal-100 text-teal-900' :
         'bg-amber-50 border-amber-100 text-amber-900'
      }`}>
        <h3 className="font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
      </div>
      <button
        onClick={() => handleSpeak(textContent)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
        title={isSpeaking ? "Stop Reading" : "Read Aloud"}
      >
        {isSpeaking ? <StopCircle className="w-6 h-6 text-red-500 animate-pulse" /> : <Volume2 className="w-6 h-6" />}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-200">
          <button
            onClick={() => setActiveTab('visa')}
            className={`flex-1 min-w-[120px] py-4 px-4 text-center font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2
              ${activeTab === 'visa' 
                ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            Visa & Entry
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`flex-1 min-w-[120px] py-4 px-4 text-center font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2
              ${activeTab === 'safety' 
                ? 'border-b-2 border-red-500 text-red-600 bg-red-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />
            Advisory
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`flex-1 min-w-[120px] py-4 px-4 text-center font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2
              ${activeTab === 'culture' 
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Compass className="w-4 h-4 md:w-5 md:h-5" />
            Cultural
          </button>
           <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 min-w-[120px] py-4 px-4 text-center font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2
              ${activeTab === 'itinerary' 
                ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <MapIcon className="w-4 h-4 md:w-5 md:h-5" />
            Itinerary
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
          {activeTab === 'visa' && (
            <div className="animate-fade-in space-y-2">
              {renderSectionHeader('Entry Summary', <FileText className="w-5 h-5"/>, report.visaSection)}
              {formatText(report.visaSection)}
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="animate-fade-in space-y-2">
              {renderSectionHeader('Safety Alert Level', <ShieldAlert className="w-5 h-5"/>, parsedSafetySection.text)}
              {formatText(parsedSafetySection.text)}
              {parsedSafetySection.map && (
                <SafetyMap data={parsedSafetySection.map} />
              )}
            </div>
          )}

          {activeTab === 'culture' && (
            <div className="animate-fade-in space-y-2">
              {renderSectionHeader('Cultural Deep Dive & Costs', <Compass className="w-5 h-5"/>, parsedCultureSection.text)}
              {formatText(parsedCultureSection.text)}
              {/* Insert Tipping Guide Here */}
              {parsedCultureSection.tipping && (
                <TippingGuide data={parsedCultureSection.tipping} />
              )}
              {/* Insert Chart Here */}
              {parsedCultureSection.chart && (
                <CostChart data={parsedCultureSection.chart} />
              )}
              {/* Insert Currency Converter Here */}
              {parsedCultureSection.currency && (
                <CurrencyConverter data={parsedCultureSection.currency} />
              )}
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="animate-fade-in space-y-2">
               {renderSectionHeader('AI-Curated 5-Day Plan', <MapIcon className="w-5 h-5"/>, parsedItinerarySection.text)}
              {formatText(parsedItinerarySection.text)}
              {/* Insert Map Here */}
              {parsedItinerarySection.map && (
                <ItineraryMap data={parsedItinerarySection.map} />
              )}
            </div>
          )}
        </div>

        {/* Citations / Grounding */}
        {report.groundingLinks.length > 0 && (
          <div className="bg-slate-50 p-4 border-t border-slate-200">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Sources & References</h4>
             <div className="flex flex-wrap gap-2">
               {report.groundingLinks.map((link, idx) => (
                 <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-indigo-600 hover:text-indigo-800 hover:border-indigo-300 transition-colors"
                 >
                   {link.title.length > 30 ? link.title.substring(0, 30) + '...' : link.title}
                   <ExternalLink className="w-3 h-3" />
                 </a>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsView;