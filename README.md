# S. Vijay — Data Analyst Portfolio

A responsive personal data-analytics portfolio built with plain HTML, CSS, JavaScript, and CSV data.

## Run it

Open this folder with a simple local web server, then visit `index.html`. A server is needed because the dashboard loads `data/portfolio-sales.csv` in the browser.

For example, with the VS Code **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.

## What is included

- Responsive, recruiter-ready portfolio with hero, about, skills, projects, workflow, internship outcome, learning, resume, and contact sections
- Light/dark theme and mobile navigation
- CSV-powered KPI cards, trend charts, and category/region breakouts
- Interactive overview, regional, product-mix, and monthly-trend controls
- Expandable sample-project case studies and client-side contact-form validation
- Truthful labels for sample data and placeholders that need real-world details

## Customize

- Update your name, location, contact details, skills, education, certification, and project descriptions in `index.html`.
- Replace or extend `data/portfolio-sales.csv`. Keep the columns `month`, `region`, `category`, `revenue`, and `profit`.
- Adjust colors and layout in `styles.css`.
- Add your GitHub URL in the Contact section when it is available.

## Deploy

This is a static site, so upload the project folder to GitHub Pages, Netlify, or Vercel. Set `index.html` as the entry page and keep the `data` folder alongside it so the dashboard can load `portfolio-sales.csv`.
