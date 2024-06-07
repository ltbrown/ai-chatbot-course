import { Configuration, OpenAIApi } from "openai";
// import { customerSupportAgent } from "~/agents";
import * as agents from "@/agents";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const agent = body.agent || "customerSupportAgent";

  if (!Object.keys(agents).includes(agent)) {
    throw new Error(`${agent} does not exist`);
  }

  const { OPENAI_API_KEY } = useRuntimeConfig();

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: body.messages || [],
    temperature: body.temperature || 1,
    // ...customerSupportAgent(body),
    // @ts-expect-error checking above if agent exists
    ...agents[agent](body),
  });

  // console.log(completion.data.choices[0]);
  return completion.data;
});
