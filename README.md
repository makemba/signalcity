# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0f999ff6-0faf-4b59-a128-4faaef9ad47a

## Comment démarrer l'application en local avec Docker

1. Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.
2. Clonez ce repository
3. Dans le terminal, exécutez :

```bash
# Construire et démarrer les conteneurs
docker-compose up --build

# Pour arrêter les conteneurs
docker-compose down
```

L'application sera accessible à l'adresse : http://localhost:8080

## Comment démarrer l'application sans Docker

Si vous préférez travailler localement sans Docker :

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0f999ff6-0faf-4b59-a128-4faaef9ad47a) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
