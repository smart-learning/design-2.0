import net from './net';
import store from './store';

export default {
  // 스토어에 현재 멤버쉽 갱신
  async updateCurrentMembership() {
    store.currentMembership = await net.getMembershipCurrent();
    store.voucherStatus = await net.getVouchersStatus();
  },
};
