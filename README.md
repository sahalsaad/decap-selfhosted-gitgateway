# Decap Self-Hosted Git Gateway

This project facilitates a self-hosted Git gateway for managing repository access and operations with Decap CMS.

## Table of Contents
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Local Development](#local-development)
- [Cloudflare Deployment](#cloudflare-deployment)
- [License](#license)

## Prerequisites

- Node.js and npm should be installed on your system.
- wrangler CLI should be installed on your system.
- Cloudflare D1 CLI should be installed on your system.
- Cloudflare account with access to the D1 service.
- Cloudflare account with access to the Workers service.

## Getting Started

Clone the repository:

Deploy the application to Cloudflare.
First user can be created by visting  


## Installation

Install the necessary dependencies:

```bash
pnpm install
```

Prepare the wrangler.toml file:

```bash
cp wrangler.toml.example wrangler.toml
```

## Usage

### Local Development 💻

Run the migrations:

```bash
pnpm migrate:local
```

Start the development server:

```bash
pnpm dev
```

### Cloudflare Deployment 🚀

Create the database in cloudflare:

```bash
d1 create git-gateway-db
```

Update the wrangler.toml file with the database id:
```toml
[[d1_databases]]
binding = "DB"
database_name = "git-gateway-db"
database_id = "<database_id>"
migrations_dir = "migrations"
```

Run the migrations:

```bash
pnpm migrate
```

Deploy the application to Cloudflare:

```bash
pnpm deploy
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.