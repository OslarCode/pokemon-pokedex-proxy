export function sendJson(res, statusCode, data) {
  const body = data ? JSON.stringify(data) : "";

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(body);
}

export function sendError(res, statusCode, message) {
  const payload = {
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  sendJson(res, statusCode, payload);
}

export function handleCorsPreflight(res) {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end();
}
