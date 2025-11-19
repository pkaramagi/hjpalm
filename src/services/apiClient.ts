import { client } from '@/client/client.gen';

const resolveBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  return 'http://localhost:8000';
};

client.setConfig({
  baseUrl: resolveBaseUrl(),
  throwOnError: true,
});
