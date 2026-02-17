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

// ── Create match schema ─────────────────────────────────
export const createMatchSchema = z
  .object({
    sport:     z.string().min(1, 'sport is required'),
    homeTeam:  z.string().min(1, 'homeTeam is required'),
    awayTeam:  z.string().min(1, 'awayTeam is required'),
    startTime: z.iso.datetime({ error: 'startTime must be a valid ISO datetime string' }),
    endTime:   z.iso.datetime({ error: 'endTime must be a valid ISO datetime string' }),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end   = new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
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
