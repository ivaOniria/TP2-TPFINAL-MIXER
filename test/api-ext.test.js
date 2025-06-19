import { expect } from 'chai'
import supertest from 'supertest'

const request = supertest('http://localhost:8080')

describe('*** TEST DEL SERVICIO APIRESTful (ext) ***', () => {
    describe('GET', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get('/api/sonidos')
            expect(response.status).to.eql(200)
        })
    })

    describe('POST', () => {
        it('debería incorporar un producto', async () => {
            //const producto = generador.get() REEMPLAZAR POR UN OBJETO REAL
            //console.log(producto)

            const response = await request.post('/api/sonidos').send(producto)
            expect(response.status).to.eql(200)

            const sonidoGuardado = response.body
            expect(sonidoGuardado).to.include.keys('nombre','url','tipo','tamanio','duracion','_id')

            expect(sonidoGuardado.nombre).to.eql(sonido.nombre)
            expect(sonidoGuardado.url).to.eql(sonido.url)
            expect(sonidoGuardado.tipo).to.eql(sonido.tipo)
            expect(sonidoGuardado.tamanio).to.eql(sonido.tamanio)
            expect(sonidoGuardado.duracion).to.eql(sonido.duracion)
            expect(sonidoGuardado._id).to.eql(sonido._id)
        })
    })

    /* describe('PUT', () => {
        
    })

    describe('DELETE', () => {
        
    }) */
})