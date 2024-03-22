import { DropType } from '../types/focusdrops.service.types';

export type CreateDropInPackDto = {
  dropType: DropType;
};

export type CreatePromptDropInPackDto = {
  body: string;
  mediaUrl: string;
};
