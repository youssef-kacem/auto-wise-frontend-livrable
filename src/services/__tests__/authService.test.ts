import { authService } from '../authService';

// Mock global fetch
const originalFetch = global.fetch;

describe('authService robustness', () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('should throw on network error (login)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(authService.login({ email: 'a@a.com', password: '12345678' }))
      .rejects.toThrow('Impossible de contacter le serveur de connexion.');
  });

  it('should throw on non-JSON response (login)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => { throw new Error('Invalid JSON'); },
    });
    await expect(authService.login({ email: 'a@a.com', password: '12345678' }))
      .rejects.toThrow('Erreur lors de la connexion.');
  });

  it('should throw on missing user/token in response (login)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: null }),
    });
    await expect(authService.login({ email: 'a@a.com', password: '12345678' }))
      .rejects.toThrow('Réponse inattendue du serveur d\'authentification.');
  });

  it('should throw on HTTP error with message (login)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Bad credentials' }),
    });
    await expect(authService.login({ email: 'a@a.com', password: '12345678' }))
      .rejects.toThrow('Bad credentials');
  });

  it('should throw on HTTP error without message (login)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    await expect(authService.login({ email: 'a@a.com', password: '12345678' }))
      .rejects.toThrow('Erreur lors de la connexion.');
  });

  // Même logique pour register
  it('should throw on network error (register)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(authService.register({ nom: 'a', prenom: 'b', email: 'a@a.com', telephone: '12345678', plainPassword: '12345678' }))
      .rejects.toThrow('Impossible de contacter le serveur d\'inscription.');
  });

  it('should throw on non-JSON response (register)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => { throw new Error('Invalid JSON'); },
    });
    await expect(authService.register({ nom: 'a', prenom: 'b', email: 'a@a.com', telephone: '12345678', plainPassword: '12345678' }))
      .rejects.toThrow('Erreur lors de l\'inscription.');
  });

  it('should throw on HTTP error with message (register)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Email exists' }),
    });
    await expect(authService.register({ nom: 'a', prenom: 'b', email: 'a@a.com', telephone: '12345678', plainPassword: '12345678' }))
      .rejects.toThrow('Email exists');
  });

  it('should throw on HTTP error without message (register)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    await expect(authService.register({ nom: 'a', prenom: 'b', email: 'a@a.com', telephone: '12345678', plainPassword: '12345678' }))
      .rejects.toThrow('Erreur lors de l\'inscription.');
  });
}); 