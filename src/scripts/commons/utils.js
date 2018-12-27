import net from './net';
import globalStore from './store';

export default {
  async updateCartStatus() {
    try {
      const resp = await net.getCartStatus();
      globalStore.cartItemCount = resp.data.count;
    } catch (e) {
      console.log(e);
    }
  }
};
