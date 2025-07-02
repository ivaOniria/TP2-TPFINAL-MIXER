import { faker } from "@faker-js/faker/locale/en";

const get = () => ({
  nombre: faker.person.fullName(), 
  email: faker.internet.email(),   
  password: faker.internet.password({
    length: 8,                     
    memorable: false,
    pattern: /[A-Za-z0-9!@#]/,
  })
});

export default {
  get
};
