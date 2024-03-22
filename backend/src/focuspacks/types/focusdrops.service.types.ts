export type DropType = 'NUDGE' | 'PROMPT' | 'REFLECTION';

export type AddDropServiceInput = {
  dropId: number;
  packId: number;
};

export type CreatePromptDropServiceInput = {
  body: string;
  mediaUrl: string;
};
