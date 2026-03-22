export function getCookie(name: string): string | null {

  if (typeof document === "undefined") return null

  const cookies = document.cookie.split("; ")

  for (const cookie of cookies) {

    const [key, value] = cookie.split("=")

    if (key === name) {
      return decodeURIComponent(value)
    }
  }

  return null
}

export function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)

  const isProd = process.env.NODE_ENV === 'production';
  let cookieString = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

  if (isProd) {
    cookieString += "; Secure";
  }

  document.cookie = cookieString;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; Max-Age=0; path=/`
}

