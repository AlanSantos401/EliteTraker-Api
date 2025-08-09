import { z } from 'zod';

export function buildValidationErrorMessage(issues: z.ZodIssue[]) {
  const errors = issues.map(item => `${item.path.join('.')}: ${item.message}`);
  return errors.join('\n'); // junta tudo numa string, uma mensagem por linha
}
