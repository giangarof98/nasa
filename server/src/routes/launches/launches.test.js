const request = require('supertest')
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');
const {
    mongoConnect,
    mongoDisconnect
    } = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll( async () => {
       await mongoConnect()
       await loadPlanetsData();
    })

    afterAll(async() => {
        await mongoDisconnect();
    })


    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });
    
    describe('Test POST /launch', () => {
    
        const completeLaunchData = {
            mission: 'URSS Enterprise',
            rocket: 'Ncc 1201-D',
            target: 'Kepler-1652 b',
            launchDate: 'September 6, 2030',
        }
    
        const launchDataWithoutDate = {
            mission: 'URSS Enterprise',
            rocket: 'Ncc 1201-D',
            target: 'Kepler-1652 b',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'URSS Enterprise',
            rocket: 'Ncc 1201-D',
            target: 'Kepler-1652 b',
            launchDate: 'xxx',
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
                const requestDate = new Date(completeLaunchData.launchDate).valueOf();
                const responseDate = new Date(response.body.launchDate).valueOf();
                expect(responseDate).toBe(requestDate);
    
                expect(response.body).toMatchObject(launchDataWithoutDate);
            
        })
        test('It should catch missing required properties', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });
    
    
        test('It should catch invalid dates', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'invalid launch date',
            });
        });
    
    })

});
