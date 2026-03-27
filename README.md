# WingLab OS

**AI copilot for aerofoil selection, iteration, and test planning.**

WingLab OS is a professional, industry-grade web application that helps you turn design intent into CAD-ready aerofoil iterations and test matrices. Built with Next.js, React 19, Tailwind CSS, Radix UI, Zod, and React Hook Form.

---

## Features
- Step-by-step design intent input form
- AI-powered (mocked for MVP) aerofoil selection and parameter suggestion
- CAD-ready parameters and test matrix generation
- Download results as CSV or JSON
- Responsive, accessible, and modern UI
- Extensible backend for future OpenAI or custom model integration

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

4. **Enter your design intent** (application, Reynolds number, speed, constraints) and generate suggestions.

5. **Download the test matrix or full result** for use in CAD or further analysis.

## Project Structure
- `src/app/page.tsx` — Main UI and flows
- `src/app/api/copilot/route.ts` — API route for AI copilot logic (mocked, ready for extension)
- `src/components/ui/` — UI primitives (extend as needed)

## Extending
- Replace the logic in `api/copilot/route.ts` with OpenAI or your own ML model for real AI-driven suggestions.
- Add more fields, validation, or result types as your workflow grows.

## License
MIT
