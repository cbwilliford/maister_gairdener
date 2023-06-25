import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generatePrompt = ({latitude, longitude, timestamp}) => {
  return `You are a master gardener who specializes in growing vegetables.
    It's currently ${timestamp} UTC and I am at latitude: ${latitude} and longitude: ${longitude}.
    Create a detailed garden plan for my zone's upcoming season. Use this JSON format:
    {
      "zone": "string: USDA Zone",
      "season": "string: my upcoming growing season",
      "conditions": "string: conditions in my USDA zone during my upcoming season",
      "plants": [an array of plants that thrive during this upcoming season in my USDA zone],
      "plan": [an array of steps to take to successfully grow these plants]
    }`;
}


export default async function (req, res) {

  // improve error handling: https://platform.openai.com/docs/guides/error-codes

  const locationData = req.body.locationData || '';

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(locationData),
      temperature: 0,
      max_tokens: 500,
    });
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


