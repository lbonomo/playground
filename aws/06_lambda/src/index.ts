import 'dotenv/config'

const words = process.env.WORDS.split(',')

exports.handler = async (event: any, context: any) => {
    const random = Math.floor(Math.random() * words.length)
    let jsonResponse = { 'word': words[random] }
    const response = {
        statusCode: 200,
        body: JSON.stringify(jsonResponse),
    };
    return response
}