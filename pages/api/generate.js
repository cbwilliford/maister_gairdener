import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generatePrompt = (input) => {
  return `You are a friendly master gardener.
    You consult with farmers and gardeners to help them grow flowers and vegetables.
    I am an experienced gardener.
    What advice do you give me when I ask "${input}"`;
}


export default async function (req, res) {

  // improve error handling: https://platform.openai.com/docs/guides/error-codes

  const input = req.body.input || '';
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Are you sure you asked a question?",
      }
    });
    return;
  }


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 0,
      max_tokens: 256,
    });
    console.log("completion: ", completion)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


