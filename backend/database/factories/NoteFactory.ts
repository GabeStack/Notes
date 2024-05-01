import Note from 'App/Models/Note'
import Factory from '@ioc:Adonis/Lucid/Factory'


export default Factory.define(Note, ({ faker }) => {
  return {
    title: faker.lorem.paragraph(1),
    describe: faker.lorem.paragraph(1),
    favorite: faker.datatype.boolean(),
    color: faker.person.firstName(),
    position: faker.number.int({max: 10})
  }
}).build()
