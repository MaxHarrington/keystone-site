export const discourse = process.env.FORUM_URL ?? 'https://localhost:3000';
export const keystone = process.env.ADMIN_URL ?? 'https://localhost:3100';
export const frontend = process.env.PUBLIC_URL ?? 'https://localhost:3000';
export const keycloak = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;
export const navigation = {
    'forum': discourse,
    'privacy': `${discourse}/privacy`,
    'terms': `${discourse}/terms`,
    'admin': keystone,
    'base': frontend,
    'about': '/content/about',
    'posts': '/content/posts',
    'posters': '/content/posters',
    'tags': '/content/tags',
    'account': '/account',
    'join': '/account'
};
export const clientID = process.env.KEYCLOAK_CLIENT ?? 'redstack';
const loginArgs = `?client_id=${clientID}&` +
    'scope=openid%20profile&' +
    'response_type=code&' +
    `redirect_uri=`;
export const clientSecret = process.env.KEYCLOAK_SECRET ?? 'PASSWORD';
export const redirectURI = keystone ?? 'https://localhost:3100';
export const login = `${keycloak}/protocol/openid-connect/auth${loginArgs}`;
export const manage = `${keycloak}/account`;
export const logout = `${keycloak}/protocol/openid-connect/logout`;