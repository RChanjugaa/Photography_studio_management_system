const express = require('express');
const router = express.Router();

// ===============================
// 🔥 DUMMY DATA (DISPLAY ONLY)
// ===============================
const dummyEvents = [
  {
    id: 1,
    event_type: "Wedding",
    event_name: "Nimal & Samanthi Wedding",
    description: "Full wedding coverage",
    event_date: "2026-05-10",
    event_time: "09:00 AM",
    location: "Colombo",
    status: "scheduled",
    first_name: "Nimal",
    last_name: "Fernando",
    email: "nimal@email.com",
    assigned_employees: [],
    budget: 150000
  },
  {
    id: 2,
    event_type: "Birthday",
    event_name: "Kasun Birthday Shoot",
    description: "Birthday photography session",
    event_date: "2026-05-15",
    event_time: "04:00 PM",
    location: "Kandy",
    status: "completed",
    first_name: "Kasun",
    last_name: "Perera",
    email: "kasun@email.com",
    assigned_employees: [],
    budget: 30000
  }
];

// ===============================
// ✅ GET ALL EVENTS (WORKING)
// ===============================
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: dummyEvents,
    total: dummyEvents.length
  });
});

// ===============================
// ✅ GET SINGLE EVENT
// ===============================
router.get('/:id', (req, res) => {
  const event = dummyEvents.find(e => e.id == req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  res.json({
    success: true,
    data: event
  });
});

// ===============================
// ❌ CREATE EVENT (FAIL)
// ===============================
router.post('/', (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server not connected. Database unavailable."
  });
});

// ===============================
// ❌ UPDATE EVENT (FAIL)
// ===============================
router.put('/:id', (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server not connected. Cannot update event."
  });
});

// ===============================
// ❌ UPDATE STATUS (FAIL)
// ===============================
router.patch('/:id/status', (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server not connected. Cannot update status."
  });
});

// ===============================
// ❌ DELETE EVENT (FAIL)
// ===============================
router.delete('/:id', (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server not connected. Cannot delete event."
  });
});

// ===============================
// ✅ FILTER BY TYPE (WORKING)
// ===============================
router.get('/type/:eventType', (req, res) => {
  const filtered = dummyEvents.filter(
    e => e.event_type === req.params.eventType
  );

  res.json({
    success: true,
    data: filtered
  });
});

module.exports = router;