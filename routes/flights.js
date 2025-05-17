const express = require('express');
const router = express.Router();

// In-memory storage for flights
const flights = new Map();

// Get all flights
router.get('/', (req, res) => {
    res.json(Array.from(flights.values()));
});

// Get a specific flight
router.get('/:id', (req, res) => {
    const flight = flights.get(req.params.id);
    if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
});

// Create a new flight (requires admin/supervisor role)
router.post('/', (req, res) => {
    // TODO: Add role verification middleware
    const flight = {
        id: Date.now().toString(),
        ...req.body,
        status: 'Scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    flights.set(flight.id, flight);
    res.status(201).json(flight);
});

// Update a flight
router.put('/:id', (req, res) => {
    const flight = flights.get(req.params.id);
    if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }

    const updatedFlight = {
        ...flight,
        ...req.body,
        id: flight.id, // Prevent ID from being modified
        updatedAt: new Date()
    };
    flights.set(flight.id, updatedFlight);
    res.json(updatedFlight);
});

// Delete a flight (requires admin/supervisor role)
router.delete('/:id', (req, res) => {
    // TODO: Add role verification middleware
    if (!flights.has(req.params.id)) {
        return res.status(404).json({ error: 'Flight not found' });
    }
    flights.delete(req.params.id);
    res.status(204).send();
});

// Search flights
router.get('/search', (req, res) => {
    const { departure, arrival, date } = req.query;
    const results = Array.from(flights.values()).filter(flight => {
        const matchDeparture = !departure || flight.departure === departure;
        const matchArrival = !arrival || flight.arrival === arrival;
        const matchDate = !date || flight.departureTime.startsWith(date);
        return matchDeparture && matchArrival && matchDate;
    });
    res.json(results);
});

// Update flight status (requires ATC role)
router.patch('/:id/status', (req, res) => {
    // TODO: Add role verification middleware
    const flight = flights.get(req.params.id);
    if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }

    const updatedFlight = {
        ...flight,
        status: req.body.status,
        updatedAt: new Date()
    };
    flights.set(flight.id, updatedFlight);
    res.json(updatedFlight);
});

// Assign crew to flight (requires admin/supervisor role)
router.post('/:id/crew', (req, res) => {
    // TODO: Add role verification middleware
    const flight = flights.get(req.params.id);
    if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }

    const updatedFlight = {
        ...flight,
        crew: req.body.crew,
        updatedAt: new Date()
    };
    flights.set(flight.id, updatedFlight);
    res.json(updatedFlight);
});

// Get flight statistics
router.get('/stats/overview', (req, res) => {
    const allFlights = Array.from(flights.values());
    const stats = {
        total: allFlights.length,
        scheduled: allFlights.filter(f => f.status === 'Scheduled').length,
        inProgress: allFlights.filter(f => f.status === 'In Progress').length,
        completed: allFlights.filter(f => f.status === 'Completed').length,
        delayed: allFlights.filter(f => f.status === 'Delayed').length
    };
    res.json(stats);
});

module.exports = router;
