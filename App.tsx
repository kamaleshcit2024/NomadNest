import React, { useState } from 'react';
import Layout from './components/Layout';
import TravelForm from './components/TravelForm';
import ResultsView from './components/ResultsView';
import ChatAssistant from './components/ChatAssistant';
import { DestinationsPage, CommunityPage, ResourcesPage } from './components/StaticPages';
import { TravelQuery, TravelReport, LoadingState, PageView } from './types';
import { generateTravelReport } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('HOME');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [report, setReport] = useState<TravelReport | null>(null);
  const [currentQuery, setCurrentQuery] = useState<TravelQuery | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [prefilledDestination, setPrefilledDestination] = useState<string>('');

  const handleSearch = async (query: TravelQuery) => {
    setLoadingState(LoadingState.LOADING);
    setReport(null);
    setCurrentQuery(query);
    setErrorMsg("");

    try {
      const data = await generateTravelReport(query);
      setReport(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("We encountered an issue fetching your travel data. Please ensure your API key is valid and try again.");
    }
  };

  const handlePlanTrip = (city: string) => {
    setPrefilledDestination(city);
    setCurrentPage('HOME');
  };

  const renderContent = () => {
    if (currentPage === 'DESTINATIONS') return <DestinationsPage onPlanTrip={handlePlanTrip} />;
    if (currentPage === 'COMMUNITY') return <CommunityPage />;
    if (currentPage === 'RESOURCES') return <ResourcesPage />;

    // Home Page Content
    return (
      <div className="min-h-[500px]">
        {/* Hero Section */}
        <div className="relative bg-slate-900 pb-32">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-30"
              src="https://picsum.photos/1920/1080?grayscale&blur=2"
              alt="World Map"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Navigate the World <span className="text-indigo-400">Without Borders</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300">
              Real-time visa requirements, safety advisories, and cultural insights powered by AI. 
              Relocate or travel with confidence.
            </p>
          </div>
        </div>

        <TravelForm 
          onSubmit={handleSearch} 
          isLoading={loadingState === LoadingState.LOADING} 
          initialDestination={prefilledDestination}
        />

        {loadingState === LoadingState.ERROR && (
           <div className="max-w-4xl mx-auto mt-12 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
             {errorMsg}
           </div>
        )}

        {loadingState === LoadingState.SUCCESS && report && (
          <div id="results">
            <ResultsView report={report} />
            <ChatAssistant context={`Origin: ${currentQuery?.origin}, Destination: ${currentQuery?.destination}`} />
          </div>
        )}

        {loadingState === LoadingState.IDLE && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Visa Check</h3>
                <p className="text-slate-600">Up-to-the-minute entry requirements for any nationality to any destination.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Safety Intelligence</h3>
                <p className="text-slate-600">Live monitoring of health protocols, security alerts, and travel restrictions.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Cultural Integration</h3>
                <p className="text-slate-600">Local etiquette, cost of living insights, and relocation tips for seamless adaptation.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;