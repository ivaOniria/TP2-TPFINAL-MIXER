console.log('Hola App')

// IIFE
;(async () => {
    try {
        const response = await fetch('http://localhost:8080/api/sonidos')
        //const response = await fetch('/api/sonidos')
        const sonidos = await response.json()
        console.log(sonidos)
    }
    catch(error) {
        console.error('Error en fetch:', error.message)
    }
})()