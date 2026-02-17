import { useCallback, useEffect, useRef, useState } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type SendRequestArgs = {
  key: number;
  url: string;
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  credentials?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (data: any) => void;
};

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string | null>>({});
  const activeHttpRequests = useRef<Record<number, AbortController>>({});

  const sendRequest = useCallback(async ({
    key,
    url,
    method = 'GET',
    body = null,
    headers = {},
    credentials = true,
    onError,
    onSuccess,
  }: SendRequestArgs) => {
    setIsLoading(prev => ({ ...prev, [key]: true }));
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current[key] = httpAbortCtrl;

    try {
      let requestUrl = url;
      let bodyToSend: BodyInit | null = null;

      // DELETE traité comme GET -> body => query
      if ((method === 'GET' || method === 'DELETE') && body && typeof body === 'object') {
        const params = new URLSearchParams();
        Object.entries(body).forEach(([k, v]) => {
          if (Array.isArray(v)) v.forEach(item => params.append(k, String(item)));
          else if (v !== undefined && v !== null) params.append(k, String(v));
        });
        requestUrl = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
      } else if (method !== 'GET' && body != null) {
        // POST/PUT (ou DELETE si jamais tu désactives le mode GET-like)
        if (body instanceof FormData) {
          bodyToSend = body; // ne pas fixer Content-Type ici
        } else {
          bodyToSend = JSON.stringify(body);
        }
      }

      const finalHeaders: HeadersInit = { Accept: 'application/json', ...headers };
      // Ne pose Content-Type que si on envoie du JSON
      if (bodyToSend && !(bodyToSend instanceof FormData)) {
        finalHeaders['Content-Type'] = finalHeaders['Content-Type'] ?? 'application/json';
      }

      const response = await fetch(requestUrl, {
        method,
        body: (method === 'GET' || method === 'DELETE') ? null : bodyToSend,
        headers: finalHeaders,
        signal: httpAbortCtrl.signal,
        credentials: credentials ? 'include' : 'omit',
      });

      // 204 No Content => pas de JSON
      let responseData: any = null;
      if (response.status !== 204) {
        const text = await response.text();
        try {
          responseData = text ? JSON.parse(text) : null;
        } catch {
          responseData = text || null;
        }
      }

      if (!response.ok) {
        const errorMessage =
          (responseData && (responseData.error ?? responseData.message)) ||
          response.statusText ||
          'Une erreur est survenue';
        setErrors(prev => ({ ...prev, [key]: errorMessage }));
        onError?.(errorMessage);
        return null;
      }

      setErrors(prev => ({ ...prev, [key]: null }));
      onSuccess?.(responseData);
      return responseData;
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        const errorMessage = err?.message || 'Erreur inconnue';
        setErrors(prev => ({ ...prev, [key]: errorMessage }));
        onError?.(errorMessage);
      }
      return null;
    } finally {
      if (activeHttpRequests.current[key]) {
        delete activeHttpRequests.current[key];
      }
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(activeHttpRequests.current).forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, errors, sendRequest };
};
