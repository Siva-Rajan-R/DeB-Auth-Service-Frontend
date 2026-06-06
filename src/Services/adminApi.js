import { useNetworkCalls } from '../Utils/NetworkCalls';

export const useAdminApi = () => {
  const { call } = useNetworkCalls();

  const getUsers = async (apikey) => {
    return call({ method: 'GET', path: '/admin/users', headers: { 'x-api-key': apikey }, withCred: true });
  };

  const addUser = async (apikey, user) => {
    return call({ method: 'POST', path: '/admin/users', body: user, headers: { 'x-api-key': apikey }, withCred: true });
  };

  const updateUser = async (apikey, user) => {
    return call({ method: 'PUT', path: '/admin/users', body: user, headers: { 'x-api-key': apikey }, withCred: true });
  };

  const getRoles = async (apikey) => {
    return call({ method: 'GET', path: '/admin/roles', headers: { 'x-api-key': apikey }, withCred: true });
  };

  const addRole = async (apikey, role) => {
    return call({ method: 'POST', path: '/admin/roles', body: role, headers: { 'x-api-key': apikey }, withCred: true });
  };

  const removeRole = async (apikey, roleId) => {
    return call({ method: 'DELETE', path: `/admin/roles/${roleId}`, headers: { 'x-api-key': apikey }, withCred: true });
  };

  const revokeSession = async (apikey, sessionType, sessionId) => {
    return call({ method: 'DELETE', path: `/admin/sessions/${sessionType}/${sessionId}`, headers: { 'x-api-key': apikey }, withCred: true });
  };

  return { getUsers, addUser, updateUser, getRoles, addRole, removeRole, revokeSession };
};
