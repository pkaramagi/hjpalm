import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.json",
  output: "./src/client",
  plugins: [
    ...defaultPlugins,
    {
      name: "@hey-api/sdk",
      asClass: true,
      operationId: true,
      transformer: true,
      methodNameBuilder: (operation) => {
        const rawName = operation?.name || operation?.id || "unnamed";
        const service = operation?.service || "";

        let name = rawName;

        if (service && name.toLowerCase().startsWith(service.toLowerCase())) {
          name = name.slice(service.length);
        }

        return name.charAt(0).toLowerCase() + name.slice(1);
      },
    },
    "zod",
    '@tanstack/react-query',

    {
      name: "@hey-api/schemas",
      type: "json",
    },
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
  ],
});
