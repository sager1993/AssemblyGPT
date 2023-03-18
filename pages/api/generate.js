import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const role = req.body.role || "";
  if (role.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid role",
      },
    });
    return;
  }
  const advice = req.body.advice || "";
  if (advice.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid advice question",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(role, advice),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(role, advice) {
  const capitalizedRole = role[0].toUpperCase() + role.slice(1).toLowerCase();
  return `Suggest advices for a person that wants help and coaching.
Role: Student I want help studing
Advices: Get Organized, Don't multitask, Divide it up, Sleep,Set a schedule, Take notes, study
Role: manager I want help hiring
Advices: 1. Hire the best 2. Measure the performance of employees regularly 3. Communicating openly is key 4. Encourage employees to share their opinions 5. Set clear goals 6. Reward hard work 7. Ensure that employees enjoy working
Role: ${capitalizedRole} I want help ${advice}
Advices:`;
}
