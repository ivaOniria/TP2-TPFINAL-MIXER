import { expect } from 'chai'


describe('*** TEST DEL GENERADOR DE sonido ***', () => {
    it('el sonido debe contener los campos nombre, precio y stock', () => { // MODIFICAR
        const sonido = generador.get()
        //console.log(sonido)
        expect(sonido).to.include.keys('nombre','precio','stock') // MODIFICAR
    })

/*     it('debería generar sonidos aleatorios', () => {
        const sonido1 = generador.get()
        const sonido2 = generador.get()

        expect(sonido1.nombre).not.to.eql(sonido2.nombre) // MODIFICAR
        expect(sonido1.precio).not.to.eql(sonido2.precio) // MODIFICAR
        expect(sonido1.stock).not.to.eql(sonido2.stock) // MODIFICAR
    }) */
})