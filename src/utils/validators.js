export const validarCedula = (value) => {
  const regex = /^\d{6,9}$/;
  return regex.test(value);
};

export const validarPassword = (value) => {
  const regex = /^[\w!@#$%^&*]{6,20}$/;
  return regex.test(value);
};
