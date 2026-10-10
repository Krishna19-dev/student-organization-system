export async function cookies() {
  return {
    get(name: string) {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? { name, value: match[2] } : undefined;
    },
    set(name: string, value: string, options?: { path?: string; maxAge?: number; sameSite?: string }) {
      let cookieStr = `${name}=${value}; path=${options?.path || "/"}`;
      if (options?.maxAge !== undefined) {
        cookieStr += `; max-age=${options.maxAge}`;
      }
      if (options?.sameSite) {
        cookieStr += `; SameSite=${options.sameSite}`;
      }
      document.cookie = cookieStr;
    },
    delete(name: string) {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    },
  };
}
