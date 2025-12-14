import React, { useState } from 'react';
import { MapPin, Users, BookOpen, ArrowRight, Star, Search, DollarSign, Briefcase, ChevronLeft, ExternalLink, Wifi, Shield, Sun, Calendar, MessageSquare, ThumbsUp, Clock, Tag, Send, PlusCircle, User, CheckCircle } from 'lucide-react';
import { getTopics, replyToTopic, compareCostOfLiving } from '../services/geminiService';
import { useEffect } from 'react';

// --- DESTINATIONS COMPONENTS ---

interface DestinationData {
  city: string;
  country: string;
  tag: string;
  img: string;
  description: string;
  stats: {
    cost: string;
    internet: string;
    safety: string;
    weather: string;
  };
  highlights: string[];
}

const destinationsData: DestinationData[] = [
  {
    city: 'Lisbon',
    country: 'Portugal',
    tag: 'Digital Nomad Hub',
    img: 'https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&w=800&q=80',
    description: "Lisbon offers a perfect blend of traditional heritage and striking modernism. With its sunny weather, vibrant tech scene, and welcoming community, it has become Europe's premier digital nomad capital.",
    stats: { cost: "$2,200/mo", internet: "120 Mbps", safety: "High", weather: "Mild" },
    highlights: ["LxFactory Creative Hub", "Alfama District", "Pastéis de Belém", "Sintra Day Trip"]
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    tag: 'Tropical Paradise',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: "The island of gods offers a spiritual and relaxed atmosphere. Canggu and Ubud are the main hubs, providing lush rice terraces, world-class surfing, and an abundance of coworking spaces.",
    stats: { cost: "$1,400/mo", internet: "45 Mbps", safety: "Moderate", weather: "Tropical" },
    highlights: ["Ubud Monkey Forest", "Canggu Beach Clubs", "Uluwatu Temple", "Tegalalang Rice Terrace"]
  },
  {
    city: 'Mexico City',
    country: 'Mexico',
    tag: 'Cultural Vibrant',
    img: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80',
    description: "A sprawling metropolis that captivates with its history, culinary scene, and tree-lined neighborhoods like Roma and Condesa. It's a high-energy city with rich culture at an affordable price.",
    stats: { cost: "$1,800/mo", internet: "60 Mbps", safety: "Moderate", weather: "Temperate" },
    highlights: ["Roma & Condesa", "Chapultepec Park", "Frida Kahlo Museum", "Street Food Tours"]
  },
  {
    city: 'Chiang Mai',
    country: 'Thailand',
    tag: 'Budget Friendly',
    img: 'https://images.unsplash.com/photo-1598218146740-420993952f14?auto=format&fit=crop&w=800&q=80',
    description: "The digital nomad capital of the world for beginners. Incredible food, ancient temples, low cost of living, and a dense concentration of cafes make it an easy place to land and work.",
    stats: { cost: "$1,000/mo", internet: "200 Mbps", safety: "High", weather: "Hot/Hazy" },
    highlights: ["Nimman Road Cafes", "Doi Suthep", "Sunday Night Market", "Sticky Waterfalls"]
  },
  {
    city: 'Berlin',
    country: 'Germany',
    tag: 'Tech & Art',
    img: 'https://images.unsplash.com/photo-1599946347371-3e18161749ea?auto=format&fit=crop&w=800&q=80',
    description: "Gritty, historic, and endlessly cool. Berlin attracts creatives and tech talent from around the globe. It offers a legendary nightlife, diverse history, and a very liberal atmosphere.",
    stats: { cost: "$2,800/mo", internet: "100 Mbps", safety: "High", weather: "Seasonal" },
    highlights: ["Kreuzberg vibe", "East Side Gallery", "Tiergarten", "Museum Island"]
  },
  {
    city: 'Medellin',
    country: 'Colombia',
    tag: 'Spring City',
    img: 'https://images.unsplash.com/photo-1591535732159-99227f2771d9?auto=format&fit=crop&w=800&q=80',
    description: "The City of Eternal Spring has transformed into a major innovation hub. El Poblado district is teeming with nomads, rooftop bars, and greenery, all nestled in a stunning valley.",
    stats: { cost: "$1,300/mo", internet: "50 Mbps", safety: "Moderate", weather: "Spring-like" },
    highlights: ["Comuna 13 Tour", "El Poblado", "Guatapé Day Trip", "Botanical Gardens"]
  },
];

