import { ItemInCart } from "@/interfaces/shop";

interface HandleAddToCart {
  item: ItemInCart;
  cart: ItemInCart[];
  setCart: (item: ItemInCart[]) => void;
}

export const handleAddToCart = ({ item, cart, setCart }: HandleAddToCart) => {
  if (cart.length === 0) {
    item.amount = 1;
    setCart([...cart, item]);
  } else {
    const copyCart = [...cart];
    const foundItem = copyCart.findIndex(
      (itemInCart) => itemInCart.id === item.id
    );

    if (foundItem === -1) {
      item.amount = 1;
      setCart([...copyCart, item]);
    } else {
      copyCart[foundItem].amount = copyCart[foundItem].amount + 1;
      setCart(copyCart);
    }
  }
};

export const handleRemoveFromCart = ({
  item,
  cart,
  setCart,
}: HandleAddToCart) => {
  if (cart.length > 0) {
    let copyCart = [...cart];
    const foundItemInCart = copyCart.findIndex(
      (itemInCart) => itemInCart.id === item.id
    );

    if (foundItemInCart !== -1 && copyCart[foundItemInCart].amount > 1) {
      copyCart[foundItemInCart].amount = copyCart[foundItemInCart].amount - 1;
    } else if (
      foundItemInCart !== -1 &&
      copyCart[foundItemInCart].amount <= 1
    ) {
      copyCart = copyCart.filter((itemInCart) => itemInCart.id !== item.id);
    }

    setCart(copyCart);
  }
};
