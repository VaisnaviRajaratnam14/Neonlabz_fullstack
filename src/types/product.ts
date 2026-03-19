export type Product = {
  id: number;
  title: string;
  description: string;
  stockNo: number;
  price: string;
  discountPrice: string;
  createdAt: string;
};

export type ProductInput = {
  id?: number;
  title: string;
  description: string;
  stockNo: number;
  price: number;
  discountPrice: number;
};
