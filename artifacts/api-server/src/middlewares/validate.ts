import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { logger } from '../lib/logger';

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn({ err: error, body: req.body }, 'Validation error');
        res.status(422).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn({ err: error, query: req.query }, 'Validation error');
        res.status(422).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      next(error);
    }
  };
}
