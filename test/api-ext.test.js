import { expect } from 'chai'
import supertest from 'supertest'
import generador from './generador/user.js'

const request = supertest('http://localhost:8080')

describe('*** TEST DEL SERVICIO APIRESTful (ext) ***', () => {
    describe('GET', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get('/api/sounds')
            expect(response.status).to.eql(200)
        })
    })

    describe('POST', () => {
        it('debería incorporar un usuario', async () => {
            const user = generador.get()
            console.log(user)

            const response = await request.post('/api/users/register').send(user)
            expect(response.status).to.eql(201)

            expect(response.body).to.have.property('access_token');
            expect(response.body).to.have.property('expires_in');
            expect(response.body).to.have.property('user');

            const userGuardado = response.body.user;

            expect(userGuardado).to.include.keys('_id', 'nombre', 'email');
            expect(userGuardado._id).to.be.a('string');
            expect(userGuardado.nombre).to.eql(user.nombre);
            expect(userGuardado.email).to.eql(user.email);
        })
    })

})