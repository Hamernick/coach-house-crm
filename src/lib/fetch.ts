export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...init })
  if (!res.ok) {
    let message: string
    try {
      message = await res.text()
    } catch {
      message = res.statusText
    }
    throw new Error(message || res.statusText)
  }
  return (await res.json()) as T
}

export async function postJson<TResponse, TBody>(
  url: string,
  body: TBody,
  init?: RequestInit
): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    credentials: 'include',
    ...init,
  })
  if (!res.ok) {
    let message: string
    try {
      message = await res.text()
    } catch {
      message = res.statusText
    }
    throw new Error(message || res.statusText)
  }
  return (await res.json()) as TResponse
}

export const fetcher = <T>(url: string) => getJson<T>(url)
