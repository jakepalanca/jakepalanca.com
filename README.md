# jakepalanca.com

A terminal-themed portfolio website showcasing my projects, skills, and experience as a Computer Science student at the University of Georgia.

**Live Site:** [jakepalanca.com](https://jakepalanca.com)

## About

This portfolio features an interactive terminal interface that displays my background, projects, and skills through a series of animated command outputs. Built with React, it provides a unique developer-focused experience.

## Features

- 🖥️ **Terminal UI** - Interactive command-line interface with typing animations
- 📄 **Resume Download** - Direct download link for my resume
- 🔗 **External Links** - Quick access to GitHub and LinkedIn
- 📁 **Project Showcase** - Detailed descriptions of my key projects
- 💻 **Skills Display** - Organized tech stack and tools
- 🎨 **ASCII Art** - Custom terminal art

## Tech Stack

- **React** 19.2.0
- **JavaScript**
- **CSS3**
- **Create React App**

## Projects Highlighted

- **SwiftCast** - Casting browser with JavaScript injection for HLS/DASH stream capture
- **Cinema Booking Website** - Full-stack web application with Spring Boot and React
- **TCPdump Parser** - Network trace analysis tool for hop-by-hop path reconstruction

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jakepalanca/jakepalanca.com.git
cd jakepalanca.com
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

This portfolio is deployed using **AWS CloudFront** and **S3** for a fast, scalable, and cost-effective hosting solution.

### Architecture

- **Amazon S3** - Hosts the static website files (HTML, CSS, JavaScript) from the `build` folder
- **CloudFront CDN** - Distributes content globally with edge caching for optimal performance
- **Custom Domain** - Configured with Route 53 DNS pointing to the CloudFront distribution

### Deployment Process

1. Build the production bundle:
```bash
npm run build
```

2. Upload the `build` folder contents to the S3 bucket configured for static website hosting

3. CloudFront automatically serves the cached content from edge locations worldwide, ensuring fast load times regardless of user location

### Troubleshooting

If you encounter "Access Denied" errors when accessing files (like `resume.pdf`), check your S3 bucket policy allows CloudFront to access objects. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on configuring S3 bucket policies for CloudFront.

## Links

- **Portfolio:** [jakepalanca.com](https://jakepalanca.com)
- **Resume:** [Download PDF](https://jakepalanca.com/resume.pdf)
- **LinkedIn:** [linkedin.com/in/jakepalanca](https://linkedin.com/in/jakepalanca)

## About Me

I'm a Computer Science student at the University of Georgia (3.66 GPA, Expected Graduation: May 2026), focusing on networking-focused Java development and building distributed systems that connect and scale.

Currently working on **SwiftCast**, a browser that enables casting any video content by intercepting HLS/DASH streams and relaying them to Chromecast.

## License

This project is private and proprietary.
