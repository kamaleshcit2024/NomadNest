import { TravelQuery, TravelReport } from "../types";

const API_BASE_URL = '/api';

export const generateTravelReport = async (query: TravelQuery): Promise<TravelReport> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to generate travel report. Please try again.");
  }
};

export const sendChatMessage = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, message }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Chat API Error:", error);
    throw new Error("Failed to process chat message.");
  }
}

// --- Community Service Functions ---

export const getTopics = async () => {
  const response = await fetch(`${API_BASE_URL}/community/topics`);
  if (!response.ok) throw new Error("Failed to fetch topics");
  return response.json();
};

export const createTopic = async (topic: { title: string; content: string; tags: string[]; author: string }) => {
  const response = await fetch(`${API_BASE_URL}/community/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic)
  });
  if (!response.ok) throw new Error("Failed to create topic");
  return response.json();
};

export const replyToTopic = async (topicId: number, reply: { content: string; author: string }) => {
  const response = await fetch(`${API_BASE_URL}/community/topics/${topicId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reply)
  });
  if (!response.ok) throw new Error("Failed to post reply");
  return response.json();
};

// --- Cost Calculator Service Function ---

export const compareCostOfLiving = async (cityA: string, cityB: string) => {
  const response = await fetch(`${API_BASE_URL}/cost-calculator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cityA, cityB })
  });
  if (!response.ok) throw new Error("Failed to compare costs");
  return response.json();
};