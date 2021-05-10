import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient } from 'graphql-request';
import { getAccessToken } from '@auth0/nextjs-auth0';
const endpoint = process.env.NEXT_PUBLIC_HASURA_API_ENDPOINT;

const userRequestHeader = async (req, res) => {
  const headers = {};
  try {
    const { accessToken } = await getAccessToken(req, res);

    headers['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    headers['X-Hasura-Role'] = 'public';
  } finally {
    return headers;
  }
};

export default async function graphql(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user acces_token IF available
    const headers = await userRequestHeader(req, res);
    const { query, variables, admin } = req.body;
    if (admin) {
      headers['x-hasura-admin-secret'] = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    }
    const graphQLClient = new GraphQLClient(endpoint);
    graphQLClient.setHeaders(headers);
    const data = await graphQLClient.request(query, variables);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
}
