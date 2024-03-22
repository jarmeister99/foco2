export type DropType = 'NUDGE' | 'PROMPT' | 'REFLECTION';
export type CreateDropServiceInput = {
  type: DropType;
  specificDropPayload:
    | CreatePromptDropServiceInput
    | CreateNudgeDropServiceInput
    | CreateReflectionDropServiceInput;
};

type CreatePromptDropServiceInput = {};
type CreateNudgeDropServiceInput = {};
type CreateReflectionDropServiceInput = {};

export type AddDropServiceInput = {
  dropId: number;
  packId: number;
};
