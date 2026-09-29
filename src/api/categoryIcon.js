import {
  BriefcaseBusiness,
  CarFront,
  House,
  Laptop,
  Package,
  PlugZap,
  Shirt,
  Smartphone,
  Wrench,
} from 'lucide-react';

const iconMap = {
  immobilier: House,
  automobile: CarFront,
  emploi: BriefcaseBusiness,
  téléphones: Smartphone,
  telephones: Smartphone,
  informatique: Laptop,
  mode: Shirt,
  services: Wrench,
  électronique: PlugZap,
  electronique: PlugZap,
};

export const categoryIcon = (nom) => {
  const key = nom?.toLowerCase().trim();
  return iconMap[key] || Package;
};