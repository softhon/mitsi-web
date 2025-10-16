# Mitsi: Open-Source Video Conferencing

Welcome to **Mitsi**, a modern, open-source video conferencing platform powered by [mediasoup](https://mediasoup.org). Inspired by Jitsi, Mitsi delivers low-latency, scalable video and audio calls, screen sharing, and real-time chat using WebRTC. Built with a microservices architecture, Mitsi is designed for extensibility, ease of deployment, and community contributions.

## Why Mitsi?

- **Scalable**: Leverages mediasoup’s Selective Forwarding Unit (SFU) for efficient media routing.
- **Modular**: Separate repositories for each microservice ensure independent development and deployment.
- **Developer-Friendly**: Built with TypeScript, Node.js, and React, with clear documentation and tools like npm, ESLint, Prettier, and Jest.
- **Open-Source**: Licensed under the MIT License to encourage adoption and contributions.

## Repositories

Mitsi is organized into separate GitHub repositories under the [softhon](https://github.com/softhon) organization:

- **[mitsi-web](https://github.com/softhon/mitsi-web)**: Mitsi web client - react base web application for mitsi.
- **[mitsi-mobile](https://github.com/softhon/mitsi-mobile)**: Mitsi mobile app - react native application for mitsi.
- **[mitsi-signaling](https://github.com/softhon/mitsi-signaling)**: Mitsi Signaling Service for manage peer connections and room coordination.
- **[mitsi-media](https://github.com/softhon/mitsi-media)**: Mitsi media service powered by mediasoup for media routing.
- **[mitsi-room-management](https://github.com/softhon/mitsi-room-management)**: Manages rooms and participants (Node.js, Express).
<!-- - **[mitsi-auth](https://github.com/softhon/mitsi-auth)**: Authentication service (Node.js, JWT). -->
- **[mitsi-recording](https://github.com/softhon/mitsi-recording)**: Media recording and storage (Node.js, S3).
  <!-- - **[mitsi-chat](https://github.com/softhon/mitsi-chat)**: Real-time text chat (Node.js, Socket.IO). -->
  <!-- - **[mitsi-analytics](https://github.com/softhon/mitsi-analytics)**: Usage metrics collection (Node.js, Redis). -->
- **[mitsi-docs](https://github.com/softhon/mitsi-docs)**:Mitsi documentation - a guide for contributors and developers.

## Getting Started

To run Mitsi locally or contribute, follow these steps:

1. **Clone Repositories**:

   ```bash
   git clone https://github.com/softhon/mitsi-<repo>.git
   ```

   Clone the desired repos (e.g., `mitsi-client`, `mitsi-signaling`, `mitsi-media`, `mitsi-room-management` for the MVP).

2. **Install Prerequisites**:
   - Node.js >= 18
   - npm >= 9
   - Docker (optional, for containerized deployment)

3. **Set Up Locally**:
   - Navigate to each repo and follow its `README.md` or `docs/setup.md` for specific instructions.
   - For a full stack, use the `docker-compose.yml` in this repo:
     ```bash
     docker-compose up
     ```

4. **Run Development Environment**:
   - Example for `mitsi-signaling`:
     ```bash
     cd mitsi-signaling
     npm install
     npm run dev
     ```
   - Visit `http://localhost:3000` to test the signaling server.

5. **Explore Documentation**:
   - Visit [mitsi.app](https://mitsi.app) (coming soon) or browse this repo’s `docs/` folder for architecture, API details, and setup guides.

## Architecture

Mitsi uses a microservices architecture with separate repositories for modularity:

- **Client**: React app (`mitsi-client`) connects to signaling and room management services.
- **Signaling**: WebSocket service (`mitsi-signaling`) handles peer coordination and ICE candidates.
- **Media**: Mediasoup SFU (`mitsi-media`) routes audio/video streams.
- **Room Management**: Tracks rooms and participants (`mitsi-room-management`).
- **Supporting Services**: Authentication, recording, chat, and analytics in separate repos.

See `docs/architecture.md` for a detailed diagram and API contracts.

## Contributing

We welcome contributions! To get started:

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
- Browse issues in each repo, especially those tagged `good-first-issue`.
- Join our [Discord](https://discord.gg/mitsi) (coming soon) for discussions.

## License

Mitsi is licensed under the [MIT License](LICENSE). Each repository includes its own `LICENSE` file.

## Contact

- Website: [mitsi.app](https://mitsi.app) (coming soon)
- GitHub: [softhon](https://github.com/softhon)
- Community: Join our [Discord](https://discord.gg/mitsi) or use GitHub Discussions in each repo.
