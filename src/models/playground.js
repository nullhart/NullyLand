const postTemplate = require('./post')



var test1 = postTemplate.parse({
    id: 'hello',
    dateCreated: new Date(),
    title: 'test title',
    content: {
        testObject: 'test'
    }
})


console.log(test1)