const Joi = require('joi');

const postTemplate = Joi.object().keys({
    id: Joi.number(),
    dateCreated: Joi.date(),
    title: Joi.string(),
    content: Joi.object()
})

var newPost = async (post) => {


    return await Joi.validate({
        id: post.id,
        dateCreated: new Date(),
        title: post.title,
        content: {
            testObject: 'test'
        }
    }, postTemplate, (err, value) => {
        if (err) {
            return err.details
        }
        return value

    });

}

var test = newPost({
    id: 1,
    title: 'hello'
})

console.log(test)

// module.exports = {
//     postTemplate
// }