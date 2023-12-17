import { setupWorker, rest } from 'msw'
import { users } from './json/users'

export const worker = setupWorker(
  rest.get('/api/case-study', (req, res, ctx) => res(ctx.json({
    users,
  }))),
  rest.get('/api/tag-manager', (req, res, ctx) => res(ctx.json({
    users,
  }))),
)
