/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import {
  CloudflareError,
  PaperbackInterceptor,
  type Request,
  type Response,
} from "@paperback/types";

// Intercepts all the requests and responses and allows you to make changes to them
export class MainInterceptor extends PaperbackInterceptor {
  override async interceptRequest(request: Request): Promise<Request> {
    return request;
  }

  override async interceptResponse(
    request: Request,
    response: Response,
    data: ArrayBuffer,
  ): Promise<ArrayBuffer> {
    void request;
    void response;

    return data;
  }
}

export async function checkStatus(status: number, request: Request): Promise<void> {
  if (status >= 200 && status < 300) {
    return;
  }

  if (status === 503 || status === 403) {
    throw new CloudflareError(request, `Cloudflare bypass required (Status: ${status})`);
  }
  throw new Error(`HTTP Error: ${status} for url: ${request.url}`);
}

export async function fetchRequest(request: Request): Promise<string> {
  const [response, data] = await Application.scheduleRequest(request);
  await checkStatus(response.status, request);
  return Application.arrayBufferToUTF8String(data);
}
