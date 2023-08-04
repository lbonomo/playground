import 'dotenv/config'

const words = process.env.WORDS.split(',')

exports.handler = async (event: any, context: any) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            'path': event.path,
            'event': event,
            'context':context
        }),
    };
    return response
    // if ( context.path !== "/" ) {
    //     let jsonResponse = { 'resource': context.path }
    //     const response = {
    //         statusCode: 200,
    //         body: JSON.stringify(jsonResponse),
    //     };
    //     return response
    // } else {


    // }

//     const random = Math.floor(Math.random() * words.length)
//     let jsonResponse = { 'word': words[random] }
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify(jsonResponse),
//     };
//     return response
}