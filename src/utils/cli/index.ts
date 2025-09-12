import express from "express";
import morgan from "morgan";

export const displayWelcomeMessage = (
  appUrl: string,
  docsUrl: string = `${appUrl}/api-docs`
) => {
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const cyan = "\x1b[34m";

  console.log(`

${bright}${cyan}
╔═══════════════════════════════════════════════════╗
║                                                   ║
║                 ARXATEC SERVICE                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
${reset}
Server running on:
${cyan}${appUrl}${reset}

Swagger Docs available on:
${cyan}${docsUrl}${reset}

${bright}Main commands:${reset}

${cyan}› npm run dev${reset}      - Start server in development mode
${cyan}› npm run build${reset}    - Compile the project
${cyan}› npm start${reset}        - Start server in production mode
  
Press CTRL+C to stop the server
  
`);
};

export const customMorganFormat = (
  tokens: morgan.TokenIndexer<express.Request, express.Response>,
  req: express.Request,
  res: express.Response
) => {
  const status = Number(tokens.status(req, res));
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const time = tokens["response-time"](req, res);
  const date = tokens.date(req, res, "iso");
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const color =
    status >= 500
      ? "\x1b[31m"
      : status >= 400
      ? "\x1b[33m"
      : status >= 300
      ? "\x1b[36m"
      : "\x1b[32m";

  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  return `${color}${bold}[${method}] ${url} - ${status} - ${time} ms | IP: ${ip} | Date: ${date}${reset}`;
};
