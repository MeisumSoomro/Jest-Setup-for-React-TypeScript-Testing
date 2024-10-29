export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public stack = ''
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleAsync = async <T>(
  promise: Promise<T>
): Promise<[Error | null, T | null]> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as Error, null];
  }
};

export const createErrorResponse = (error: AppError) => {
  return new Response(
    JSON.stringify({
      status: 'error',
      message: error.message,
      code: error.statusCode,
    }),
    {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}; 