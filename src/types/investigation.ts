import { ListItem } from '@metrostar/comet-uswds';
import { ReactNode } from 'react';

export interface Investigation {
  id?: string;
  name?: string | ReactNode;
  status?: 'In Progress' | 'Complete' | 'Cancelled';
  created?: string | Date;
  created_by?: string;
  modified?: string | Date;
  modified_by?: string;
  prompts?: Prompt[];
  actions?: ReactNode;
}

export interface Prompt {
  id: string;
  prompt: string;
  completion: string;
  sources: Array<[string, string]>;
  suggestions: string[];
}

export interface Session {
  sessionId: string;
  prompts: Prompt[];
  chatHistory: string;
}

export interface CompletionSource {
  reference: string | null;
  document: string;
  gdelt?: string;
  audio?: string;
  score: number;
}

export interface Completion {
  current_query_intent: string;
  fetched_docs: ListItem;
  reply: string;
  search_intents: string;
  output_entities: ListItem;
}
