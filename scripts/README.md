# Scripts

## Pushing to GitHub from Cursor

So the assistant (or you) can push from Cursor without using your Terminal:

1. **Create a Personal Access Token**
   - Go to [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Generate a new token (classic) with **repo** scope
   - Copy the token

2. **Add the token to this repo (one time, never committed)**
   - In the **project root** (same folder as `package.json`), create a file named `.env.github`
   - Put **only** the token in that file—one line, no quotes, no `GITHUB_TOKEN=`
   - Save. The file is already ignored by git (`.env*` in `.gitignore`)

3. **Push**
   - Run `npm run push` (or ask the assistant to push). It will use the token and push to `main`.

If `.env.github` is missing, the script falls back to SSH (works when you run from your Mac Terminal).
