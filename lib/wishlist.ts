import { Product } from "@/interfaces/product";

interface HandleWishlistProps {
  item: Product;
  products: Product[];
  wishlist: Product[];
  setProducts: (item: Product[]) => void;
  setWishlist: (item: Product[]) => void;
}

export const handleAddToWishlist = ({
  item,
  products,
  wishlist,
  setProducts,
  setWishlist,
}: HandleWishlistProps) => {
  let copyProducts = [...products];
  const foundProductItem = products.findIndex(
    (itemInProducts: Product) => itemInProducts.id === item.id
  );
  copyProducts[foundProductItem].isWishlist =
    !copyProducts[foundProductItem].isWishlist;
  setProducts([...copyProducts]);

  if (wishlist.length === 0) {
    item.isWishlist = true;
    setWishlist([...wishlist, item]);
  } else {
    const foundItem = wishlist.findIndex(
      (itemInWishlist: Product) => itemInWishlist.id === item.id
    );

    if (foundItem === -1) {
      item.isWishlist = true;
      setWishlist([...wishlist, item]);
    } else {
      let copyWishlist = [...wishlist];
      copyWishlist = copyWishlist.filter(
        (itemInWishlist) => itemInWishlist.id !== item.id
      );
      setWishlist(copyWishlist);
    }
  }
};