interface DestinationDetailProps {
  destination: DestinationData;
  onBack: () => void;
  onPlanTrip: () => void;
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, onBack, onPlanTrip }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Destinations
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src={destination.img}
            alt={destination.city}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase bg-indigo-600 rounded-full mb-3">
              {destination.tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{destination.city}</h1>
            <p className="text-xl text-slate-200 font-medium flex items-center gap-2">
              <MapPin className="w-5 h-5" /> {destination.country}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">About the destination</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {destination.description}
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-4">Key Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {destination.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-fit">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Nomad Stats</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <DollarSign className="w-5 h-5" />
                    <span>Est. Cost</span>
                  </div>
                  <span className="font-bold text-slate-900">{destination.stats.cost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Wifi className="w-5 h-5" />
                    <span>Internet</span>
                  </div>
                  <span className="font-bold text-slate-900">{destination.stats.internet}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Shield className="w-5 h-5" />
                    <span>Safety</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-sm ${destination.stats.safety === 'High' ? 'bg-green-100 text-green-700' :
                      destination.stats.safety === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>{destination.stats.safety}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Sun className="w-5 h-5" />
                    <span>Weather</span>
                  </div>
                  <span className="font-bold text-slate-900">{destination.stats.weather}</span>
                </div>
              </div>

              <button
                onClick={onPlanTrip}
                className="w-full mt-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Plan Trip Here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DestinationsPageProps {
  onPlanTrip: (city: string) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onPlanTrip }) => {
  const [selectedDest, setSelectedDest] = useState<DestinationData | null>(null);

  if (selectedDest) {
    return (
      <DestinationDetail
        destination={selectedDest}
        onBack={() => setSelectedDest(null)}
        onPlanTrip={() => onPlanTrip(selectedDest.city)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Top Nomad Destinations
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
          Curated spots offering the best balance of community, cost, and culture.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinationsData.map((dest, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedDest(dest)}>
              <img src={dest.img} alt={dest.city} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 shadow-sm">
                {dest.stats.cost}
              </div>
            </div>
            <div className="p-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full mb-2">
                {dest.tag}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{dest.city}</h3>
              <p className="text-slate-500 text-sm mb-4">{dest.country}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <button
                  onClick={() => setSelectedDest(dest)}
                  className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMMUNITY COMPONENTS ---

interface Reply {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  avatar?: string;
}

interface Topic {
  id: number;
  title: string;
  author: string;
  content: string;
  repliesCount: number;
  views: number;
  tags: string[];
  likes: number;
  timestamp: string;
  replies: Reply[];
  avatar?: string;
}

// Removed static TOPICS_DATA

const TopicDetail: React.FC<{ topic: Topic; onBack: () => void }> = ({ topic, onBack }) => {
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState<Reply[]>(topic.replies);

  const handlePostReply = async () => {
    if (!replyText.trim()) return;
    try {
      const newReply = await replyToTopic(topic.id, { content: replyText, author: "You" });
      setLocalReplies([...localReplies, newReply]);
      setReplyText('');
    } catch (error) {
      console.error("Failed to post reply:", error);
      alert("Failed to post reply. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Discussions
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {topic.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {topic.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <img src={topic.avatar || "https://i.pravatar.cc/150"} alt={topic.author} className="w-12 h-12 rounded-full border-2 border-indigo-100" />
            <div>
              <div className="font-bold text-slate-900">{topic.author}</div>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <Clock className="w-3 h-3" /> {topic.timestamp} • {topic.views} views
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg mb-8">
            {topic.content}
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
              <ThumbsUp className="w-5 h-5" /> {topic.likes} Likes
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
              <MessageSquare className="w-5 h-5" /> {localReplies.length} Replies
            </button>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-slate-50 p-8 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Responses ({localReplies.length})</h3>

          <div className="space-y-6 mb-8">
            {localReplies.map((reply) => (
              <div key={reply.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <img src={reply.avatar || "https://i.pravatar.cc/150"} alt={reply.author} className="w-10 h-10 rounded-full border border-slate-200" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{reply.author}</span>
                        <span className="text-slate-400 text-xs ml-2">{reply.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{reply.content}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button className="text-xs text-slate-400 hover:text-indigo-600 font-medium flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {reply.likes || 0} Helpful
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" /> Join the conversation
            </h4>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your thoughts or advice..."
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32 text-slate-700 bg-slate-50 focus:bg-white transition-all"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePostReply}
                disabled={!replyText.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CommunityPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <Users className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Community Forum</h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
          Connect with fellow travelers, share experiences, and ask for advice.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 animate-fade-in">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search topics, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
          />
        </div>
        <button className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2">
          <PlusCircle className="w-5 h-5" /> New Topic
        </button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden animate-fade-in">
        <div className="hidden md:flex bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex-grow">Topic</div>
          <div className="w-24 text-center">Replies</div>
          <div className="w-24 text-center">Views</div>
          <div className="w-32 text-right">Activity</div>
        </div>

        {filteredTopics.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wide group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2 md:mb-0">
                      {topic.content}
                    </p>
                    <div className="md:hidden flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {topic.repliesCount}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {topic.views}</span>
                      <span>{topic.timestamp}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 flex-shrink-0">
                    <div className="w-24 text-center font-medium group-hover:text-indigo-600">
                      {topic.repliesCount}
                    </div>
                    <div className="w-24 text-center">
                      {topic.views}
                    </div>
                    <div className="w-32 text-right text-xs">
                      <div className="font-bold text-slate-700">{topic.timestamp}</div>
                      <div>by {topic.author}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No topics found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- RESOURCES TOOLS COMPONENTS ---

const VisaGuideTool = ({ onBack }: { onBack: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const countries = [
    { name: 'Japan', status: 'Visa Free (90 days)', type: 'Tourist' },
    { name: 'Thailand', status: 'Visa Exemption (60 days)', type: 'Tourist' },
    { name: 'Vietnam', status: 'E-Visa Required', type: 'Tourist/Business' },
    { name: 'Brazil', status: 'Visa Free', type: 'Tourist' },
    { name: 'France (Schengen)', status: 'Visa Free (90 days)', type: 'Tourist' },
    { name: 'India', status: 'E-Visa Required', type: 'Tourist' },
    { name: 'Indonesia', status: 'Visa On Arrival (30 days)', type: 'Tourist' },
    { name: 'United Kingdom', status: 'Visa Free (6 months)', type: 'Tourist' },
    { name: 'China', status: 'Visa Required / 144h Transit', type: 'Tourist' },
    { name: 'Mexico', status: 'Visa Free (180 days)', type: 'Tourist' },
  ];

  const filtered = countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Resources
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600" /> Global Visa Guide 2024
        </h3>
        <p className="text-slate-600 mb-6">Quick reference for common tourist visa requirements for major destinations.</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search destination country..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {filtered.map((c, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all">
              <span className="font-bold text-slate-800 text-lg">{c.name}</span>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-1 ${c.status.toLowerCase().includes('free') || c.status.toLowerCase().includes('exemption')
                    ? 'bg-emerald-100 text-emerald-700'
                    : c.status.toLowerCase().includes('arrival')
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                  {c.status}
                </span>
                <p className="text-xs text-slate-500 font-medium">{c.type}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No countries found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CostCalculatorTool = ({ onBack }: { onBack: () => void }) => {
  const [cityA, setCityA] = useState('');
  const [cityB, setCityB] = useState('');
  const [result, setResult] = useState<null | { percentage: number; verdict: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await compareCostOfLiving(cityA, cityB);
      setResult(data);
    } catch (error) {
      console.error("Error comparing costs:", error);
      alert("Failed to compare costs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Resources
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-indigo-600" /> Cost of Living Calculator
        </h3>
        <p className="text-slate-600 mb-8">Compare monthly expenses between your current city and your next destination.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Current City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. New York"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={cityA}
                onChange={(e) => setCityA(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Target City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. Bali"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={cityB}
                onChange={(e) => setCityB(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!cityA || !cityB}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-200"
        >
          Compare Costs
        </button>

        {loading && (
          <div className="mt-10 text-center text-slate-500 animate-pulse">
            Comparing costs via AI...
          </div>
        )}

        {result !== null && (
          <div className="mt-10 p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center animate-fade-in-up">
            <p className="text-xl text-slate-600 mb-2">
              Living in <span className="font-bold text-indigo-900">{cityB}</span> is approximately
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className={`text-6xl font-extrabold ${result.verdict === 'CHEAPER' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {Math.abs(result.percentage)}%
              </span>
              <span className={`text-2xl font-bold ${result.verdict === 'CHEAPER' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {result.verdict}
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              than <span className="font-bold text-slate-700">{cityA}</span> based on real-time data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const JobBoardsTool = ({ onBack }: { onBack: () => void }) => {
  const boards = [
    { name: "We Work Remotely", cat: "General", desc: "Largest remote work community in the world.", link: "#" },
    { name: "RemoteOK", cat: "Tech/Marketing", desc: "Live aggregator of all remote jobs.", link: "#" },
    { name: "FlexJobs", cat: "Vetted", desc: "Hand-screened remote and flexible jobs.", link: "#" },
    { name: "Working Nomads", cat: "Digital Nomad", desc: "Curated lists of digital nomad jobs.", link: "#" },
    { name: "Upwork", cat: "Freelance", desc: "Connect with clients for freelance projects.", link: "#" },
    { name: "Wellfound", cat: "Startup", desc: "Unique jobs at startups and tech companies.", link: "#" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Resources
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-600" /> Remote Job Boards
        </h3>
        <p className="text-slate-600 mb-8">Trusted platforms to find your next remote opportunity.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boards.map((b, i) => (
            <a
              key={i}
              href={b.link}
              onClick={(e) => e.preventDefault()} // Prevent actual navigation for demo
              className="flex flex-col p-5 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{b.name}</h4>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </div>
              <p className="text-sm text-slate-500 mb-4 flex-grow">{b.desc}</p>
              <div className="mt-auto">
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-semibold group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                  {b.cat}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const InsuranceTool = ({ onBack }: { onBack: () => void }) => {
  const providers = [
    {
      name: "SafetyWing",
      type: "Travel Medical",
      cost: "$56/4 weeks",
      bestFor: "Digital Nomads",
      features: ["Subscription model", "Home country coverage (limited)", "COVID-19 coverage"],
      cons: "Deductible applies",
      color: "bg-teal-50 text-teal-700"
    },
    {
      name: "Genki",
      type: "Health Insurance",
      cost: "€65/month",
      bestFor: "Long-term Travelers",
      features: ["Monthly subscription", "Comprehensive medical", "Sports coverage included"],
      cons: "Newer provider",
      color: "bg-pink-50 text-pink-700"
    },
    {
      name: "World Nomads",
      type: "Travel Insurance",
      cost: "Trip based",
      bestFor: "Adventure Seekers",
      features: ["High adventure sports cover", "Tech gear protection", "Trip cancellation"],
      cons: "Can be pricey",
      color: "bg-orange-50 text-orange-700"
    },
    {
      name: "Cigna Global",
      type: "Expat Health",
      cost: "$100+/month",
      bestFor: "Expats/Relocation",
      features: ["Full global health", "Inpatient & Outpatient", "Cancer care"],
      cons: "Requires underwriting",
      color: "bg-blue-50 text-blue-700"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Resources
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-600" /> Nomad Insurance Compass
        </h3>
        <p className="text-slate-600 mb-8">Compare top insurance options designed for location-independent lifestyles.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {providers.map((p, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-slate-900">{p.name}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${p.color}`}>{p.type}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{p.cost}</div>
              <div className="text-sm text-slate-500 mb-4">Best for: {p.bestFor}</div>

              <ul className="space-y-2 mb-4">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs text-slate-400 italic">Note: {p.cons}</div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h4 className="text-lg font-bold text-indigo-900 mb-4">How to choose the right policy?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-bold text-indigo-800 mb-2">Travel Insurance vs. Health Insurance</h5>
              <p className="text-sm text-indigo-700 leading-relaxed">
                <strong>Travel Insurance</strong> (e.g., World Nomads) covers emergencies, trip cancellations, and lost luggage.
                <strong> Global Health Insurance</strong> (e.g., Cigna) covers routine checkups, long-term treatments, and pre-existing conditions.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-indigo-800 mb-2">Key Questions to Ask</h5>
              <ul className="text-sm text-indigo-700 space-y-1 list-disc list-inside">
                <li>Does it cover my home country visits?</li>
                <li>Are adventure sports (scuba, motorbiking) covered?</li>
                <li>Is there a direct billing network or reimbursement?</li>
                <li>Can I renew while already abroad?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResourcesPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const resources = [
    { id: 'visa', title: "Global Visa Guide 2024", desc: "Comprehensive requirements for 195 countries.", icon: <BookOpen className="w-6 h-6" /> },
    { id: 'cost', title: "Cost of Living Calculator", desc: "Compare prices between 500+ cities worldwide.", icon: <DollarSign className="w-6 h-6" /> },
    { id: 'jobs', title: "Remote Job Boards", desc: "Curated list of platforms for finding remote work.", icon: <Briefcase className="w-6 h-6" /> },
    { id: 'insurance', title: "Travel Insurance Compass", desc: "Compare policies for nomads and expats.", icon: <Shield className="w-6 h-6" /> },
  ];

  if (activeTool === 'visa') return <VisaGuideTool onBack={() => setActiveTool(null)} />;
  if (activeTool === 'cost') return <CostCalculatorTool onBack={() => setActiveTool(null)} />;
  if (activeTool === 'jobs') return <JobBoardsTool onBack={() => setActiveTool(null)} />;
  if (activeTool === 'insurance') return <InsuranceTool onBack={() => setActiveTool(null)} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Essential Resources</h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
          Tools and guides to help you plan your move and work from anywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              {res.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{res.title}</h3>
            <p className="text-slate-600 mb-8 leading-relaxed flex-grow">{res.desc}</p>
            <button
              onClick={() => setActiveTool(res.id)}
              className="w-full py-3 rounded-xl border-2 border-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg hover:shadow-indigo-200"
            >
              Access Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
