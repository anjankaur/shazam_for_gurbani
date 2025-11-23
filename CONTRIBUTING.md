# Contributing to Shazam for Gurbani

First off, thank you for considering contributing to Shazam for Gurbani! It's people like you that make this project a great tool for the Sikh community.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the use case**
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** for both backend and frontend
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Commit your changes** with clear commit messages
7. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- FFmpeg

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example ../.env
# Edit .env with your configuration
python check_setup.py
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

**Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Coding Standards

### Python (Backend)

- Follow [PEP 8](https://pep8.org/) style guide
- Use meaningful variable and function names
- Add docstrings to all functions and classes
- Line length: max 100 characters
- Use `black` for code formatting
- Use `flake8` for linting

```bash
# Format code
black backend/

# Lint code
flake8 backend/
```

### JavaScript/React (Frontend)

- Follow the existing code style
- Use ESLint configuration provided
- Use Prettier for code formatting
- Use functional components and hooks
- Keep components focused and small

```bash
# Lint code
npm run lint

# Format code (if prettier is installed)
npx prettier --write src/
```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(backend): add support for M4A audio files
fix(frontend): resolve audio recording issue on Safari
docs(readme): update installation instructions
```

### Branch Naming

- `feature/description` - For new features
- `fix/description` - For bug fixes
- `docs/description` - For documentation
- `refactor/description` - For code refactoring

## Testing

### Backend Testing

```bash
cd backend
pytest
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Adding Audio Files

When contributing Gurbani audio files:

1. **File naming convention:** `{shabad_id}_{artist_name}.mp3`
   - Example: `3589_bhai_harjinder_singh.mp3`
2. **Ensure you have proper rights** to use and share the audio
3. **Use high-quality audio** (minimum 128kbps)
4. **Verify Shabad ID** matches GurbaniNow API

## Documentation

- Update README.md if you change functionality
- Update ARCHITECTURE.md if you change system design
- Add inline comments for complex logic
- Update API documentation if you modify endpoints

## Questions?

Feel free to open an issue with the `question` label, or reach out to the maintainers.

## Recognition

Contributors will be recognized in our README.md and release notes.

Thank you for contributing to making Gurbani more accessible through technology!
