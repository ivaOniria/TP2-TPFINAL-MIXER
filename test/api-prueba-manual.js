import axios from 'axios'
import supertest from 'supertest'


const pruebaServidorConAxios = async () => {
    const url = 'http://localhost:8080/api/productos/6488a79f4fd37490874139b8'

    try {
        const {data:body, status} = await axios(url)
        console.log('status code', status)
        console.log('body', body)
    }
    catch(error) {
        console.log('error', error.message)
    }
}

const pruebaServidorConSuperTest = async () => {
    const url = 'http://localhost:8080/api/productos'

    try {
        const request = supertest(url)

        const {body, status} = await request.get('/6488a79f4fd37490874139b8')
        console.log('status code', status)
        console.log('body', body)
    }
    catch(error) {
        console.log('error', error.message)
    }
}

//pruebaServidorConAxios()
pruebaServidorConSuperTest()