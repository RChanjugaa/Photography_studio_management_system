// Minimal placeholder implementations for package APIs.
// Replace these with real backend calls or a proper mock module.

export async function getPackages() {
  return Promise.resolve([]);
}

export async function createPackage(payload) {
  return Promise.resolve({ id: Date.now(), ...payload });
}

export async function updatePackage(id, payload) {
  return Promise.resolve({ id, ...payload });
}

// Clients (for the NewBooking Step 1)
export async function searchClients(_query) {
  void _query;
  return Promise.resolve([]);
}

export async function createClient(payload) {
  return Promise.resolve({ id: Date.now(), ...payload });
}