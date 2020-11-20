export const AuthConfigForWeb = () => `Bearer ${localStorage.getItem("jwt")}`;
