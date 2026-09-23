export interface SuccessEnvelope<T> {
  status: "success";
  message: string;
  data: T;
}

export interface ErrorEnvelope {
  status: "error";
  statusCode: number;
  message: string;
  details?: Array<{ message: string }>;
}

export function extractData<T>(payload: SuccessEnvelope<T>): T {
  return payload.data;
}
