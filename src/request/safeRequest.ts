import {Result} from "../monad";
import {Dispatcher, request, errors} from "undici";
import {URL, UrlObject} from "node:url";

type RequestOptions<T> = { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions<T>, 'origin' | 'path' | 'method'> & Partial<Pick<Dispatcher.RequestOptions, 'method'>>;

export async function safeRequest<T = null>(url: string | URL | UrlObject, options?: RequestOptions<T>): Promise<Result<errors.UndiciError | Error, Dispatcher.ResponseData<T>>> {
  try {
    const response = await request(url, options);
    return Result.success(response);
  } catch (error) {
    if (error instanceof errors.UndiciError) {
      return Result.failure(error);
    }

    if (error instanceof Error) {
      return Result.failure(error);
    }

    return Result.failure(new Error(`Unknown error: ${String(error)}`));
  }
}
