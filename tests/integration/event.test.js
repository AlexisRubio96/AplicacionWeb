const {Event, validateEvent} = require('../models/event');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/event', () => {
    describe('POST /:name', () => {

        it('should return a event given its name', async () => {

            const events = new Event({
                name: req.body.name,
                location: req.body.location,
                dateStart: req.body.dateStart,
                dateEnd: req.body.dateEnd,
                description: req.body.description,
                organizer: req.body.organizer,
                //sprite: req.body.sprite,
                types: req.body.types
            });
            await events.save();

            const res = await request(server).post(`/event/${ events.name }`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', event.name);

        });

        it('should return 404 if invalid name is passed', async () => {
            const res = await request(server).get(`/event/cena`);
            expect(res.status).toBe(404);
        });

    });
});