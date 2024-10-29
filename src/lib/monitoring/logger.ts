import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

export const logError = (error: Error, context = {}) => {
  logger.error({
    err: {
      message: error.message,
      stack: error.stack,
      ...context
    }
  })
} 