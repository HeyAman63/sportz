import { z } from 'zod';

// ── Constants ────────────────────────────────────────────
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE:      'live',
  FINISHED:  'finished',
};

// ── Query / Param schemas ────────────────────────────────
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ── Helper: validate ISO date string ─────────────────────
const isoDateString = (field) =>
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: `${field} must be a valid ISO date string`,
  });

// ── Create match schema ─────────────────────────────────
export const createMatchSchema = z
  .object({
    sport:     z.string().min(1, 'sport is required'),
    homeTeam:  z.string().min(1, 'homeTeam is required'),
    awayTeam:  z.string().min(1, 'awayTeam is required'),
    startTime: isoDateString('startTime'),
    endTime:   isoDateString('endTime'),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end   = new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime must be after startTime',
      });
    }
  });

// ── Update score schema ─────────────────────────────────
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
