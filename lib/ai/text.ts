type JsonObject = Record<string, unknown>;

const endpoint = 'https://api.openai.com/v1/responses';

export async function generateStructuredText<T extends JsonObject>(name: string, schema: JsonObject, instructions: string, input: string): Promise<{ data: T; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('AI_NOT_CONFIGURED');
  const model = process.env.OPENAI_TEXT_MODEL || 'gpt-5-mini';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      instructions,
      input,
      text: { format: { type: 'json_schema', name, strict: true, schema } },
    }),
  });
  if (!response.ok) throw new Error(`AI_REQUEST_FAILED: ${response.status} ${await response.text()}`);
  const payload = await response.json();
  const outputText = payload.output_text ?? payload.output?.flatMap((item: any) => item.content ?? []).find((part: any) => part.type === 'output_text')?.text;
  if (!outputText) throw new Error('AI_EMPTY_RESPONSE');
  return { data: JSON.parse(outputText) as T, model };
}
