import { Request } from "express";

export interface DataReturn {
  success: boolean;
  results: any;
  message: string;
}

export interface CustomRequest extends Request {
  userId?: number;
}
