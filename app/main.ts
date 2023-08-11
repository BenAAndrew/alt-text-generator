console.log(process.env.API_TOKEN)

const API_TOKEN = process.env.API_TOKEN;
const API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large";

export function extractDomain(url: string) {
    const urlObject = new URL(url);
    return `${urlObject.protocol}//${urlObject.host}`;
}

export function isValidURL(str: string) {
    const urlPattern = /^(https?:\/\/)/i;
    return urlPattern.test(str);
}

export async function generateAltText(url: string) {
    console.log()
    const imageRequest = await fetch(url);
    console.log(imageRequest);
    const image = await imageRequest.arrayBuffer();

    const request = await fetch(API_URL, {
        method: 'POST',
        body: image,
        headers: {
          'Content-Type': 'image/png',
          'Authorization': `Bearer ${API_TOKEN!}`
        }
    });
    const response = await request.json();  
    return response[0].generated_text;
}
