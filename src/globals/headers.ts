/**
 * Headers used in requests to the EduSign API.
 * Include the bearer token needed for each request.
 */
export const apiHeaders = {
    'Authorization': `Bearer ${process.env.EDUSIGN_BEARER_TOKEN}`,
    'Content-Type': 'application/json'
}