function extractFunctionInfo(text: string) {
  const regex = /function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)/;
  const match = regex.exec(text);

  if (match) {
    const functionName = match[1];
    const params = match[2];
    return { functionName, params };
  }

  return null;
}

function slugify(text: string) {
  return text.toLowerCase().replaceAll(" ", "_");
}

export { extractFunctionInfo, slugify };
