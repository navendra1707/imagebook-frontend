const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const checkSession = (session, setCookie) => {
  if (!session) return true;
  const token = parseJwt(session);
  const isTrue = token.exp * 1000 < Date.now();
  if (isTrue) {
    setCookie("token", null);
  }
  return isTrue;
};

export default checkSession;
