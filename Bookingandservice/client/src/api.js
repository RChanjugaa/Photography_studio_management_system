const BASE = "/api";

async function request(url, options = {}) {
  const res = await fetch(BASE + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Packages ──────────────────────────────────────────────────────────────────
export const api = {
  packages: {
    getAll:  ()       => request("/packages"),
    getById: (id)     => request(`/packages/${id}`),
    create:  (body)   => request("/packages",     { method: "POST", body: JSON.stringify(body) }),
    update:  (id, body) => request(`/packages/${id}`, { method: "PUT",  body: JSON.stringify(body) }),
    delete:  (id)     => request(`/packages/${id}`,   { method: "DELETE" }),
  },

  bookings: {
    getAll:   (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/bookings${qs ? "?" + qs : ""}`);
    },
    getById:  (id)       => request(`/bookings/${id}`),
    create:   (body)     => request("/bookings",          { method: "POST",   body: JSON.stringify(body) }),
    update:   (id, body) => request(`/bookings/${id}`,    { method: "PUT",    body: JSON.stringify(body) }),
    updateStatus: (id, status) =>
      request(`/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
    reschedule: (id, scheduledStart) =>
      request(`/bookings/${id}/reschedule`, { method: "PUT", body: JSON.stringify({ scheduledStart }) }),
    delete:   (id)       => request(`/bookings/${id}`,    { method: "DELETE" }),
    conflictCheck: (body) =>
      request("/bookings/conflict-check", { method: "POST", body: JSON.stringify(body) }),
  },

  calendar: {
    getAll: () => request("/calendar"),
  },
};
