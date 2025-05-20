# Thought process while building this project:

- Build backend first, then frontend
- Backend: Python (Flask), Gemini , Manim
- Frontend: Next.js, TailwindCSS, Shadcn ui

## Backend flow

- api endpoint for generating animation will be present
- frontend will hit this api
- auth should be done first (acc. to user id, user limit acc to plan)
- then prompt from user must pass though safety checks (so that irrelevant/harmful prompts are not passed)
- this safety check can be done by gemini itself by adding relevant prompt
- once safety checks pass, send a prompt to gemini (this is the prompt: , spit out the manim code to build this)
- once manim code is received, safety check on it ??
- run manim code -> gives mp4 file as output
- running locally with ffmpeg doesn't solve anything, we need s3/ some object storage to show the user
- upload vid to object storage (cloudinary for now)
- show output to user in chat interface itself
- end

additional thoughts:
chat interface will have to preserve memory, so individually passing the prompts would not generate ideal inputs
eg: generate an animation with number line from 1 to 3 -> gives a good output
next prompt: now from 5 to 6
-> this will either fail or give a bad output since it is not preserving the previous prompt

- solution is to preserve chat id ?

## Frontend flow

- user auth (login/signup) (3 free hits then signup also can be done, this needs to be explored / provide test credentials for testing)
- chat interface (should be clean, use shadcn for good ui/ux)
- homepage must be something that outlines what the project does, and that's it, no fluff
- --- this much is enough, Extra:
- pricing page
- credits viewer?
- profile page
