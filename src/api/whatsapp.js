export const whatsappUrl = (telephone, message) => {
  const digits = telephone?.replace(/\D/g, '') || '';
  if (!digits) return '';

  let numero = digits;
  if (numero.startsWith('00')) {
    numero = numero.slice(2);
  } else if (numero.startsWith('0') && numero.length === 10) {
    numero = `221${numero.slice(1)}`;
  } else if (numero.length === 9) {
    numero = `221${numero}`;
  }

  if (numero.length < 8 || numero.length > 15) return '';
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
};