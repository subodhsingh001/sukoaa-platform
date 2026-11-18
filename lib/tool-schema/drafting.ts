import {parseDescription} from './parser';
import type {ToolDraft} from './schema';

export type DraftSnapshot = {source: string; lastSource: string; tools: ToolDraft[]; warnings: string[]; reviewed: boolean; selected: number; testIndex: number};

export function generateDescriptionDraft(source: string) {
  const result = parseDescription(source);
  if (!result.tools.length) throw new Error('No functions found. Your current draft was kept. Use “Function: name” or “Add numbers takes a and b, both required.”');
  return result;
}
